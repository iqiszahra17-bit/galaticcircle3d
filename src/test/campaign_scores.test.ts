import { describe, it, expect, beforeEach } from 'vitest';
import { gameService } from '../services/gameService';
import { MapScoreRecord } from '../types/game';
import { getFinalCampaignAppreciation, formatDuration } from '../utils/resultImageGenerator';

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

describe('4-Map Campaign & Cumulative Scoring System', () => {
  const testUserId = 'cadet_test_runner';

  beforeEach(() => {
    global.localStorage.clear();
  });

  it('initializes a clean campaign session with empty map scores', () => {
    const session = gameService.getCampaignSession(testUserId);
    expect(session.userId).toBe(testUserId);
    expect(session.mapScores).toBeDefined();
    expect(Object.keys(session.mapScores).length).toBe(0);
  });

  it('records Map 1 (Tangensia) score and retains it', () => {
    const map1: MapScoreRecord = {
      planetId: 'tangensia',
      planetName: 'Tangensia',
      order: 1,
      score: 450,
      correctCount: 5,
      wrongCount: 0,
      totalQuestions: 5,
      accuracy: 100,
      timeSpentSeconds: 65,
      completedAt: new Date().toISOString(),
    };

    const session = gameService.recordMapScore(testUserId, map1);
    expect(session.mapScores['tangensia']).toBeDefined();
    expect(session.mapScores['tangensia'].score).toBe(450);
  });

  it('preserves Map 1 score when moving to and recording Map 2, Map 3, and Map 4', () => {
    const map1: MapScoreRecord = {
      planetId: 'tangensia',
      planetName: 'Tangensia',
      order: 1,
      score: 420,
      correctCount: 4,
      wrongCount: 1,
      totalQuestions: 5,
      accuracy: 80,
      timeSpentSeconds: 70,
      completedAt: new Date().toISOString(),
    };

    const map2: MapScoreRecord = {
      planetId: 'angularis',
      planetName: 'Angularis',
      order: 2,
      score: 480,
      correctCount: 5,
      wrongCount: 0,
      totalQuestions: 5,
      accuracy: 100,
      timeSpentSeconds: 80,
      completedAt: new Date().toISOString(),
    };

    const map3: MapScoreRecord = {
      planetId: 'arcadia',
      planetName: 'Arcadia',
      order: 3,
      score: 500,
      correctCount: 5,
      wrongCount: 0,
      totalQuestions: 5,
      accuracy: 100,
      timeSpentSeconds: 75,
      completedAt: new Date().toISOString(),
    };

    const map4: MapScoreRecord = {
      planetId: 'nexus',
      planetName: 'Nexus',
      order: 4,
      score: 460,
      correctCount: 4,
      wrongCount: 1,
      totalQuestions: 5,
      accuracy: 80,
      timeSpentSeconds: 95,
      completedAt: new Date().toISOString(),
    };

    gameService.recordMapScore(testUserId, map1);
    gameService.recordMapScore(testUserId, map2);
    gameService.recordMapScore(testUserId, map3);
    const finalSession = gameService.recordMapScore(testUserId, map4);

    // Verify all 4 maps are preserved
    expect(finalSession.mapScores['tangensia'].score).toBe(420);
    expect(finalSession.mapScores['angularis'].score).toBe(480);
    expect(finalSession.mapScores['arcadia'].score).toBe(500);
    expect(finalSession.mapScores['nexus'].score).toBe(460);

    // Calculate total score from all 4 maps
    const totalScore =
      finalSession.mapScores['tangensia'].score +
      finalSession.mapScores['angularis'].score +
      finalSession.mapScores['arcadia'].score +
      finalSession.mapScores['nexus'].score;

    expect(totalScore).toBe(420 + 480 + 500 + 460); // 1860 Poin

    // Calculate total correct answers
    const totalCorrect =
      finalSession.mapScores['tangensia'].correctCount +
      finalSession.mapScores['angularis'].correctCount +
      finalSession.mapScores['arcadia'].correctCount +
      finalSession.mapScores['nexus'].correctCount;

    expect(totalCorrect).toBe(4 + 5 + 5 + 4); // 18 / 20 Soal

    // Calculate total duration
    const totalDuration =
      finalSession.mapScores['tangensia'].timeSpentSeconds +
      finalSession.mapScores['angularis'].timeSpentSeconds +
      finalSession.mapScores['arcadia'].timeSpentSeconds +
      finalSession.mapScores['nexus'].timeSpentSeconds;

    expect(totalDuration).toBe(70 + 80 + 75 + 95); // 320 seconds
    expect(formatDuration(totalDuration)).toBe('5m 20s');

    // Overall accuracy
    const overallAccuracy = Math.round((totalCorrect / 20) * 100);
    expect(overallAccuracy).toBe(90);

    // Appreciation message
    const appreciation = getFinalCampaignAppreciation(overallAccuracy);
    expect(appreciation.title).toContain('Komandan');
  });

  it('clears previous scores when starting a new campaign from scratch', () => {
    const map1: MapScoreRecord = {
      planetId: 'tangensia',
      planetName: 'Tangensia',
      order: 1,
      score: 300,
      correctCount: 3,
      wrongCount: 2,
      totalQuestions: 5,
      accuracy: 60,
      timeSpentSeconds: 100,
      completedAt: new Date().toISOString(),
    };
    gameService.recordMapScore(testUserId, map1);

    // Reset campaign
    const freshSession = gameService.resetCampaignSession(testUserId);
    expect(Object.keys(freshSession.mapScores).length).toBe(0);

    // Verify localStorage was updated
    const retrieved = gameService.getCampaignSession(testUserId);
    expect(Object.keys(retrieved.mapScores).length).toBe(0);
  });
});
