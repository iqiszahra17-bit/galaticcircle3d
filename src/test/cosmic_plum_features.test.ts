import { describe, it, expect, beforeEach } from 'vitest';
import { gameService } from '../services/gameService';
import { PLANETS } from '../data/planets';
import { UserProfile } from '../types/game';

// In-memory localStorage mock for node test runner
const memoryStorage: Record<string, string> = {};
const mockLocalStorage = {
  getItem: (key: string) => memoryStorage[key] || null,
  setItem: (key: string, val: string) => {
    memoryStorage[key] = val;
  },
  removeItem: (key: string) => {
    delete memoryStorage[key];
  },
  clear: () => {
    for (const k of Object.keys(memoryStorage)) {
      delete memoryStorage[k];
    }
  },
};
// @ts-expect-error mock
global.localStorage = mockLocalStorage;

describe('Cosmic Plum & Magenta - Sistem Peta, Bintang 0/20 & Pembukaan Level', () => {
  const dummyUser: UserProfile = {
    id: 'test-user-cadet',
    username: 'test_cadet',
    displayName: 'Test Cadet',
    avatarUrl: 'https://example.com/avatar.png',
    xp: 0,
    crystals: 0,
    level: 1,
    isAdmin: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    global.localStorage.clear();
  });

  it('1. Semua level yang belum memiliki data progres dimulai dari 0/20 bintang', async () => {
    const progress = await gameService.getUserProgress('new-user-123');

    PLANETS.forEach((planet) => {
      const pProg = progress[planet.id];
      expect(pProg).toBeDefined();
      expect(pProg.stars).toBe(0); // Dimulai dari 0 bintang
      expect(pProg.questionsCompleted).toBe(0);
    });
  });

  it('2. Level 1 terbuka secara default, sedangkan Level 2, 3, 4 terkunci', async () => {
    const progress = await gameService.getUserProgress('new-user-123');

    expect(progress['tangensia'].status).toBe('unlocked');
    expect(progress['angularis'].status).toBe('locked');
    expect(progress['arcadia'].status).toBe('locked');
    expect(progress['nexus'].status).toBe('locked');
  });

  it('3. Pengguna memperoleh bintang sesuai hasil pengerjaan (maksimal 20)', async () => {
    // 5 dari 5 benar => 20 bintang
    const outcome = await gameService.submitMissionResult(
      dummyUser,
      'tangensia',
      500,
      5, // 5 correct out of 5
      120
    );

    expect(outcome.missionResult.starsEarned).toBe(20);

    const updated = await gameService.getUserProgress(dummyUser.id);
    expect(updated['tangensia'].stars).toBe(20);
    expect(updated['tangensia'].status).toBe('completed');
  });

  it('4. Setelah Level 1 selesai, Level 2 terbuka secara otomatis', async () => {
    const outcome = await gameService.submitMissionResult(
      dummyUser,
      'tangensia',
      400,
      4, // 4 correct
      100
    );

    expect(outcome.newlyUnlockedPlanetId).toBe('angularis');

    const updated = await gameService.getUserProgress(dummyUser.id);
    expect(updated['tangensia'].status).toBe('completed');
    expect(updated['angularis'].status).toBe('unlocked');
    expect(updated['arcadia'].status).toBe('locked');
  });

  it('5. Membuka kembali atau submit ulang tidak menggandakan bintang secara tidak sengaja (hanya skor tertinggi disimpan)', async () => {
    // First attempt: 4/5 correct => 16 stars
    await gameService.submitMissionResult(dummyUser, 'tangensia', 400, 4, 100);
    let prog = await gameService.getUserProgress(dummyUser.id);
    expect(prog['tangensia'].stars).toBe(16);

    // Second attempt with lower score: 2/5 correct => should KEEP 16 stars, not decrease or add!
    await gameService.submitMissionResult(dummyUser, 'tangensia', 200, 2, 80);
    prog = await gameService.getUserProgress(dummyUser.id);
    expect(prog['tangensia'].stars).toBe(16);

    // Third attempt with perfect score: 5/5 correct => updates to 20 stars (capped at 20)
    await gameService.submitMissionResult(dummyUser, 'tangensia', 500, 5, 90);
    prog = await gameService.getUserProgress(dummyUser.id);
    expect(prog['tangensia'].stars).toBe(20);
  });

  it('6. Progres modul pembelajaran tersimpan dan dapat membarui bintang', async () => {
    const prog = await gameService.updateModuleProgress(dummyUser.id, 'tangensia', true, 12);
    expect(prog['tangensia'].moduleCompleted).toBe(true);
    expect(prog['tangensia'].stars).toBe(12);

    // Refresh data from storage
    const restored = await gameService.getUserProgress(dummyUser.id);
    expect(restored['tangensia'].moduleCompleted).toBe(true);
    expect(restored['tangensia'].stars).toBe(12);
  });

  it('7. Kadet guest menyelesaikan level 1 berhasil membuka level 2 secara persisten', async () => {
    const guestUser: UserProfile = {
      id: 'guest',
      username: 'kadet_antariksa',
      displayName: 'Kadet Antariksa',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=CadetGuest',
      xp: 560,
      crystals: 8,
      level: 1,
      isAdmin: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Guest menyelesaikan level 1 (Tangensia)
    const outcome = await gameService.submitMissionResult(guestUser, 'tangensia', 450, 5, 110);
    expect(outcome.newlyUnlockedPlanetId).toBe('angularis');

    // Cek progres guest dari storage
    const guestProgress = await gameService.getUserProgress('guest');
    expect(guestProgress['tangensia'].status).toBe('completed');
    expect(guestProgress['angularis'].status).toBe('unlocked');
  });
});
