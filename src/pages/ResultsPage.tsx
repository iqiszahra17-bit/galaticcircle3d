import React, { useEffect, useState } from 'react';
import { Planet } from '../types/math';
import { PLANETS } from '../data/planets';
import { MissionResult, UserProfile, CampaignSession } from '../types/game';
import { ACHIEVEMENTS } from '../data/achievements';
import { QUESTIONS } from '../data/questions';
import { soundEffects } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  formatDuration,
  getFinalCampaignAppreciation,
  getAppreciation,
  saveFinalCampaignImageToGallery,
  FinalCampaignCardData,
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
  Play,
  Layers,
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
  campaignSession: CampaignSession;
  onReplay: () => void;
  onBackToMap: () => void;
  onNextPlanet: () => void;
  onRestartNewCampaign: () => void;
  hasNextPlanet: boolean;
  currentUser?: UserProfile | null;
}

export const ResultsPage: React.FC<Props> = ({
  planet,
  missionResult,
  questionHistory,
  campaignSession,
  onReplay,
  onBackToMap,
  onNextPlanet,
  onRestartNewCampaign,
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

  // Check if this is the final map (Planet 4: Nexus)
  const isFinalMap = planet.order === 4 || planet.id === 'nexus';

  // Helper to extract map data accurately by planetId
  const getMapData = (planetId: string, planetName: string, order: number) => {
    const fromCampaign = campaignSession?.mapScores?.[planetId];
    if (fromCampaign) {
      return fromCampaign;
    }
    // If it's the current planet just completed
    if (planet.id === planetId && missionResult) {
      return {
        planetId,
        planetName,
        order,
        score: missionResult.score,
        correctCount: missionResult.correctCount,
        wrongCount: Math.max(0, 5 - missionResult.correctCount),
        totalQuestions: 5,
        accuracy: missionResult.accuracy,
        timeSpentSeconds: missionResult.timeSpentSeconds,
        completedAt: missionResult.completedAt,
      };
    }

    // Fallback to saved progress if available for this cadet
    try {
      const userId = currentUser ? currentUser.id : 'guest';
      const rawProg = localStorage.getItem(`galactic_circle_progress_db_${userId}`);
      if (rawProg) {
        const parsed = JSON.parse(rawProg);
        const pProg = parsed[planetId];
        if (pProg && pProg.highestScore > 0) {
          const estCorrect = pProg.stars
            ? Math.min(5, Math.max(1, Math.round(pProg.stars / 4)))
            : 4;
          return {
            planetId,
            planetName,
            order,
            score: pProg.highestScore,
            correctCount: estCorrect,
            wrongCount: Math.max(0, 5 - estCorrect),
            totalQuestions: 5,
            accuracy: Math.round((estCorrect / 5) * 100),
            timeSpentSeconds: 75,
            completedAt: pProg.updatedAt || new Date().toISOString(),
          };
        }
      }
    } catch {
      // Fallback
    }

    return {
      planetId,
      planetName,
      order,
      score: 0,
      correctCount: 0,
      wrongCount: 0,
      totalQuestions: 5,
      accuracy: 0,
      timeSpentSeconds: 0,
      completedAt: '',
    };
  };

  const map1 = getMapData('tangensia', 'Tangensia', 1);
  const map2 = getMapData('angularis', 'Angularis', 2);
  const map3 = getMapData('arcadia', 'Arcadia', 3);
  const map4 = getMapData('nexus', 'Nexus', 4);

  // Overall 4-map campaign totals
  const totalScore = map1.score + map2.score + map3.score + map4.score;
  const totalCorrect =
    map1.correctCount + map2.correctCount + map3.correctCount + map4.correctCount;
  const totalQuestions = 20; // 4 maps x 5 questions
  const totalWrong = Math.max(0, totalQuestions - totalCorrect);
  const overallAccuracy =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const totalDurationSeconds =
    map1.timeSpentSeconds +
    map2.timeSpentSeconds +
    map3.timeSpentSeconds +
    map4.timeSpentSeconds;

  const finalAppreciation = getFinalCampaignAppreciation(overallAccuracy);
  const singleAppreciation = getAppreciation(missionResult.accuracy);

  useEffect(() => {
    // Play celebratory victory fanfare
    soundEffects.playVictory();

    // Fire festive cosmic confetti on load
    try {
      confetti({
        particleCount: isFinalMap ? 180 : 90,
        spread: isFinalMap ? 100 : 70,
        origin: { y: 0.6 },
        colors: ['#00E5FF', '#7861FF', '#FFD34E', '#FF55C8', '#57E389'],
      });
    } catch {
      // Confetti fallback
    }
  }, [isFinalMap]);

  // Handler for Saving Grand Final Certificate to Gallery
  const handleSaveToGallery = async () => {
    setIsSaving(true);
    setSaveNotification(null);
    soundEffects.playClick();

    try {
      const cardData: FinalCampaignCardData = {
        playerName,
        maps: [
          {
            planetId: 'tangensia',
            planetName: 'Tangensia',
            order: 1,
            score: map1.score,
            correctCount: map1.correctCount,
            totalQuestions: 5,
            timeSpentSeconds: map1.timeSpentSeconds,
          },
          {
            planetId: 'angularis',
            planetName: 'Angularis',
            order: 2,
            score: map2.score,
            correctCount: map2.correctCount,
            totalQuestions: 5,
            timeSpentSeconds: map2.timeSpentSeconds,
          },
          {
            planetId: 'arcadia',
            planetName: 'Arcadia',
            order: 3,
            score: map3.score,
            correctCount: map3.correctCount,
            totalQuestions: 5,
            timeSpentSeconds: map3.timeSpentSeconds,
          },
          {
            planetId: 'nexus',
            planetName: 'Nexus',
            order: 4,
            score: map4.score,
            correctCount: map4.correctCount,
            totalQuestions: 5,
            timeSpentSeconds: map4.timeSpentSeconds,
          },
        ],
        totalScore,
        totalCorrect,
        totalWrong,
        totalQuestions,
        overallAccuracy,
        totalDurationSeconds,
        appreciationTitle: finalAppreciation.title,
        appreciationMessage: finalAppreciation.message,
        completedAt: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      const res = await saveFinalCampaignImageToGallery(cardData);
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
        message:
          (err as Error).message ||
          'Terjadi kesalahan saat memproses gambar sertifikat hasil akhir.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // =========================================================================
  // CASE 1: GRAND FINALE RESULTS PAGE (Only shown after Map 4 is completed!)
  // =========================================================================
  if (isFinalMap) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
        {/* Top Victory & Grand Results Header Card */}
        <div className="w-full rounded-3xl bg-[#321442] border-2 border-[#FFD76A]/60 p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden text-center hud-corner mb-8">
          {/* Ambient Cosmic Halos */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#FFD76A]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-neon-magenta/25 rounded-full blur-3xl pointer-events-none" />

          {/* Grand Victory Trophy Emblem */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-[#24102F] border-2 border-[#FFD76A] text-[#FFD76A] mb-4 shadow-[0_0_35px_rgba(255,215,106,0.6)] animate-pulse-slow">
            <Trophy className="w-12 h-12 text-[#FFD76A] animate-bounce" />
          </div>

          {/* Grand Title */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#FFD76A]/20 border border-[#FFD76A] text-[#FFD76A] text-xs font-bold font-orbitron mb-3 tracking-wider">
            ✦ HASIL AKHIR PERMAINAN ✦
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-orbitron text-[#FFF5FF] tracking-wider mb-2">
            SELAMAT! ANDA TELAH MENYELESAIKAN SELURUH 4 PETA GALAKSI!
          </h1>
          <p className="text-xs sm:text-sm text-[#C6B2D2] max-w-xl mx-auto mb-5 font-rajdhani">
            Seluruh rute dan kalkulasi geometri lingkaran pada Planet Tangensia, Angularis,
            Arcadia, hingga pusat galaksi Nexus berhasil diselesaikan secara paripurna.
          </p>

          {/* Player Profile & Campaign Status Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#24102F] border border-[#FF55C8]/50 text-[#FFF5FF] text-xs font-rajdhani">
              <User className="w-3.5 h-3.5 text-neon-magenta" />
              <span>
                Kadet Penjelajah:{' '}
                <strong className="text-neon-cyan font-bold">{playerName}</strong>
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#57E389]/20 border border-[#57E389] text-[#57E389] font-bold text-xs font-orbitron shadow-[0_0_15px_rgba(87,227,137,0.4)]">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>Status: 4/4 Peta Selesai Paripurna ✓</span>
            </div>
          </div>

          {/* Hero Total Score Display Box */}
          <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-[#24102F] via-[#441857] to-[#24102F] border-2 border-[#FFD76A] shadow-[0_0_35px_rgba(255,215,106,0.35)] text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#FFD76A]/10 rounded-full blur-2xl pointer-events-none" />
            <span className="text-xs sm:text-sm text-[#FFB5E8] font-orbitron font-bold uppercase tracking-wider block mb-1">
              TOTAL SKOR KESELURUHAN (4 PETA)
            </span>
            <div className="text-4xl sm:text-6xl font-black text-[#FFD76A] font-orbitron drop-shadow-[0_0_20px_rgba(255,215,106,0.6)] my-2">
              {totalScore} <span className="text-2xl sm:text-3xl text-white">POIN</span>
            </div>
            <p className="text-xs text-[#C6B2D2] font-rajdhani max-w-md mx-auto">
              Akumulasi presisi perhitungan geometri dari Peta 1 + Peta 2 + Peta 3 + Peta 4.
            </p>
          </div>

          {/* Rekapitulasi Skor Setiap Peta (Peta 1 s/d Peta 4) */}
          <div className="mb-8 text-left">
            <h3 className="text-sm font-bold font-orbitron text-[#00E5FF] mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00E5FF]" />
              REKAPITULASI SKOR SETIAP PETA:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Peta 1: Tangensia */}
              <div className="p-4 rounded-2xl bg-[#24102F] border-2 border-[#00E5FF]/40 shadow-[0_0_15px_rgba(0,229,255,0.2)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold font-orbitron text-[#00E5FF]">
                      PETA 1: TANGENSIA
                    </span>
                    <span className="text-[10px] text-[#57E389] font-bold">✓ Selesai</span>
                  </div>
                  <span className="text-[11px] text-[#C6B2D2] block font-rajdhani">
                    Garis Singgung (GSPL & GSPD)
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#C6B2D2] block font-rajdhani">Skor Peta 1</span>
                    <span className="text-2xl font-black font-orbitron text-[#FFD76A]">
                      {map1.score}{' '}
                      <span className="text-xs text-white font-normal">Poin</span>
                    </span>
                  </div>
                  <div className="text-right text-[11px] font-rajdhani text-[#C6B2D2]">
                    <span className="block text-[#57E389]">
                      ✓ {map1.correctCount} / 5 Benar
                    </span>
                    <span className="block text-[#A78BFA]">
                      ⏱ {formatDuration(map1.timeSpentSeconds)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Peta 2: Angularis */}
              <div className="p-4 rounded-2xl bg-[#24102F] border-2 border-[#7861FF]/40 shadow-[0_0_15px_rgba(120,97,255,0.2)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold font-orbitron text-[#B388FF]">
                      PETA 2: ANGULARIS
                    </span>
                    <span className="text-[10px] text-[#57E389] font-bold">✓ Selesai</span>
                  </div>
                  <span className="text-[11px] text-[#C6B2D2] block font-rajdhani">
                    Sudut Pusat, Keliling & Tali Busur
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#C6B2D2] block font-rajdhani">Skor Peta 2</span>
                    <span className="text-2xl font-black font-orbitron text-[#FFD76A]">
                      {map2.score}{' '}
                      <span className="text-xs text-white font-normal">Poin</span>
                    </span>
                  </div>
                  <div className="text-right text-[11px] font-rajdhani text-[#C6B2D2]">
                    <span className="block text-[#57E389]">
                      ✓ {map2.correctCount} / 5 Benar
                    </span>
                    <span className="block text-[#A78BFA]">
                      ⏱ {formatDuration(map2.timeSpentSeconds)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Peta 3: Arcadia */}
              <div className="p-4 rounded-2xl bg-[#24102F] border-2 border-[#FFD34E]/40 shadow-[0_0_15px_rgba(255,211,78,0.2)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold font-orbitron text-[#FFD34E]">
                      PETA 3: ARCADIA
                    </span>
                    <span className="text-[10px] text-[#57E389] font-bold">✓ Selesai</span>
                  </div>
                  <span className="text-[11px] text-[#C6B2D2] block font-rajdhani">
                    Panjang Busur & Luas Juring
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#C6B2D2] block font-rajdhani">Skor Peta 3</span>
                    <span className="text-2xl font-black font-orbitron text-[#FFD76A]">
                      {map3.score}{' '}
                      <span className="text-xs text-white font-normal">Poin</span>
                    </span>
                  </div>
                  <div className="text-right text-[11px] font-rajdhani text-[#C6B2D2]">
                    <span className="block text-[#57E389]">
                      ✓ {map3.correctCount} / 5 Benar
                    </span>
                    <span className="block text-[#A78BFA]">
                      ⏱ {formatDuration(map3.timeSpentSeconds)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Peta 4: Nexus */}
              <div className="p-4 rounded-2xl bg-[#24102F] border-2 border-[#00FF9D]/40 shadow-[0_0_15px_rgba(0,255,157,0.2)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold font-orbitron text-[#00FF9D]">
                      PETA 4: NEXUS (TERAKHIR)
                    </span>
                    <span className="text-[10px] text-[#57E389] font-bold">✓ Selesai</span>
                  </div>
                  <span className="text-[11px] text-[#C6B2D2] block font-rajdhani">
                    Sintesis Geometri Terpadu
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#C6B2D2] block font-rajdhani">Skor Peta 4</span>
                    <span className="text-2xl font-black font-orbitron text-[#FFD76A]">
                      {map4.score}{' '}
                      <span className="text-xs text-white font-normal">Poin</span>
                    </span>
                  </div>
                  <div className="text-right text-[11px] font-rajdhani text-[#C6B2D2]">
                    <span className="block text-[#57E389]">
                      ✓ {map4.correctCount} / 5 Benar
                    </span>
                    <span className="block text-[#A78BFA]">
                      ⏱ {formatDuration(map4.timeSpentSeconds)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Key Overall Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {/* Jawaban Benar */}
            <div className="p-3.5 rounded-2xl bg-[#24102F]/90 border border-[#57E389]/40 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-[#C6B2D2] font-rajdhani uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#57E389]" /> Jawaban Benar
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#57E389] font-orbitron mt-1">
                {totalCorrect}{' '}
                <span className="text-xs text-white/70 font-normal">/ {totalQuestions}</span>
              </div>
              <span className="text-[10px] text-[#57E389] mt-0.5">Tepat Sasaran</span>
            </div>

            {/* Jawaban Salah */}
            <div className="p-3.5 rounded-2xl bg-[#24102F]/90 border border-[#F43F5E]/40 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-[#C6B2D2] font-rajdhani uppercase tracking-wider flex items-center gap-1">
                <XCircle className="w-3 h-3 text-[#F43F5E]" /> Jawaban Salah
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#F43F5E] font-orbitron mt-1">
                {totalWrong}{' '}
                <span className="text-xs text-white/70 font-normal">/ {totalQuestions}</span>
              </div>
              <span className="text-[10px] text-[#F43F5E] mt-0.5">Perlu Evaluasi</span>
            </div>

            {/* Persentase Keberhasilan */}
            <div className="p-3.5 rounded-2xl bg-[#24102F]/90 border border-neon-magenta/40 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-[#C6B2D2] font-rajdhani uppercase tracking-wider flex items-center gap-1">
                <Target className="w-3 h-3 text-neon-magenta" /> Keberhasilan
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-neon-magenta font-orbitron mt-1 drop-shadow-[0_0_8px_rgba(255,85,200,0.5)]">
                {overallAccuracy}%
              </div>
              <span className="text-[10px] text-[#C6B2D2] mt-0.5">Akurasi 4 Peta</span>
            </div>

            {/* Durasi Permainan Keseluruhan */}
            <div className="p-3.5 rounded-2xl bg-[#24102F]/90 border border-[#A78BFA]/40 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-[#C6B2D2] font-rajdhani uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#A78BFA]" /> Durasi Total
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-[#A78BFA] font-orbitron mt-1">
                {formatDuration(totalDurationSeconds)}
              </div>
              <span className="text-[10px] text-[#C6B2D2] mt-0.5">Waktu 4 Misi</span>
            </div>
          </div>

          {/* Ucapan Apresiasi Tamat Sesuai Hasil Pemain */}
          <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-[#24102F] via-[#321442] to-[#24102F] border-2 border-[#FFD76A]/50 shadow-[0_0_20px_rgba(255,215,106,0.25)] text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD76A]/10 rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-base sm:text-lg font-bold font-orbitron text-[#FFD76A] mb-1.5 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FFD76A]" />
              <span>{finalAppreciation.title}</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#FFF5FF]/90 font-rajdhani max-w-xl mx-auto leading-relaxed">
              {finalAppreciation.message}
            </p>
          </div>

          {/* Fitur Simpan Hasil ke Galeri HP / PC */}
          <div className="mb-8 p-6 rounded-3xl bg-gradient-to-b from-[#24102F] to-[#170921] border-2 border-[#00E5FF]/40 shadow-[0_0_30px_rgba(0,229,255,0.2)] text-center">
            <h3 className="text-base sm:text-lg font-bold font-orbitron text-[#FFF5FF] mb-2 flex items-center justify-center gap-2">
              <Share2 className="w-5 h-5 text-[#00E5FF]" />
              <span>Sertifikat Hasil Akhir 4 Peta</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#C6B2D2] max-w-md mx-auto mb-5 font-rajdhani">
              Unduh gambar sertifikat rekapitulasi seluruh 4 peta dalam format PNG beresolusi
              tinggi langsung ke galeri foto perangkat Anda (HP & Komputer).
            </p>

            <button
              onClick={handleSaveToGallery}
              disabled={isSaving}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#00E5FF] via-[#7861FF] to-neon-magenta text-[#0A051B] hover:text-white font-extrabold font-orbitron text-sm sm:text-base tracking-wide shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:shadow-[0_0_35px_rgba(255,85,200,0.6)] transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-3"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Membuat Sertifikat PNG...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Simpan ke Galeri</span>
                </>
              )}
            </button>

            {/* Feedback Notification Toast */}
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

          {/* Action Button Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-white/10">
            <button
              onClick={() => {
                soundEffects.playClick();
                onRestartNewCampaign();
              }}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-neon-magenta via-[#8D3CC7] to-neon-magenta text-[#FFF5FF] font-black font-orbitron text-xs sm:text-sm tracking-wide shadow-neon-magenta hover:opacity-95 flex items-center gap-2 transition-all hover:scale-105"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Mulai Petualangan Baru</span>
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
          </div>
        </div>

        {/* Question-by-Question Review for Nexus */}
        <div className="w-full rounded-2xl bg-space-surface/90 border border-space-border p-6 backdrop-blur-xl">
          <h3 className="text-base font-bold font-orbitron text-neon-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-neon-cyan" />
            Tinjauan Soal Sektor Terakhir ({planet.name})
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
  }

  // =========================================================================
  // CASE 2: INTERMEDIATE LEVEL CLEARANCE (Map 1, 2, or 3 completed)
  // Halaman hasil akhir hanya muncul setelah Peta 4 selesai!
  // =========================================================================
  const nextPlanet = hasNextPlanet ? PLANETS[planet.order] : null;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
      <div className="w-full rounded-3xl bg-[#321442] border-2 border-[#FF55C8]/40 p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden text-center hud-corner mb-8">
        {/* Glow halo */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-[#8D3CC7]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-neon-magenta/20 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#24102F] border-2 border-[#57E389]/60 text-[#57E389] mb-3 shadow-[0_0_20px_rgba(87,227,137,0.4)]">
          <CheckCircle2 className="w-8 h-8 text-[#57E389]" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold font-orbitron text-[#FFF5FF] mb-2">
          MISI PETA {planet.order} SELESAI: {planet.name.toUpperCase()}!
        </h1>
        <p className="text-xs sm:text-sm text-[#C6B2D2] max-w-md mx-auto mb-4 font-rajdhani">
          Sektor {planet.topicTitle} telah berhasil disinkronisasi. Skor Anda telah tercatat
          dalam rekapitulasi petualangan galaksi!
        </p>

        {/* Progress Stepper Banner across 4 maps */}
        <div className="mb-6 p-4 rounded-2xl bg-[#24102F] border border-white/10">
          <div className="text-[11px] font-orbitron text-[#FFB5E8] mb-3 flex items-center justify-between">
            <span>PROGRES PETUALANGAN 4 PETA:</span>
            <span className="text-neon-cyan font-bold">{planet.order} / 4 Peta Selesai</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-rajdhani">
            {PLANETS.map((p) => {
              const isDone = p.order <= planet.order;
              const isCurrent = p.order === planet.order;
              return (
                <div
                  key={p.id}
                  className={`p-2 rounded-xl border transition-all ${
                    isDone
                      ? 'bg-[#57E389]/15 border-[#57E389] text-[#57E389] font-bold'
                      : 'bg-white/5 border-white/10 text-white/40'
                  }`}
                >
                  <span className="block font-orbitron">Peta {p.order}</span>
                  <span className="truncate block">{p.name}</span>
                  <span className="text-[9px] block mt-0.5">
                    {isDone ? '✓ Selesai' : 'Terkunci'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Level Stats Summary */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-[#24102F]/90 border border-[#FFD76A]/40 text-center">
            <span className="text-[10px] text-[#C6B2D2] font-rajdhani uppercase">
              Skor Peta Ini
            </span>
            <div className="text-2xl font-bold font-orbitron text-[#FFD76A] mt-1">
              +{missionResult.score}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#24102F]/90 border border-[#57E389]/40 text-center">
            <span className="text-[10px] text-[#C6B2D2] font-rajdhani uppercase">
              Jawaban Benar
            </span>
            <div className="text-2xl font-bold font-orbitron text-[#57E389] mt-1">
              {missionResult.correctCount} / 5
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#24102F]/90 border border-neon-magenta/40 text-center">
            <span className="text-[10px] text-[#C6B2D2] font-rajdhani uppercase">
              Bintang Diperoleh
            </span>
            <div className="text-2xl font-bold font-orbitron text-neon-magenta mt-1 flex items-center justify-center gap-1">
              <Star className="w-5 h-5 fill-[#FFD76A] text-[#FFD76A]" />
              <span>{missionResult.starsEarned || 0}</span>
            </div>
          </div>
        </div>

        {/* Explanatory notice */}
        <div className="mb-6 p-4 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-xs text-[#00E5FF] font-rajdhani leading-relaxed text-center">
          ✨ <strong>Catatan Misi:</strong> Skor Anda ({missionResult.score} Poin) telah
          tersimpan dan akan digabungkan dengan peta berikutnya. Selesaikan hingga{' '}
          <strong>Peta 4 (Nexus)</strong> untuk melihat <strong>Halaman Hasil Akhir</strong>{' '}
          dan mengunduh Sertifikat Rekapitulasi ke Galeri!
        </div>

        {/* Primary Action Button Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-white/10">
          {hasNextPlanet && nextPlanet && (
            <button
              onClick={() => {
                soundEffects.playClick();
                onNextPlanet();
              }}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-neon-magenta via-[#8D3CC7] to-neon-magenta text-[#FFF5FF] font-black font-orbitron text-xs sm:text-sm tracking-wide shadow-neon-magenta hover:opacity-95 flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <span>Lanjut ke Peta {nextPlanet.order}: {nextPlanet.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => {
              soundEffects.playClick();
              onBackToMap();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-[#24102F] border border-[#FF55C8]/30 hover:border-neon-magenta text-[#FFF5FF] hover:text-neon-magenta text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>Peta Galaksi</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              onReplay();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-[#24102F] border border-[#FF55C8]/30 hover:border-neon-magenta text-[#FFF5FF] hover:text-neon-magenta text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Ulangi Peta Ini</span>
          </button>
        </div>
      </div>

      {/* Question review */}
      <div className="w-full rounded-2xl bg-space-surface/90 border border-space-border p-6 backdrop-blur-xl">
        <h3 className="text-base font-bold font-orbitron text-neon-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-neon-cyan" />
          Tinjauan & Evaluasi Soal ({planet.name})
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
