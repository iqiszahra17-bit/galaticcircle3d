import { supabase, isSupabaseConfigured } from './supabase';
import { GameProgress, MissionResult, LeaderboardEntry, UserProfile, UserAchievement, MapScoreRecord, CampaignSession } from '../types/game';
import { ACHIEVEMENTS } from '../data/achievements';
import { PLANETS } from '../data/planets';

const LOCAL_PROGRESS_KEY = 'galactic_circle_progress_db';
const LOCAL_RESULTS_KEY = 'galactic_circle_results_db';
const LOCAL_ACHIEVEMENTS_KEY = 'galactic_circle_user_achievements_db';
const LOCAL_CAMPAIGN_KEY = 'galactic_circle_campaign_session_db';

export class GameService {
  private isCloud(): boolean {
    return isSupabaseConfigured && supabase !== null;
  }

  /**
   * Get all planets progress for a user
   */
  public async getUserProgress(userId: string): Promise<Record<string, GameProgress>> {
    const progressMap: Record<string, GameProgress> = {};

    // Default template for 4 planets (All start at 0/20 stars)
    PLANETS.forEach((planet, idx) => {
      progressMap[planet.id] = {
        userId,
        planetId: planet.id,
        questionsCompleted: 0,
        highestScore: 0,
        status: idx === 0 ? 'unlocked' : 'locked',
        stars: 0, // Starts at 0/20 for all levels without progress
        moduleCompleted: false,
        updatedAt: new Date().toISOString(),
      };
    });

    if (this.isCloud() && supabase) {
      try {
        const { data, error } = await supabase
          .from('game_progress')
          .select('*')
          .eq('user_id', userId);

        if (!error && data) {
          data.forEach((row) => {
            progressMap[row.planet_id] = {
              userId: row.user_id,
              planetId: row.planet_id,
              questionsCompleted: row.questions_completed,
              highestScore: row.highest_score,
              status: row.status,
              stars: row.stars !== undefined ? row.stars : 0,
              moduleCompleted: row.module_completed || false,
              updatedAt: row.updated_at,
            };
          });
          return progressMap;
        }
      } catch (err) {
        console.error('Error fetching Supabase game progress:', err);
      }
    }

    // Local Storage fallback
    const raw = localStorage.getItem(`${LOCAL_PROGRESS_KEY}_${userId}`);
    if (raw) {
      try {
        const saved = JSON.parse(raw) as Record<string, GameProgress>;
        PLANETS.forEach((planet) => {
          if (saved[planet.id]) {
            progressMap[planet.id] = {
              ...progressMap[planet.id],
              ...saved[planet.id],
              stars: saved[planet.id].stars !== undefined ? saved[planet.id].stars : 0,
            };
          }
        });
        return progressMap;
      } catch {
        return progressMap;
      }
    }

    return progressMap;
  }

  /**
   * Complete a mission: Save result, update XP/Crystals, calculate 0-20 stars, unlock next planet
   */
  public async submitMissionResult(
    profile: UserProfile,
    planetId: string,
    score: number,
    correctCount: number,
    timeSpentSeconds: number
  ): Promise<{
    missionResult: MissionResult;
    updatedProfile: UserProfile;
    newBadges: string[];
    newlyUnlockedPlanetId?: string;
  }> {
    const planet = PLANETS.find((p) => p.id === planetId) || PLANETS[0];
    const totalQuestions = 5;
    const accuracy = Math.round((correctCount / totalQuestions) * 100);

    // Calculate stars: Each correct question awards 4 stars (5 x 4 = 20 stars maximum)
    const starsEarned = Math.min(20, Math.round((correctCount / totalQuestions) * 20));

    // XP and Crystal formula
    const xpEarned = score + correctCount * 25;
    const crystalsEarned = Math.floor(score / 15) + (correctCount === 5 ? 15 : 0);

    const newBadges: string[] = [];

    // Calculate updated profile
    const newXp = profile.xp + xpEarned;
    const newCrystals = profile.crystals + crystalsEarned;
    const newLevel = Math.max(1, Math.floor(newXp / 500) + 1);

    const updatedProfile: UserProfile = {
      ...profile,
      xp: newXp,
      crystals: newCrystals,
      level: newLevel,
      updatedAt: new Date().toISOString(),
    };

    // 1. Check Badges
    const existingBadges = await this.getUserAchievements(profile.id);
    const existingCodes = new Set(existingBadges.map((b) => b.achievementCode));

    const planetBadgeMap: Record<string, string> = {
      tangensia: 'cadet_tangensia',
      angularis: 'master_angularis',
      arcadia: 'architect_arcadia',
      nexus: 'overlord_nexus',
    };

    const targetBadge = planetBadgeMap[planetId];
    if (targetBadge && !existingCodes.has(targetBadge)) {
      newBadges.push(targetBadge);
    }

    if (accuracy === 100 && !existingCodes.has('perfectionist')) {
      newBadges.push('perfectionist');
    }

    if (timeSpentSeconds > 0 && timeSpentSeconds < 180 && !existingCodes.has('speed_star')) {
      newBadges.push('speed_star');
    }

    if (newCrystals >= 100 && !existingCodes.has('crystal_hoarder')) {
      newBadges.push('crystal_hoarder');
    }

    if (newLevel >= 4 && newXp >= 1500 && !existingCodes.has('grandmaster')) {
      newBadges.push('grandmaster');
    }

    // Mission result entity
    const missionResult: MissionResult = {
      id: 'res-' + Date.now(),
      userId: profile.id,
      planetId,
      planetName: planet.name,
      score,
      correctCount,
      totalQuestions,
      accuracy,
      starsEarned,
      xpEarned,
      crystalsEarned,
      timeSpentSeconds,
      completedAt: new Date().toISOString(),
      newBadgesUnlocked: newBadges,
    };

    // Save Progress & Unlock Next Planet
    const currentProgress = await this.getUserProgress(profile.id);
    const prevStars = currentProgress[planetId]?.stars || 0;
    // Stars don't decrease, only highest stars preserved
    const finalStars = Math.min(20, Math.max(prevStars, starsEarned));

    currentProgress[planetId] = {
      userId: profile.id,
      planetId,
      questionsCompleted: 5,
      highestScore: Math.max(currentProgress[planetId]?.highestScore || 0, score),
      status: 'completed',
      stars: finalStars,
      moduleCompleted: currentProgress[planetId]?.moduleCompleted || false,
      updatedAt: new Date().toISOString(),
    };

    // Automatic Unlock Next Planet:
    // After Level 1 completed -> Level 2 unlocks, etc.
    let newlyUnlockedPlanetId: string | undefined = undefined;
    const currentIndex = PLANETS.findIndex((p) => p.id === planetId);
    if (currentIndex >= 0 && currentIndex < PLANETS.length - 1) {
      const nextPlanet = PLANETS[currentIndex + 1];
      if (currentProgress[nextPlanet.id].status === 'locked') {
        currentProgress[nextPlanet.id].status = 'unlocked';
        newlyUnlockedPlanetId = nextPlanet.id;
      }
    }

    // Persist to Cloud or Local
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(profile.id);
    if (this.isCloud() && supabase && isUuid) {
      try {
        await supabase.from('mission_results').insert({
          user_id: profile.id,
          planet_id: planetId,
          planet_name: planet.name,
          score,
          correct_count: correctCount,
          total_questions: totalQuestions,
          accuracy,
          stars_earned: starsEarned,
          xp_earned: xpEarned,
          crystals_earned: crystalsEarned,
          time_spent_seconds: timeSpentSeconds,
        });

        // Note: profiles table XP, crystals, and level are automatically updated
        // and validated server-side by the Supabase database trigger on mission_results insert.

        for (const pId of Object.keys(currentProgress)) {
          const item = currentProgress[pId];
          await supabase.from('game_progress').upsert({
            user_id: profile.id,
            planet_id: item.planetId,
            questions_completed: item.questionsCompleted,
            highest_score: item.highestScore,
            status: item.status,
            stars: item.stars,
            module_completed: item.moduleCompleted,
            updated_at: item.updatedAt,
          }, { onConflict: 'user_id,planet_id' });
        }

        for (const code of newBadges) {
          await supabase.from('user_achievements').upsert({
            user_id: profile.id,
            achievement_code: code,
          }, { onConflict: 'user_id,achievement_code' });
        }
      } catch (err) {
        console.error('Error saving mission to Supabase:', err);
      }
    }

    // Persist to local storage
    localStorage.setItem(`${LOCAL_PROGRESS_KEY}_${profile.id}`, JSON.stringify(currentProgress));

    const rawResults = localStorage.getItem(LOCAL_RESULTS_KEY);
    const results: MissionResult[] = rawResults ? JSON.parse(rawResults) : [];
    results.unshift(missionResult);
    localStorage.setItem(LOCAL_RESULTS_KEY, JSON.stringify(results));

    // Save newly unlocked achievements locally
    const rawAch = localStorage.getItem(`${LOCAL_ACHIEVEMENTS_KEY}_${profile.id}`);
    const localAchs: UserAchievement[] = rawAch ? JSON.parse(rawAch) : [];
    newBadges.forEach((code) => {
      localAchs.push({
        id: 'ach-' + Date.now() + '-' + code,
        userId: profile.id,
        achievementCode: code,
        unlockedAt: new Date().toISOString(),
        achievement: ACHIEVEMENTS.find((a) => a.code === code),
      });
    });
    localStorage.setItem(`${LOCAL_ACHIEVEMENTS_KEY}_${profile.id}`, JSON.stringify(localAchs));

    return {
      missionResult,
      updatedProfile,
      newBadges,
      newlyUnlockedPlanetId,
    };
  }

  /**
   * Update module reading and interactive practice progress
   */
  public async updateModuleProgress(
    userId: string,
    planetId: string,
    moduleCompleted: boolean,
    practiceStars?: number
  ): Promise<Record<string, GameProgress>> {
    const currentProgress = await this.getUserProgress(userId);
    const existing = currentProgress[planetId] || {
      userId,
      planetId,
      questionsCompleted: 0,
      highestScore: 0,
      status: 'unlocked',
      stars: 0,
      moduleCompleted: false,
      updatedAt: new Date().toISOString(),
    };

    const prevStars = existing.stars || 0;
    const finalStars = practiceStars !== undefined
      ? Math.min(20, Math.max(prevStars, practiceStars))
      : prevStars;

    currentProgress[planetId] = {
      ...existing,
      moduleCompleted: moduleCompleted || existing.moduleCompleted || false,
      stars: finalStars,
      updatedAt: new Date().toISOString(),
    };

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId);
    if (this.isCloud() && supabase && isUuid) {
      try {
        const item = currentProgress[planetId];
        await supabase.from('game_progress').upsert({
          user_id: userId,
          planet_id: planetId,
          questions_completed: item.questionsCompleted,
          highest_score: item.highestScore,
          status: item.status,
          stars: item.stars,
          module_completed: item.moduleCompleted,
          updated_at: item.updatedAt,
        }, { onConflict: 'user_id,planet_id' });
      } catch (err) {
        console.error('Error syncing module progress to Supabase:', err);
      }
    }

    localStorage.setItem(`${LOCAL_PROGRESS_KEY}_${userId}`, JSON.stringify(currentProgress));
    return currentProgress;
  }

  /**
   * Get unlocked achievements for user
   */
  public async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    if (this.isCloud() && supabase) {
      try {
        const { data, error } = await supabase
          .from('user_achievements')
          .select('*, achievements(*)')
          .eq('user_id', userId);

        if (!error && data) {
          return data.map((d) => ({
            id: d.id,
            userId: d.user_id,
            achievementCode: d.achievement_code,
            unlockedAt: d.unlocked_at,
            achievement: d.achievements,
          }));
        }
      } catch (err) {
        console.error('Error fetching Supabase achievements:', err);
      }
    }

    // Local fallback
    const raw = localStorage.getItem(`${LOCAL_ACHIEVEMENTS_KEY}_${userId}`);
    if (raw) {
      try {
        return JSON.parse(raw) as UserAchievement[];
      } catch {
        return [];
      }
    }
    return [];
  }

  /**
   * Fetch Public Leaderboard with strict tie-breaker sorting:
   * 1. Total Score DESC
   * 2. Accuracy DESC
   * 3. Total XP DESC
   * 4. Missions Completed DESC
   */
  public async getLeaderboard(): Promise<LeaderboardEntry[]> {
    if (this.isCloud() && supabase) {
      try {
        const { data, error } = await supabase
          .from('public_leaderboard')
          .select('*')
          .order('total_score', { ascending: false })
          .order('accuracy', { ascending: false })
          .order('total_xp', { ascending: false })
          .limit(50);

        if (!error && data) {
          return data.map((d, index) => ({
            rank: index + 1,
            userId: d.user_id,
            displayName: d.display_name,
            avatarUrl: d.avatar_url,
            level: d.level,
            totalScore: d.total_score,
            totalXp: d.total_xp,
            totalCrystals: d.total_crystals,
            missionsCompleted: d.missions_completed,
            accuracy: d.accuracy,
            lastActive: d.last_active || new Date().toISOString(),
          }));
        }
      } catch (err) {
        console.error('Error fetching Supabase leaderboard:', err);
      }
    }

    // Local database aggregation
    const rawUsers = localStorage.getItem('galactic_circle_local_users');
    const localUsers: { profile: UserProfile }[] = rawUsers ? JSON.parse(rawUsers) : [];

    const rawActive = localStorage.getItem('galactic_circle_active_user');
    if (rawActive) {
      try {
        const activeProfile = JSON.parse(rawActive) as UserProfile;
        if (activeProfile && !localUsers.some((u) => u.profile.id === activeProfile.id)) {
          localUsers.push({
            profile: activeProfile,
          });
        }
      } catch {}
    }

    const rawResults = localStorage.getItem(LOCAL_RESULTS_KEY);
    const results: MissionResult[] = rawResults ? JSON.parse(rawResults) : [];

    // Map each user to stats
    const entries: LeaderboardEntry[] = localUsers.map((u) => {
      const userResults = results.filter((r) => r.userId === u.profile.id);
      const totalScore = userResults.reduce((sum, r) => sum + r.score, 0);
      const uniquePlanets = new Set(userResults.map((r) => r.planetId)).size;
      const avgAccuracy = userResults.length > 0
        ? Math.round(userResults.reduce((sum, r) => sum + r.accuracy, 0) / userResults.length)
        : 0;

      return {
        userId: u.profile.id,
        displayName: u.profile.displayName,
        avatarUrl: u.profile.avatarUrl,
        level: u.profile.level,
        totalScore,
        totalXp: u.profile.xp,
        totalCrystals: u.profile.crystals,
        missionsCompleted: uniquePlanets,
        accuracy: avgAccuracy,
        lastActive: u.profile.updatedAt,
      };
    });

    // Sort with tie-breaker
    entries.sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
      if (b.totalXp !== a.totalXp) return b.totalXp - a.totalXp;
      return b.missionsCompleted - a.missionsCompleted;
    });

    return entries.map((e, idx) => ({ ...e, rank: idx + 1 }));
  }

  /**
   * Admin: Get all user profiles
   */
  public async getAdminUserList(): Promise<UserProfile[]> {
    if (this.isCloud() && supabase) {
      try {
        const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (data) {
          return data.map((d) => ({
            id: d.id,
            email: d.email,
            username: d.username,
            displayName: d.display_name,
            avatarUrl: d.avatar_url,
            xp: d.xp,
            crystals: d.crystals,
            level: d.level,
            isAdmin: d.is_admin,
            createdAt: d.created_at,
            updatedAt: d.updated_at,
          }));
        }
      } catch (err) {
        console.error('Error fetching admin users from Supabase:', err);
      }
    }

    // Local
    const rawUsers = localStorage.getItem('galactic_circle_local_users');
    if (!rawUsers) return [];
    const accounts: { profile: UserProfile }[] = JSON.parse(rawUsers);
    return accounts.map((a) => a.profile);
  }

  /**
   * Admin: Get all mission attempts
   */
  public async getAdminMissionHistory(): Promise<MissionResult[]> {
    if (this.isCloud() && supabase) {
      try {
        const { data } = await supabase
          .from('mission_results')
          .select('*')
          .order('completed_at', { ascending: false })
          .limit(100);

        if (data) {
          return data.map((d) => ({
            id: d.id,
            userId: d.user_id,
            planetId: d.planet_id,
            planetName: d.planet_name,
            score: d.score,
            correctCount: d.correct_count,
            totalQuestions: d.total_questions,
            accuracy: d.accuracy,
            starsEarned: d.stars_earned || 0,
            xpEarned: d.xp_earned,
            crystalsEarned: d.crystals_earned,
            timeSpentSeconds: d.time_spent_seconds,
            completedAt: d.completed_at,
            newBadgesUnlocked: [],
          }));
        }
      } catch (err) {
        console.error('Error fetching Supabase mission results:', err);
      }
    }

    const raw = localStorage.getItem(LOCAL_RESULTS_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  /**
   * Get active 4-map campaign session for player
   */
  public getCampaignSession(userId: string): CampaignSession {
    const raw = localStorage.getItem(`${LOCAL_CAMPAIGN_KEY}_${userId}`);
    if (raw) {
      try {
        const parsed: CampaignSession = JSON.parse(raw);
        if (parsed && parsed.mapScores) {
          return parsed;
        }
      } catch (err) {
        console.error('Failed to parse campaign session:', err);
      }
    }

    const newSession: CampaignSession = {
      sessionId: 'session-' + Date.now(),
      userId,
      mapScores: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(`${LOCAL_CAMPAIGN_KEY}_${userId}`, JSON.stringify(newSession));
    } catch {
      // Storage fallback
    }
    return newSession;
  }

  /**
   * Save campaign session to local storage
   */
  public saveCampaignSession(session: CampaignSession): void {
    session.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(`${LOCAL_CAMPAIGN_KEY}_${session.userId}`, JSON.stringify(session));
    } catch {
      // Storage fallback
    }
  }

  /**
   * Record or update score for a specific map in the active campaign
   */
  public recordMapScore(userId: string, record: MapScoreRecord): CampaignSession {
    const session = this.getCampaignSession(userId);
    session.mapScores[record.planetId] = record;
    this.saveCampaignSession(session);
    return session;
  }

  /**
   * Start a brand new 4-map campaign from scratch, resetting previous campaign scores
   */
  public resetCampaignSession(userId: string): CampaignSession {
    const freshSession: CampaignSession = {
      sessionId: 'session-' + Date.now(),
      userId,
      mapScores: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.saveCampaignSession(freshSession);
    return freshSession;
  }
}

export const gameService = new GameService();
