-- =========================================================================
-- GALACTIC CIRCLE 3D: SUPABASE PRODUCTION DATABASE SCHEMA & POLICIES
-- SMA KELAS XI MATEMATIKA: GEOMETRI LINGKARAN
-- =========================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT DEFAULT 'https://api.dicebear.com/7.x/bottts/svg?seed=Cadet1',
    xp INTEGER DEFAULT 0 CHECK (xp >= 0),
    crystals INTEGER DEFAULT 0 CHECK (crystals >= 0),
    level INTEGER DEFAULT 1 CHECK (level >= 1),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL GAME PROGRESS
CREATE TABLE IF NOT EXISTS public.game_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    planet_id TEXT NOT NULL,
    questions_completed INTEGER DEFAULT 0 CHECK (questions_completed >= 0 AND questions_completed <= 5),
    highest_score INTEGER DEFAULT 0 CHECK (highest_score >= 0),
    status TEXT DEFAULT 'unlocked' CHECK (status IN ('locked', 'unlocked', 'in_progress', 'completed')),
    stars INTEGER DEFAULT 0 CHECK (stars >= 0 AND stars <= 20),
    module_completed BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, planet_id)
);

ALTER TABLE public.game_progress 
    ADD COLUMN IF NOT EXISTS stars INTEGER DEFAULT 0 CHECK (stars >= 0 AND stars <= 20),
    ADD COLUMN IF NOT EXISTS module_completed BOOLEAN DEFAULT FALSE;

-- 4. TABEL MISSION RESULTS DENGAN VALIDASI CHECK
CREATE TABLE IF NOT EXISTS public.mission_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    planet_id TEXT NOT NULL,
    planet_name TEXT NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 600),
    correct_count INTEGER NOT NULL CHECK (correct_count >= 0 AND correct_count <= 5),
    total_questions INTEGER DEFAULT 5 CHECK (total_questions = 5),
    accuracy NUMERIC(5, 2) NOT NULL CHECK (accuracy >= 0 AND accuracy <= 100),
    stars_earned INTEGER DEFAULT 0 CHECK (stars_earned >= 0 AND stars_earned <= 20),
    xp_earned INTEGER NOT NULL CHECK (xp_earned >= 0),
    crystals_earned INTEGER NOT NULL CHECK (crystals_earned >= 0),
    time_spent_seconds INTEGER DEFAULT 0 CHECK (time_spent_seconds >= 0),
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.mission_results 
    ADD COLUMN IF NOT EXISTS stars_earned INTEGER DEFAULT 0 CHECK (stars_earned >= 0 AND stars_earned <= 20);

-- 5. TABEL ACHIEVEMENTS CATALOG
CREATE TABLE IF NOT EXISTS public.achievements (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('planet', 'score', 'mastery', 'speed')),
    required_condition TEXT NOT NULL
);

-- 6. TABEL USER ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_code TEXT NOT NULL REFERENCES public.achievements(code) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_code)
);

-- 7. TABEL ADMIN ROLES
CREATE TABLE IF NOT EXISTS public.admin_roles (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
    granted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SEED INITIAL ACHIEVEMENTS CATALOG
INSERT INTO public.achievements (code, name, description, icon, category, required_condition)
VALUES
    ('cadet_tangensia', 'Penakluk Tangensia', 'Menyelesaikan seluruh 5 misi garis singgung di Planet Tangensia.', 'Compass', 'planet', 'Selesaikan Planet Tangensia'),
    ('master_angularis', 'Penguasa Angularis', 'Menguasai formasi sudut pusat, keliling, dan segiempat siklik di Planet Angularis.', 'RotateCw', 'planet', 'Selesaikan Planet Angularis'),
    ('architect_arcadia', 'Arsitek Busur Arcadia', 'Menghitung kalkulasi busur orbital dan juring surya di Planet Arcadia.', 'PieChart', 'planet', 'Selesaikan Planet Arcadia'),
    ('overlord_nexus', 'Master Galaksi Nexus', 'Menaklukkan tantangan klimaks sintesis geometri lingkaran di Nexus.', 'Award', 'planet', 'Selesaikan seluruh 4 Planet'),
    ('perfectionist', 'Presisi Sempurna', 'Menyelesaikan sebuah misi planet dengan akurasi 100% (semua 5 soal benar).', 'Sparkles', 'mastery', 'Akurasi 100% dalam satu misi'),
    ('speed_star', 'Kecepatan Warp', 'Menyelesaikan seluruh soal dalam satu planet dalam waktu kurang dari 3 menit.', 'Zap', 'speed', 'Selesai < 180 detik'),
    ('crystal_hoarder', 'Kolektor Kristal Kosmik', 'Mengumpulkan lebih dari 100 Kristal Kosmik dari penyelesaian misi.', 'Gem', 'score', 'Koleksi 100+ Kristal'),
    ('grandmaster', 'Grandmaster Lingkaran SMA', 'Mencapai Level 4 dengan akumulasi lebih dari 1.500 XP.', 'ShieldCheck', 'mastery', 'Level 4 & 1.500+ XP')
ON CONFLICT (code) DO NOTHING;

-- =========================================================================
-- SECURE PUBLIC LEADERBOARD VIEW
-- =========================================================================
CREATE OR REPLACE VIEW public.public_leaderboard 
WITH (security_invoker = true) AS
SELECT
    p.id AS user_id,
    p.display_name,
    p.avatar_url,
    p.level,
    COALESCE(SUM(mr.score), 0)::INTEGER AS total_score,
    p.xp AS total_xp,
    p.crystals AS total_crystals,
    COUNT(DISTINCT mr.planet_id)::INTEGER AS missions_completed,
    COALESCE(ROUND(AVG(mr.accuracy), 1), 0)::NUMERIC(5, 1) AS accuracy,
    MAX(mr.completed_at) AS last_active
FROM public.profiles p
LEFT JOIN public.mission_results mr ON p.id = mr.user_id
GROUP BY p.id, p.display_name, p.avatar_url, p.level, p.xp, p.crystals;

-- =========================================================================
-- VALIDASI SERVER-SIDE & ANTI-CHEAT ENGINE
-- =========================================================================

-- Helper: Cek status admin dengan aman
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND is_admin = TRUE
    );
END;
$$;

-- Trigger 1: Validasi Skor & Hitung XP/Kristal di Server (Jangan Percaya Frontend)
CREATE OR REPLACE FUNCTION public.validate_and_calculate_mission()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
    -- Pastikan user_id sesuai dengan sesi auth saat ini
    IF NEW.user_id <> auth.uid() THEN
        RAISE EXCEPTION 'Akses ditolak: user_id tidak sesuai dengan sesi pengguna.';
    END IF;

    -- Batasi skor maksimal 600
    IF NEW.score > 600 THEN
        NEW.score := 600;
    END IF;

    -- Batasi jumlah benar 0 - 5
    IF NEW.correct_count > 5 THEN
        NEW.correct_count := 5;
    ELSIF NEW.correct_count < 0 THEN
        NEW.correct_count := 0;
    END IF;

    -- Hitung ulang akurasi, bintang, XP, dan kristal secara otoritatif di server
    NEW.accuracy := round((NEW.correct_count::numeric / 5.0) * 100, 2);
    NEW.stars_earned := least(20, round((NEW.correct_count::numeric / 5.0) * 20));
    NEW.xp_earned := NEW.score + (NEW.correct_count * 25);
    NEW.crystals_earned := floor(NEW.score / 15) + (CASE WHEN NEW.correct_count = 5 THEN 15 ELSE 0 END);

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_mission_result ON public.mission_results;
CREATE TRIGGER trg_validate_mission_result
    BEFORE INSERT ON public.mission_results
    FOR EACH ROW EXECUTE FUNCTION public.validate_and_calculate_mission();

-- Trigger 2: Otomatis Tambahkan XP & Kristal ke Profil setelah Misi Berhasil
CREATE OR REPLACE FUNCTION public.sync_profile_xp_on_mission()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
    UPDATE public.profiles
    SET xp = xp + NEW.xp_earned,
        crystals = crystals + NEW.crystals_earned,
        level = greatest(1, floor((xp + NEW.xp_earned) / 500) + 1),
        updated_at = now()
    WHERE id = NEW.user_id;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_profile_xp ON public.mission_results;
CREATE TRIGGER trg_sync_profile_xp
    AFTER INSERT ON public.mission_results
    FOR EACH ROW EXECUTE FUNCTION public.sync_profile_xp_on_mission();

-- Trigger 3: Proteksi Kolom Profil (Pemain Tidak Boleh Ubah is_admin atau Edit XP Sendiri)
CREATE OR REPLACE FUNCTION public.protect_profile_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
    -- Pemain biasa tidak boleh mengubah status is_admin
    IF NEW.is_admin IS DISTINCT FROM OLD.is_admin THEN
        IF NOT public.is_admin() THEN
            NEW.is_admin := OLD.is_admin;
        END IF;
    END IF;

    -- Pemain biasa tidak boleh mengedit langsung XP, Crystals, atau Level via client
    IF NOT public.is_admin() THEN
        NEW.xp := OLD.xp;
        NEW.crystals := OLD.crystals;
        NEW.level := OLD.level;
    END IF;

    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile ON public.profiles;
CREATE TRIGGER trg_protect_profile
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.protect_profile_fields();

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

-- Profiles: Hanya bisa update display_name dan avatar_url milik sendiri
DROP POLICY IF EXISTS "Public profiles can be viewed by anyone" ON public.profiles;
CREATE POLICY "Public profiles can be viewed by anyone"
    ON public.profiles FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Game Progress: Hanya bisa mengelola progres diri sendiri
DROP POLICY IF EXISTS "Users can view own game progress or admin" ON public.game_progress;
CREATE POLICY "Users can view own game progress or admin"
    ON public.game_progress FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert own game progress" ON public.game_progress;
CREATE POLICY "Users can insert own game progress"
    ON public.game_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own game progress" ON public.game_progress;
CREATE POLICY "Users can update own game progress"
    ON public.game_progress FOR UPDATE
    USING (auth.uid() = user_id);

-- Mission Results: Publik bisa baca skor untuk Leaderboard, Insert hanya milik sendiri
DROP POLICY IF EXISTS "Anyone can view mission results for leaderboard" ON public.mission_results;
DROP POLICY IF EXISTS "Users can view own mission results or admin or leaderboard" ON public.mission_results;
CREATE POLICY "Anyone can view mission results for leaderboard"
    ON public.mission_results FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can insert own mission results" ON public.mission_results;
CREATE POLICY "Users can insert own mission results"
    ON public.mission_results FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Achievements Catalog
DROP POLICY IF EXISTS "Anyone can read achievement catalog" ON public.achievements;
CREATE POLICY "Anyone can read achievement catalog"
    ON public.achievements FOR SELECT
    USING (true);

-- User Achievements
DROP POLICY IF EXISTS "Users can view own unlocked achievements or admin" ON public.user_achievements;
CREATE POLICY "Users can view own unlocked achievements or admin"
    ON public.user_achievements FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert own achievements" ON public.user_achievements;
CREATE POLICY "Users can insert own achievements"
    ON public.user_achievements FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Admin Roles
DROP POLICY IF EXISTS "Admins can view admin roles" ON public.admin_roles;
CREATE POLICY "Admins can view admin roles"
    ON public.admin_roles FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

-- =========================================================================
-- TRIGGER: BUAT PROFIL KADET OTOMATIS SAAT USER ANONIM/REGISTER TERCIPTA
-- =========================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
    gen_username text;
    gen_display_name text;
BEGIN
    gen_username := COALESCE(
        new.raw_user_meta_data->>'username',
        'kadet_' || substr(new.id::text, 1, 6)
    );
    gen_display_name := COALESCE(
        new.raw_user_meta_data->>'display_name',
        'KADET ' || upper(substr(new.id::text, 1, 4))
    );

    INSERT INTO public.profiles (
        id, email, username, display_name, avatar_url, xp, crystals, level, is_admin
    )
    VALUES (
        new.id,
        new.email,
        gen_username,
        gen_display_name,
        COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/bottts/svg?seed=' || new.id),
        0,
        0,
        1,
        FALSE
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.game_progress (
        user_id, planet_id, questions_completed, highest_score, status, stars, module_completed
    )
    VALUES (
        new.id,
        'tangensia',
        0,
        0,
        'unlocked',
        0,
        FALSE
    )
    ON CONFLICT (user_id, planet_id) DO NOTHING;

    RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================================
-- GRANTS MINIMUM HAK AKSES
-- =========================================================================
REVOKE INSERT, UPDATE, DELETE ON public.profiles FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.game_progress FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.mission_results FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.achievements FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.user_achievements FROM anon;
REVOKE ALL ON public.admin_roles FROM anon;

GRANT SELECT ON public.public_leaderboard TO anon, authenticated;
GRANT SELECT ON public.achievements TO anon, authenticated;
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT SELECT ON public.mission_results TO anon, authenticated;
GRANT SELECT ON public.game_progress TO anon, authenticated;

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.game_progress TO authenticated;
GRANT SELECT, INSERT ON public.mission_results TO authenticated;
GRANT SELECT, INSERT ON public.user_achievements TO authenticated;
GRANT SELECT, INSERT ON public.admin_roles TO authenticated;

-- =========================================================================
-- CARA MENGANGKAT ADMIN PERTAMA (Opsional di SQL Editor):
-- UPDATE public.profiles SET is_admin = TRUE WHERE username = 'kadet_xxxxxx';
-- INSERT INTO public.admin_roles (user_id, role)
-- SELECT id, 'admin' FROM public.profiles WHERE username = 'kadet_xxxxxx'
-- ON CONFLICT (user_id) DO NOTHING;
-- =========================================================================
