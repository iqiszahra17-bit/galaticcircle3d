# GALACTIC CIRCLE 🪐
> **"Explore the Galaxy, Master the Circle."**  
> *Game Edukasi Matematika Interaktif Geometri Lingkaran untuk Siswa SMA Kelas XI.*

---

## 🌟 1. Deskripsi Proyek
**GALACTIC CIRCLE** adalah web application game edukasi matematika futuristik bertema eksplorasi luar angkasa 3D yang dirancang khusus untuk pembelajaran geometri lingkaran siswa SMA Kelas XI. Pemain berperan sebagai Kadet Antariksa yang bertualang menjelajahi empat sektor planet untuk memecahkan 20 misi geometri presisi tinggi dengan diagram vektor dinamis, sistem ekonomi XP & Kristal Kosmik, perolehan badge pencapaian, papan peringkat online, serta Command Center admin.

---

## 🚀 2. Mengapa Ekstensi "Go Live" Tidak Berfungsi Langsung?
Ekstensi **"Go Live"** (Live Server di VS Code) dirancang untuk website statis berbasis file HTML murni.  
Aplikasi **GALACTIC CIRCLE** dibangun menggunakan ekosistem modern **React + TypeScript + Vite + Tailwind CSS**, di mana file `index.html` memuat script modul TypeScript (`/src/main.tsx`). Browser tidak dapat membaca file `.tsx` secara langsung tanpa proses kompilasi bundler.

### ✅ Cara Menjalankan Website (Rekomendasi Utama):
Buka terminal di folder proyek (`c:\Users\USER\Desktop\GALATIC 3D`) dan jalankan:
```bash
npm run dev
```
Server Vite akan langsung berjalan dan menampilkan link:
👉 **[http://localhost:5173/](http://localhost:5173/)**

Buka tautan tersebut di peramban (Chrome, Edge, Firefox, dsb.) untuk menikmati game dengan fitur lengkap dan efek suara.

---

## 🛠️ 3. Teknologi yang Digunakan
- **Frontend Core**: React 18, TypeScript, Vite 6
- **Styling**: Tailwind CSS & Modern Glassmorphism Design System
- **Tema Palet Warna**:
  - Deep Navy: `#050B1A`
  - Space Blue: `#07152B`
  - Neon Cyan: `#00E5FF`
  - Cosmic Violet: `#7861FF`
  - Galactic Gold: `#FFD34E`
  - Soft White: `#F2F7FF`
- **Ikon**: Lucide React
- **Diagram Matematika**: SVG Vektor Dinamis & Terkalibrasi Proporsional
- **Audio Sintesis**: Web Audio API Sound Synthesizer (Bebas file aset audio eksternal)
- **Database & Autentikasi**: Supabase Auth & PostgreSQL (dengan fallback persistensi lokal cerdas)
- **Keamanan**: Row Level Security (RLS) PostgreSQL & Anti-Formula Injection Sanitizer pada ekspor CSV
- **Testing**: Vitest Automated Math & Security Test Suite

---

## 🪐 4. Struktur 4 Planet & 20 Soal Geometri
Tepat 4 planet dengan 5 soal bertahap per planet (Total 20 soal utama terkalibrasi kurikulum):

| Planet | Materi Pokok | Tingkat Kesulitan | Rumus Utama |
|---|---|---|---|
| **Planet I: Tangensia** | GSPL & GSPD Lingkaran | Medium → Challenging | $L_{GSPL} = \sqrt{d^2 - (R - r)^2}$<br>$L_{GSPD} = \sqrt{d^2 - (R + r)^2}$ |
| **Planet II: Angularis** | Sudut Pusat, Keliling, Segiempat Siklik | Medium → Challenging | $\text{Sudut Pusat} = 2 \times \text{Sudut Keliling}$<br>$\angle A + \angle C = 180^\circ$ |
| **Planet III: Arcadia** | Panjang Busur & Luas Juring Lingkaran | Medium → Challenging | $s = \frac{\theta}{360^\circ} \times 2\pi r$<br>$A = \frac{\theta}{360^\circ} \times \pi r^2$ ($\pi = \frac{22}{7}$) |
| **Planet IV: Nexus** | Sintesis Terpadu Multi-Sistem | Medium → Challenging | Gabungan Garis Singgung, Sudut Pusat/Keliling, Busur & Juring |

---

## 🛡️ 5. Database Supabase & Row Level Security (RLS)

File migrasi database lengkap tersedia di:
`supabase/migrations/20261024_galactic_circle_init.sql`

Tabel yang dirancang:
1. `profiles`: Data profil pengguna, XP, kristal, level, avatar, dan role admin.
2. `game_progress`: Status pembukaan 4 planet (`locked`, `unlocked`, `in_progress`, `completed`).
3. `mission_results`: Log riwayat percobaan misi (skor, jumlah benar, akurasi, waktu pengerjaan).
4. `achievements`: Katalog 8 badge pencapaian.
5. `user_achievements`: Relasi pencapaian pengguna yang telah dibuka.
6. `admin_roles`: Otorisasi hak akses administrator.
7. `public_leaderboard`: View aman untuk menampilkan ranking tanpa membocorkan email atau data sensitif.

### Konfigurasi Cloud Supabase:
1. Buat proyek baru di [Supabase Dashboard](https://supabase.com).
2. Salin isi file `supabase/migrations/20261024_galactic_circle_init.sql` dan jalankan pada **SQL Editor** Supabase.
3. Buat file `.env.local` di root folder proyek:
   ```env
   VITE_SUPABASE_URL=https://proyek-anda.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJI...
   ```
4. Restart development server (`npm run dev`). Indikator di navbar akan berubah otomatis menjadi **"Supabase Cloud"**.

> **Mode Simulasi Lokal (Offline-First):**  
> Jika kredensial Supabase belum diisi, aplikasi **tetap dapat dimainkan dan diuji 100% secara langsung** menggunakan simulasi LocalStorage.

---

## 👑 6. Prosedur Mengatur Admin Pertama
Untuk memberikan hak akses Admin:

### A. Pada Mode Supabase Cloud:
Jalankan query berikut di SQL Editor Supabase:
```sql
UPDATE public.profiles
SET is_admin = TRUE
WHERE email = 'email_admin_anda@domain.com';

INSERT INTO public.admin_roles (user_id, role)
SELECT id, 'admin' FROM public.profiles WHERE email = 'email_admin_anda@domain.com'
ON CONFLICT (user_id) DO NOTHING;
```

### B. Pada Mode Simulasi Lokal:
Gunakan akun bawaan siap pakai:
- **Email**: `admin@galactic.edu`
- **Password**: `admin123`
*(Atau klik tombol cepat **"Admin Demo"** pada modal login).*

---

## 🧪 7. Menjalankan Pengujian Otomatis
Seluruh formula matematika, normalisasi bentuk akar, dan keamanan ekspor CSV diuji otomatis menggunakan Vitest:
```bash
npm test
```
Hasil: **38 / 38 pengujian lolos tanpa kegagalan.**

---

## 📦 8. Build untuk Produksi
Untuk mengompilasi bundel statis teroptimasi:
```bash
npm run build
```
File hasil build akan berada di direktori `dist/`. Untuk mempratinjau build produksi secara lokal:
```bash
npm run preview
```

---

## 🌐 9. Panduan Deploy ke Netlify (Clean URLs)
Proyek ini sudah terkonfigurasi secara otomatis untuk deploy ke Netlify tanpa memunculkan akhiran `/index.html` atau error 404 pada routing SPA:

1. **Build command**: `npm run build`
2. **Publish directory**: `dist`
3. Pengalihan SPA ditangani oleh file [`netlify.toml`](./netlify.toml) dan [`public/_redirects`](./public/_redirects).
4. URL peramban akan bersih (misal: `https://domain-anda.netlify.app/`) tanpa redirect paksa ke `./dist/index.html`.
