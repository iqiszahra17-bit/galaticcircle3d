import React, { useEffect } from 'react';
import { Planet, Question } from '../types/math';
import { MissionResult } from '../types/game';
import { ACHIEVEMENTS } from '../data/achievements';
import { QUESTIONS } from '../data/questions';
import { soundEffects } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Award, 
  Sparkles, 
  Gem, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Compass, 
  ArrowRight,
  BookOpen,
  Star
} from 'lucide-react';

interface Props {
  planet: Planet;
  missionResult: MissionResult;
  questionHistory: {
    questionId: string;
    isCorrect: boolean;
    userAnswer: string;
    scoreEarned: number;
  }[];
  onReplay: () => void;
  onBackToMap: () => void;
  onNextPlanet: () => void;
  hasNextPlanet: boolean;
}

export const ResultsPage: React.FC<Props> = ({
  planet,
  missionResult,
  questionHistory,
  onReplay,
  onBackToMap,
  onNextPlanet,
  hasNextPlanet,
}) => {
  useEffect(() => {
    // Fire festive space confetti
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00E5FF', '#7861FF', '#FFD34E', '#00FF9D'],
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
      {/* Top Victory Card */}
      <div className="w-full rounded-3xl bg-[#321442] border-2 border-[#FF55C8]/40 p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden text-center hud-corner mb-8">
        {/* Glow halo */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-[#8D3CC7]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-neon-magenta/20 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#24102F] border-2 border-[#FFD76A]/60 text-[#FFD76A] mb-3 shadow-[0_0_20px_rgba(255,215,106,0.4)]">
          <Trophy className="w-8 h-8 animate-bounce text-[#FFD76A]" />
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold font-orbitron text-[#FFF5FF] mb-2">
          MISI {planet.name.toUpperCase()} SELESAI!
        </h1>
        <p className="text-xs sm:text-sm text-[#C6B2D2] max-w-md mx-auto mb-6 font-rajdhani">
          Kalkulasi navigasi geometri lingkaran telah tersinkronisasi dengan satelit pusat.
        </p>

        {/* Level Completed Checklist Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#57E389]/20 border border-[#57E389] text-[#57E389] font-bold text-xs font-orbitron mb-6 shadow-[0_0_15px_rgba(87,227,137,0.4)]">
          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          <span>Status: Level Selesai ✓</span>
        </div>

        {/* Stars Award Display Banner with Magenta Glow */}
        <div className="mb-8 p-5 rounded-3xl bg-[#24102F] border-2 border-[#FF55C8]/50 shadow-[0_0_25px_rgba(255,85,200,0.3)] flex flex-col sm:flex-row items-center justify-around gap-4 animate-pulse-slow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFD76A]/20 border border-[#FFD76A] flex items-center justify-center text-[#FFD76A] shadow-star-glow">
              <Star className="w-7 h-7 fill-[#FFD76A] text-[#FFD76A] animate-star-pulse" />
            </div>
            <div className="text-left">
              <span className="text-[11px] text-[#FFB5E8] font-mono uppercase tracking-wider block">
                Bintang Diperoleh
              </span>
              <div className="text-2xl sm:text-3xl font-black font-orbitron text-[#FFD76A] flex items-center gap-1.5 drop-shadow-[0_0_10px_rgba(255,85,200,0.6)]">
                <span>⭐ {missionResult.starsEarned || 0} / 20 Bintang</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-[#C6B2D2] text-center sm:text-right max-w-xs">
            {missionResult.starsEarned === 20 ? (
              <span className="text-[#57E389] font-bold block">
                Sempurna! Semua 20 bintang tercapai di level ini! 🌟
              </span>
            ) : (
              <span>
                Kamu dapat mengulangi latihan kapan saja untuk menambah bintang hingga 20!
              </span>
            )}
          </div>
        </div>

        {/* Primary Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-[#24102F]/90 border border-white/10">
            <span className="text-xs text-[#C6B2D2] font-rajdhani uppercase">Total Skor</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#FFF5FF] font-orbitron mt-1">
              {missionResult.score}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#24102F]/90 border border-white/10">
            <span className="text-xs text-[#C6B2D2] font-rajdhani uppercase">Akurasi</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-neon-magenta font-orbitron mt-1">
              {missionResult.accuracy}%
            </div>
            <span className="text-[10px] text-[#C6B2D2]">
              {missionResult.correctCount} / {missionResult.totalQuestions} Benar
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#24102F]/90 border border-white/10">
            <span className="text-xs text-[#C6B2D2] font-rajdhani uppercase">XP Diperoleh</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#FFB5E8] font-orbitron mt-1 flex items-center justify-center gap-1">
              <Sparkles className="w-5 h-5 text-neon-magenta" />
              <span>+{missionResult.xpEarned}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#24102F]/90 border border-white/10">
            <span className="text-xs text-[#C6B2D2] font-rajdhani uppercase">Kristal Kosmik</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#FFD76A] font-orbitron mt-1 flex items-center justify-center gap-1">
              <Gem className="w-5 h-5 text-[#FFD76A]" />
              <span>+{missionResult.crystalsEarned}</span>
            </div>
          </div>
        </div>

        {/* Newly Unlocked Badges Notification Banner */}
        {missionResult.newBadgesUnlocked && missionResult.newBadgesUnlocked.length > 0 && (
          <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-[#FFD76A]/15 via-[#8D3CC7]/20 to-neon-magenta/20 border border-[#FFD76A]/40 text-left">
            <h4 className="text-xs font-bold text-[#FFD76A] uppercase font-orbitron tracking-wider mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#FFD76A]" />
              BADGE PRESTASI BARU DIBUKA!
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {missionResult.newBadgesUnlocked.map((code) => {
                const ach = ACHIEVEMENTS.find((a) => a.code === code);
                if (!ach) return null;
                return (
                  <div key={code} className="p-3 rounded-xl bg-[#24102F] border border-[#FFD76A]/30 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#FFD76A]/20 border border-[#FFD76A]/50 flex items-center justify-center text-[#FFD76A] shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#FFF5FF] block">{ach.name}</span>
                      <span className="text-[11px] text-[#C6B2D2] block line-clamp-1">{ach.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Button Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-white/10">
          <button
            onClick={() => {
              soundEffects.playClick();
              onReplay();
            }}
            className="px-5 py-2.5 rounded-2xl bg-[#24102F] border border-[#FF55C8]/30 hover:border-neon-magenta text-[#FFF5FF] hover:text-neon-magenta text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Ulangi Misi</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              onBackToMap();
            }}
            className="px-5 py-2.5 rounded-2xl bg-[#24102F] border border-[#FF55C8]/30 hover:border-neon-magenta text-[#FFF5FF] hover:text-neon-magenta text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>Peta Galaksi</span>
          </button>

          {hasNextPlanet && (
            <button
              onClick={() => {
                soundEffects.playClick();
                onNextPlanet();
              }}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-neon-magenta via-[#8D3CC7] to-neon-magenta text-[#FFF5FF] font-black font-orbitron text-xs sm:text-sm tracking-wide shadow-neon-magenta hover:opacity-95 flex items-center gap-2 transition-all hover:scale-105"
            >
              <span>Planet Berikutnya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Comprehensive Question-by-Question Review */}
      <div className="w-full rounded-2xl bg-space-surface/90 border border-space-border p-6 backdrop-blur-xl">
        <h3 className="text-base font-bold font-orbitron text-neon-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-neon-cyan" />
          Tinjauan & Evaluasi Soal
        </h3>

        <div className="space-y-4">
          {questionHistory.map((hist, index) => {
            const q = QUESTIONS.find((question) => question.id === hist.questionId);
            if (!q) return null;

            return (
              <div
                key={hist.questionId}
                className="p-4 rounded-xl bg-space-deep/80 border border-white/5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {hist.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-neon-emerald" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                    <span className="text-xs font-bold text-neon-white">
                      Soal #{index + 1}: {q.title}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-neon-gold">
                    +{hist.scoreEarned} Poin
                  </span>
                </div>

                <p className="text-xs text-neon-white/70">{q.questionText}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="p-2 rounded bg-space-surface border border-white/5">
                    <span className="text-neon-white/40 block">Jawaban Kadet:</span>
                    <span className={hist.isCorrect ? 'text-neon-emerald font-semibold' : 'text-rose-400 font-semibold'}>
                      {hist.userAnswer || '(Tidak dijawab)'}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-space-surface border border-white/5">
                    <span className="text-neon-white/40 block">Kunci Jawaban Eksak:</span>
                    <span className="text-neon-cyan font-semibold">{q.finalAnswerFormatted}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
