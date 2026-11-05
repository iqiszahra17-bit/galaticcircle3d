export interface UserProfile {
  id: string;
  email?: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  xp: number;
  crystals: number;
  level: number;
  isAdmin?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GameProgress {
  userId: string;
  planetId: string;
  questionsCompleted: number; // 0 to 5
  highestScore: number;
  status: 'locked' | 'unlocked' | 'in_progress' | 'completed';
  stars: number; // 0 to 20 stars
  moduleCompleted?: boolean;
  updatedAt: string;
}

export interface MissionResult {
  id: string;
  userId: string;
  planetId: string;
  planetName: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  accuracy: number; // percentage (0 - 100)
  starsEarned: number; // 0 to 20
  xpEarned: number;
  crystalsEarned: number;
  timeSpentSeconds: number;
  completedAt: string;
  newBadgesUnlocked: string[];
}

export interface Achievement {
  code: string;
  name: string;
  description: string;
  icon: string;
  category: 'planet' | 'score' | 'mastery' | 'speed';
  requiredCondition: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementCode: string;
  unlockedAt: string;
  achievement?: Achievement;
}

export interface LeaderboardEntry {
  rank?: number;
  userId: string;
  displayName: string;
  avatarUrl: string;
  level: number;
  totalScore: number;
  totalXp: number;
  totalCrystals: number;
  missionsCompleted: number;
  accuracy: number;
  lastActive: string;
}

export interface PlayerStats {
  totalXp: number;
  totalCrystals: number;
  currentLevel: number;
  completedMissionsCount: number;
  totalPlanets: number;
  overallProgressPercent: number;
  totalQuestionsAnswered: number;
  correctAnswersCount: number;
  averageAccuracy: number;
}

export interface MapScoreRecord {
  planetId: string;
  planetName: string;
  order: number;
  score: number;
  correctCount: number;
  wrongCount: number;
  totalQuestions: number;
  accuracy: number;
  timeSpentSeconds: number;
  completedAt: string;
}

export interface CampaignSession {
  sessionId: string;
  userId: string;
  mapScores: Record<string, MapScoreRecord>;
  createdAt: string;
  updatedAt: string;
}
