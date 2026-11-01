import React, { useEffect, useState } from 'react';
import { Planet } from '../types/math';
import { MissionResult, UserProfile } from '../types/game';
import { ACHIEVEMENTS } from '../data/achievements';
import { QUESTIONS } from '../data/questions';
import { soundEffects } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  formatDuration,
  getAppreciation,
  saveResultImageToGallery,
  ResultCardData,
} from '../utils/resultImageGenerator';
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
  Star,
  Download,
  Clock,
  Target,
  User,
  Check,
  AlertTriangle,
  Loader2,
  Share2,
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
  currentUser?: UserProfile | null;
}

export const ResultsPage: React.FC<Props> = ({
  planet,
  missionResult,
  questionHistory,
  onReplay,
  onBackToMap,
  onNextPlanet,
  hasNextPlanet,
  currentUser,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveNotification, setSaveNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const playerName =
    currentUser?.displayName || currentUser?.username || 'Kadet Antariksa';
  const wrongCount = Math.max(
    0,
    missionResult.totalQuestions - missionResult.correctCount
  );
  const appreciation = getAppreciation(missionResult.accuracy);
  const durationText = formatDuration(missionResult.timeSpentSeconds || 0);

  useEffect(() => {
    // Play celebratory victory fanfare
    soundEffects.playVictory();

    // Fire festive cosmic confetti on load
    try {
      confetti({
        particleCount: 120,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#00E5FF', '#7861FF', '#FFD34E', '#FF55C8', '#57E389'],
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  const handleSaveToGallery = async () => {
    setIsSaving(true);
    setSaveNotification(null);
    soundEffects.playClick();

    try {
      const cardData: ResultCardData = {
        playerName,
        planetName: planet.name,
        topicTitle: planet.topicTitle || planet.description || 'Matematika Geometri Lingkaran',
        score: missionResult.score,
        correctCount: missionResult.correctCount,
        wrongCount,
        totalQuestions: missionResult.totalQuestions,
        accuracy: missionResult.accuracy,
        starsEarned: missionResult.starsEarned || 0,
        timeSpentSeconds: missionResult.timeSpentSeconds || 0,
        xpEarned: missionResult.xpEarned || 0,
        crystalsEarned: missionResult.crystalsEarned || 0,
        appreciationMessage: `${appreciation.title} - ${appreciation.message}`,
        completedAt: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      const res = await saveResultImageToGallery(cardData);
      if (res.success) {
        soundEffects.playCorrect();
        setSaveNotification({
          type: 'success',
          message: res.message,
        });
      } else {
        soundEffects.playWrong();
        setSaveNotification({
          type: 'error',
          message: res.message,
        });
      }
    } catch (err) {
      soundEffects.playWrong();
      setSaveNotification({
        type: 'error',
        message: (err as Error).message || 'Terjadi kesalahan saat memproses gambar sertifikat.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
      {/* Top Victory & Results Header Card */}
      <div className="w-full rounded-3xl bg-[#321442] border-2 border-[#FF55C8]/40 p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden text-center hud-corner mb-8">
        {/* Ambient Cosmic Halos */}
        <div className="absolute -top-24 -left-24 w-56 h-56 bg-[#8D3CC7]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-neon-magenta/25 rounded-full blur-3xl pointer-events-none" />

        {/* Victory Trophy Badge */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[#24102F] border-2 border-[#FFD76A]/60 text-[#FFD76A] mb-4 shadow-[0_0_30px_rgba(255,215,106,0.4)]">
          <Trophy className="w-10 h-10 animate-bounce text-[#FFD76A]" />
        </div>

        {/* Planet & Mission Title */}
        <h1 className="text-2xl sm:text-4xl font-extrabold font-orbitron text-[#FFF5FF] tracking-wider mb-2">
          MISI {planet.name.toUpperCase()} SELESAI!
        </h1>
        <p className="text-xs sm:text-sm text-[#C6B2D2] max-w-lg mx-auto mb-4 font-rajdhani">
          Sektor {planet.topicTitle} telah berhasil dituntaskan dengan data telemetri tersinkronisasi.
        </p>

        {/* Player Profile & Level Status Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#24102F] border border-[#FF55C8]/50 text-[#FFF5FF] text-xs font-rajdhani">
            <User className="w-3.5 h-3.5 text-neon-magenta" />
            <span>Kadet: <strong className="text-neon-cyan font-bold">{playerName}</strong></span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#57E389]/20 border border-[#57E389] text-[#57E389] font-bold text-xs font-orbitron shadow-[0_0_15px_rgba(87,227,137,0.4)]">
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            <span>Status: Misi Selesai ✓</span>
          </div>
        </div>

        {/* Pesan Apresiasi Sesuai Hasil Pemain */}
        <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-[#24102F] via-[#321442] to-[#24102F] border-2 border-[#FFD76A]/50 shadow-[0_0_20px_rgba(255,215,106,0.25)] text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD76A]/10 rounded-full blur-2xl pointer-events-none" />
          <h3 className="text-base sm:text-lg font-bold font-orbitron text-[#FFD76A] mb-1.5 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FFD76A]" />
            <span>{appreciation.title}</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#FFF5FF]/90 font-rajdhani max-w-xl mx-auto leading-relaxed">
            {appreciation.message}
          </p>
        </div>

        {/* Stars Award Display Banner */}
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

          <div className="text-xs text-[#C6B2D2] text-center sm:text-right max-w-xs font-rajdhani">
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

        {/* 6 Key Statistics Grid (Total Skor, Jawaban Benar, Jawaban Salah, Total Soal, Akurasi, Durasi) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {/* 1. Total Skor */}
          <div className="p-3.5 rounded-2xl bg-[#24102F]/90 border border-[#FFD76A]/40 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-[#C6B2D2] font-rajdhani uppercase tracking-wider flex items-center gap-1">
              <Trophy className="w-3 h-3 text-[#FFD76A]" /> Total Skor
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#FFD76A] font-orbitron mt-1 drop-shadow-[0_0_8px_rgba(255,215,106,0.5)]">
              {missionResult.score}
            </div>
            <span className="text-[10px] text-[#C6B2D2] mt-0.5">Poin Misi</span>
          </div>

          {/* 2. Persentase Keberhasilan / Akurasi */}
          <div className="p-3.5 rounded-2xl bg-[#24102F]/90 border border-neon-magenta/40 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-[#C6B2D2] font-rajdhani uppercase tracking-wider flex items-center gap-1">
              <Target className="w-3 h-3 text-neon-magenta" /> Keberhasilan
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-neon-magenta font-orbitron mt-1 drop-shadow-[0_0_8px_rgba(255,85,200,0.5)]">
              {missionResult.accuracy}%
            </div>
            <span className="text-[10px] text-[#C6B2D2] mt-0.5">Tingkat Akurasi</span>
          </div>

          {/* 3. Jumlah Jawaban Benar */}
          <div className="p-3.5 rounded-2xl bg-[#24102F]/90 border border-[#57E389]/40 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-[#C6B2D2] font-rajdhani uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#57E389]" /> Jawaban Benar
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#57E389] font-orbitron mt-1">
              {missionResult.correctCount}
            </div>
            <span className="text-[10px] text-[#57E389] mt-0.5">Tepat Sasaran</span>
          </div>

          {/* 4. Jumlah Jawaban Salah */}
          <div className="p-3.5 rounded-2xl bg-[#24102F]/90 border border-[#F43F5E]/40 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-[#C6B2D2] font-rajdhani uppercase tracking-wider flex items-center gap-1">
              <XCircle className="w-3 h-3 text-[#F43F5E]" /> Jawaban Salah
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#F43F5E] font-orbitron mt-1">
              {wrongCount}
            </div>
            <span className="text-[10px] text-[#F43F5E] mt-0.5">Perlu Evaluasi</span>
          </div>

          {/* 5. Total Soal */}
          <div className="p-3.5 rounded-2xl bg-[#24102F]/90 border border-[#00E5FF]/40 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-[#C6B2D2] font-rajdhani uppercase tracking-wider flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-[#00E5FF]" /> Total Soal
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#00E5FF] font-orbitron mt-1">
              {missionResult.totalQuestions}
            </div>
            <span className="text-[10px] text-[#C6B2D2] mt-0.5">Dikerjakan</span>
          </div>

          {/* 6. Durasi Permainan */}
          <div className="p-3.5 rounded-2xl bg-[#24102F]/90 border border-[#A78BFA]/40 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-[#C6B2D2] font-rajdhani uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#A78BFA]" /> Durasi
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-[#A78BFA] font-orbitron mt-1">
              {durationText}
            </div>
            <span className="text-[10px] text-[#C6B2D2] mt-0.5">Waktu Misi</span>
          </div>
        </div>

        {/* Extra Rewards Bar (XP & Kristal) */}
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mb-8">
          <div className="p-3 rounded-2xl bg-[#24102F]/80 border border-white/10 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-neon-magenta" />
            <span className="text-xs text-[#C6B2D2]">XP:</span>
            <span className="text-base font-extrabold text-[#FFB5E8] font-orbitron">
              +{missionResult.xpEarned}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-[#24102F]/80 border border-white/10 flex items-center justify-center gap-2">
            <Gem className="w-4 h-4 text-[#FFD76A]" />
            <span className="text-xs text-[#C6B2D2]">Kristal:</span>
            <span className="text-base font-extrabold text-[#FFD76A] font-orbitron">
              +{missionResult.crystalsEarned}
            </span>
          </div>
        </div>

        {/* Fitur Simpan Hasil ke Galeri HP / PC */}
        <div className="mb-8 p-6 rounded-3xl bg-gradient-to-b from-[#24102F] to-[#170921] border-2 border-[#00E5FF]/40 shadow-[0_0_30px_rgba(0,229,255,0.2)] text-center">
          <h3 className="text-base sm:text-lg font-bold font-orbitron text-[#FFF5FF] mb-2 flex items-center justify-center gap-2">
            <Share2 className="w-5 h-5 text-[#00E5FF]" />
            <span>Sertifikat Hasil Penjelajahan</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#C6B2D2] max-w-md mx-auto mb-5 font-rajdhani">
            Unduh gambar hasil misi dalam format PNG beresolusi tinggi langsung ke galeri foto perangkat Anda (HP & Komputer).
          </p>

          <button
            onClick={handleSaveToGallery}
            disabled={isSaving}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#00E5FF] via-[#7861FF] to-neon-magenta text-[#0A051B] hover:text-white font-extrabold font-orbitron text-sm sm:text-base tracking-wide shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:shadow-[0_0_35px_rgba(255,85,200,0.6)] transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-3"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Membuat Gambar Sertifikat...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Simpan ke Galeri</span>
              </>
            )}
          </button>

          {/* Feedback Notification Toast / Alert */}
          {saveNotification && (
            <div
              className={`mt-4 p-4 rounded-2xl text-xs sm:text-sm flex items-start sm:items-center justify-between gap-3 text-left transition-all ${
                saveNotification.type === 'success'
                  ? 'bg-[#57E389]/15 border-2 border-[#57E389] text-[#57E389] shadow-[0_0_20px_rgba(87,227,137,0.3)]'
                  : 'bg-[#F43F5E]/15 border-2 border-[#F43F5E] text-[#F43F5E] shadow-[0_0_20px_rgba(244,63,94,0.3)]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {saveNotification.type === 'success' ? (
                  <Check className="w-5 h-5 shrink-0 stroke-[3]" />
                ) : (
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                )}
                <span className="font-semibold font-rajdhani">
                  {saveNotification.message}
                </span>
              </div>
              <button
                onClick={() => setSaveNotification(null)}
                className="text-xs underline hover:opacity-80 shrink-0 font-orbitron"
              >
                Tutup
              </button>
            </div>
          )}
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
                  <div
                    key={code}
                    className="p-3 rounded-xl bg-[#24102F] border border-[#FFD76A]/30 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#FFD76A]/20 border border-[#FFD76A]/50 flex items-center justify-center text-[#FFD76A] shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#FFF5FF] block">
                        {ach.name}
                      </span>
                      <span className="text-[11px] text-[#C6B2D2] block line-clamp-1">
                        {ach.description}
                      </span>
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
                    <span
                      className={
                        hist.isCorrect
                          ? 'text-neon-emerald font-semibold'
                          : 'text-rose-400 font-semibold'
                      }
                    >
                      {hist.userAnswer || '(Tidak dijawab)'}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-space-surface border border-white/5">
                    <span className="text-neon-white/40 block">Kunci Jawaban Eksak:</span>
                    <span className="text-neon-cyan font-semibold">
                      {q.finalAnswerFormatted}
                    </span>
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
