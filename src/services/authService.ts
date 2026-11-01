import { supabase, isSupabaseConfigured } from './supabase';
import { UserProfile } from '../types/game';

const LOCAL_STORAGE_USER_KEY = 'galactic_circle_active_user';
const LOCAL_STORAGE_USERS_DB = 'galactic_circle_local_users';

interface LocalUserAccount {
  id: string;
  email: string;
  passwordHash: string;
  profile: UserProfile;
}

export class AuthService {
  public isCloudMode(): boolean {
    return isSupabaseConfigured && supabase !== null;
  }

  /**
   * Get current user profile. If no user exists, auto-creates a persistent local Cadet profile
   * so players NEVER need to enter an email to play and save their scores!
   */
  public async getCurrentProfile(): Promise<UserProfile> {
    if (this.isCloudMode() && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          let { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error || !data) {
            const defaultName = (user.user_metadata?.display_name as string) || 'KADET ' + user.id.slice(0, 4).toUpperCase();
            const defaultUsername = (user.user_metadata?.username as string) || 'kadet_' + user.id.slice(0, 6);
            const { data: inserted } = await supabase
              .from('profiles')
              .upsert({
                id: user.id,
                email: user.email || null,
                username: defaultUsername,
                display_name: defaultName,
                avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`,
                xp: 0,
                crystals: 0,
                level: 1,
                is_admin: false,
              }, { onConflict: 'id' })
              .select('*')
              .single();
            data = inserted;
          }

          if (data) {
            const profile: UserProfile = {
              id: data.id,
              email: data.email,
              username: data.username,
              displayName: data.display_name,
              avatarUrl: data.avatar_url,
              xp: data.xp,
              crystals: data.crystals,
              level: data.level,
              isAdmin: data.is_admin,
              createdAt: data.created_at,
              updatedAt: data.updated_at,
            };
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
            return profile;
          }
        }
      } catch (err) {
        console.error('Error fetching Supabase user profile:', err);
      }
    }

    // Local Storage persistent cadet
    const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as UserProfile;
        if (parsed && parsed.id) {
          return parsed;
        }
      } catch {
        // Parse error fallback
      }
    }

    // Auto-create default persistent cadet for seamless instant gameplay
    const autoCadet: UserProfile = {
      id: 'cadet-local-01',
      username: 'kadet_antariksa',
      displayName: 'KADET ANTARIKSA',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=CadetNova',
      xp: 0,
      crystals: 0,
      level: 1,
      isAdmin: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(autoCadet));

    // Also register in local users list for leaderboard
    const rawUsers = localStorage.getItem(LOCAL_STORAGE_USERS_DB);
    const users: LocalUserAccount[] = rawUsers ? JSON.parse(rawUsers) : [];
    if (!users.some((u) => u.profile.id === autoCadet.id)) {
      users.push({
        id: autoCadet.id,
        email: 'local_cadet@galactic.edu',
        passwordHash: '',
        profile: autoCadet,
      });
      localStorage.setItem(LOCAL_STORAGE_USERS_DB, JSON.stringify(users));
    }

    return autoCadet;
  }

  /**
   * Fast Name Update without needing email or password
   */
  public async updatePlayerName(newName: string): Promise<UserProfile> {
    const current = await this.getCurrentProfile();
    const cleanName = newName.trim() || 'KADET ANTARIKSA';
    const cleanUsername = cleanName.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'kadet';

    const updated: UserProfile = {
      ...current,
      displayName: cleanName,
      username: cleanUsername,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanName)}`,
      updatedAt: new Date().toISOString(),
    };

    return this.updateProfile(updated);
  }

  // Sign Up (Optional for cloud)
  public async signUp(
    email: string,
    password: string,
    displayName: string,
    username: string
  ): Promise<{ user: UserProfile | null; error: string | null }> {
    if (!email || !email.includes('@')) {
      return { user: null, error: 'Format email tidak valid.' };
    }
    if (!password || password.length < 6) {
      return { user: null, error: 'Kata sandi minimal 6 karakter.' };
    }

    const cleanUsername = (username || email.split('@')[0]).trim().toLowerCase().replace(/[^a-z0-9_]/g, '');

    if (this.isCloudMode() && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: cleanUsername,
              display_name: displayName,
              avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`,
            },
          },
        });

        if (error) return { user: null, error: error.message };

        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            username: cleanUsername,
            displayName,
            avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`,
            xp: 0,
            crystals: 0,
            level: 1,
            isAdmin: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
          return { user: profile, error: null };
        }
      } catch (err: unknown) {
        return { user: null, error: (err as Error).message || 'Gagal mendaftar ke server.' };
      }
    }

    // Local Mode
    const rawUsers = localStorage.getItem(LOCAL_STORAGE_USERS_DB);
    const users: LocalUserAccount[] = rawUsers ? JSON.parse(rawUsers) : [];

    const newId = 'local-cadet-' + Date.now();
    const newProfile: UserProfile = {
      id: newId,
      email,
      username: cleanUsername,
      displayName,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`,
      xp: 0,
      crystals: 0,
      level: 1,
      isAdmin: email.toLowerCase().includes('admin'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push({
      id: newId,
      email,
      passwordHash: btoa(password),
      profile: newProfile,
    });

    localStorage.setItem(LOCAL_STORAGE_USERS_DB, JSON.stringify(users));
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newProfile));

    return { user: newProfile, error: null };
  }

  // Sign In (e.g. for Admin demo)
  public async signIn(email: string, password: string): Promise<{ user: UserProfile | null; error: string | null }> {
    if (this.isCloudMode() && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { user: null, error: error.message };
        if (data.user) {
          const profile = await this.getCurrentProfile();
          return { user: profile, error: null };
        }
      } catch (err: unknown) {
        return { user: null, error: (err as Error).message || 'Gagal masuk.' };
      }
    }

    // Local mode demo accounts
    if (email === 'admin@galactic.edu' && password === 'admin123') {
      const adminProfile: UserProfile = {
        id: 'admin-commander-01',
        email,
        username: 'commander_zane',
        displayName: 'Komandan Zane (Admin)',
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=CommanderAdmin',
        xp: 2500,
        crystals: 240,
        level: 5,
        isAdmin: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(adminProfile));
      return { user: adminProfile, error: null };
    }

    if (email === 'cadet@galactic.edu' && password === 'cadet123') {
      const cadetProfile: UserProfile = {
        id: 'demo-cadet-01',
        email,
        username: 'kadet_nova',
        displayName: 'Kadet Nova',
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=CadetNova',
        xp: 560,
        crystals: 8,
        level: 2,
        isAdmin: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(cadetProfile));
      return { user: cadetProfile, error: null };
    }

    const rawUsers = localStorage.getItem(LOCAL_STORAGE_USERS_DB);
    const users: LocalUserAccount[] = rawUsers ? JSON.parse(rawUsers) : [];
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (found && found.passwordHash === btoa(password)) {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(found.profile));
      return { user: found.profile, error: null };
    }

    return { user: null, error: 'Email atau kata sandi tidak cocok.' };
  }

  public async signOut(): Promise<void> {
    if (this.isCloudMode() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Supabase sign out error:', err);
      }
    }
    // Reset to fresh guest cadet rather than empty null
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  }

  // Update Profile Stats & persists automatically
  public async updateProfile(profile: UserProfile): Promise<UserProfile> {
    profile.updatedAt = new Date().toISOString();

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(profile.id);
    if (this.isCloudMode() && supabase && isUuid) {
      try {
        await supabase
          .from('profiles')
          .update({
            display_name: profile.displayName,
            avatar_url: profile.avatarUrl,
            updated_at: profile.updatedAt,
          })
          .eq('id', profile.id);
      } catch (err) {
        console.error('Failed to sync profile to Supabase:', err);
      }
    }

    // Always update local storage
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));

    const rawUsers = localStorage.getItem(LOCAL_STORAGE_USERS_DB);
    if (rawUsers) {
      const users: LocalUserAccount[] = JSON.parse(rawUsers);
      const idx = users.findIndex((u) => u.profile.id === profile.id);
      if (idx !== -1) {
        users[idx].profile = profile;
        localStorage.setItem(LOCAL_STORAGE_USERS_DB, JSON.stringify(users));
      } else {
        users.push({
          id: profile.id,
          email: profile.email || 'local_cadet@galactic.edu',
          passwordHash: '',
          profile,
        });
        localStorage.setItem(LOCAL_STORAGE_USERS_DB, JSON.stringify(users));
      }
    }

    return profile;
  }
}

export const authService = new AuthService();
