import React, { useState } from 'react';
import { Planet } from '../types/math';
import { GameProgress, UserProfile } from '../types/game';
import { PLANETS } from '../data/planets';
import { soundEffects } from '../utils/soundEffects';
import {
  ArrowLeft,
  Settings,
  Check,
  Lock,
  Star,
  Play,
  BookOpen,
  Info,
  Sparkles,
  Compass,
  Trophy,
  AlertCircle
} from 'lucide-react';

interface Props {
  userProgress: Record<string, GameProgress>;
  currentUser: UserProfile | null;
  onSelectPlanet: (planetId: string, challengeMode: boolean) => void;
  onOpenMateri?: (planetId: string) => void;
  onBack: () => void;
  onOpenAuth: () => void;
  newlyUnlockedPlanetId?: string | null;
}

export const GalaxyMapPage: React.FC<Props> = ({
  userProgress,
  currentUser,
  onSelectPlanet,
  onOpenMateri,
  onBack,
  onOpenAuth,
  newlyUnlockedPlanetId,
}) => {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet>(PLANETS[0]);
  const [challengeMode, setChallengeMode] = useState(false);
  const [showBriefingModal, setShowBriefingModal] = useState(false);
  const [lockedToast, setLockedToast] = useState<string | null>(null);

  const levelInfoMap: Record<string, { label: string; lv: number }> = {
    tangensia: { label: 'Lingkaran & Juring', lv: 1 },
    angularis: { label: 'Sudut Pusat & Keliling', lv: 2 },
    arcadia: { label: 'Panjang Busur & Juring', lv: 3 },
    nexus: { label: 'Sintesis Garis Singgung', lv: 4 },
  };

  // Get stars for planet: defaults to 0 if not yet played (format: ⭐ 0/20)
  const getLevelStars = (planetId: string): number => {
    const prog = userProgress[planetId];
    if (prog && typeof prog.stars === 'number') {
      return Math.min(20, Math.max(0, prog.stars));
    }
    return 0; // Starts with 0/20 for unplayed levels
  };

  // Determine level status:
  // Level 1: Open by default ('unlocked' or 'in_progress' or 'completed')
  // Next levels: Locked until previous level is completed ('completed')
  const getPlanetStatus = (planet: Planet): 'locked' | 'unlocked' | 'in_progress' | 'completed' => {
    const progress = userProgress[planet.id];

    // If marked completed, keep completed
    if (progress?.status === 'completed') return 'completed';

    // Level 1 is always unlocked by default
    if (planet.order === 1) {
      if (progress?.stars && progress.stars > 0) return 'in_progress';
      return 'unlocked';
    }

    // Next level check: is previous level completed?
    const prevPlanet = PLANETS[planet.order - 2];
    const prevCompleted = prevPlanet && userProgress[prevPlanet.id]?.status === 'completed';

    if (prevCompleted) {
      if (progress?.status === 'in_progress' || (progress?.stars && progress.stars > 0)) {
        return 'in_progress';
      }
      return 'unlocked';
    }

    return 'locked';
  };

  const handlePlanetClick = (planet: Planet) => {
    const status = getPlanetStatus(planet);
    if (status === 'locked') {
      soundEffects.playWrong();
      setLockedToast(`Sektor ${planet.name} terkunci! Selesaikan Level ${planet.order - 1} terlebih dahulu untuk membukanya.`);
      setTimeout(() => setLockedToast(null), 3500);
      return;
    }

    soundEffects.playClick();
    setSelectedPlanet(planet);
    setShowBriefingModal(true);
  };

  const handleLaunch = () => {
    const status = getPlanetStatus(selectedPlanet);
    if (status === 'locked') {
      soundEffects.playWrong();
      return;
    }
    soundEffects.playVictory();
    setShowBriefingModal(false);
    onSelectPlanet(selectedPlanet.id, challengeMode);
  };

  const handleGoToMateri = () => {
    soundEffects.playClick();
    setShowBriefingModal(false);
    if (onOpenMateri) {
      onOpenMateri(selectedPlanet.id);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 sm:py-8 flex flex-col items-center">
      {/* Newly Unlocked Planet Alert Banner */}
      {newlyUnlockedPlanetId && (
        <div className="w-full max-w-2xl mb-4 p-4 rounded-2xl bg-gradient-to-r from-cosmic-purple/40 via-neon-magenta/30 to-cosmic-purple/40 border-2 border-neon-magenta text-neon-white shadow-[0_0_25px_rgba(255,85,200,0.4)] flex items-center justify-between gap-3 animate-bounce">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon-magenta/20 border border-neon-magenta flex items-center justify-center text-neon-magenta shrink-0">
              <Sparkles className="w-6 h-6 text-[#FFD76A]" />
            </div>
            <div>
              <span className="text-xs font-bold text-neon-gold uppercase font-orbitron tracking-wider block">
                SEKTOR BARU TERBUKA!
              </span>
              <span className="text-xs text-[#FFF5FF]">
                Selamat! Anda berhasil membuka rute ke level berikutnya di galaksi!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Locked Toast Notification */}
      {lockedToast && (
        <div className="fixed top-20 z-50 p-4 rounded-2xl bg-[#321442] border-2 border-[#62536D] text-[#FFF5FF] shadow-2xl flex items-center gap-3 animate-fadeIn max-w-md mx-4">
          <Lock className="w-5 h-5 text-[#FF55C8] shrink-0" />
          <p className="text-xs font-medium">{lockedToast}</p>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between pb-3 mb-6 border-b border-[#FF55C8]/20">
        <button
          onClick={() => {
            soundEffects.playClick();
            onBack();
          }}
          className="p-2.5 rounded-2xl bg-[#321442] hover:bg-[#24102F] border border-[#FF55C8]/30 text-[#FFF5FF]/80 hover:text-neon-magenta transition-colors"
          aria-label="Kembali"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h1 className="text-lg sm:text-2xl font-orbitron font-extrabold text-[#FFF5FF] tracking-widest uppercase">
            PETA SISTEM GALAKSI
          </h1>
          <p className="text-[11px] text-[#C6B2D2] font-rajdhani hidden sm:block">
            Jelajahi 4 Planet Beranomali Geometri Lingkaran SMA Kelas XI • Raih 20 Bintang per Level
          </p>
        </div>

        <button
          onClick={() => {
            soundEffects.playClick();
            onOpenAuth();
          }}
          className="p-2.5 rounded-2xl bg-[#321442] hover:bg-[#24102F] border border-[#FF55C8]/30 text-[#FFF5FF]/80 hover:text-neon-magenta transition-colors"
          aria-label="Pengaturan"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Galaxy Map Arena (Cosmic Plum + Magenta Theme) */}
      <div className="relative w-full min-h-[580px] lg:h-[650px] rounded-3xl bg-[#24102F]/90 border border-[#FF55C8]/30 backdrop-blur-2xl p-4 sm:p-8 overflow-hidden flex flex-col justify-between hud-corner shadow-2xl">
        {/* Subtle Starfield & Cosmic Nebula in Background */}
        <div className="absolute inset-0 bg-radial-at-c from-[#8D3CC7]/15 via-transparent to-[#170D24] pointer-events-none" />

        {/* Ambient Nebula Clouds */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#8D3CC7]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#FF55C8]/10 blur-3xl pointer-events-none" />

        {/* Curved Dotted Trajectory Orbit Vector */}
        <svg viewBox="0 0 1000 650" className="absolute inset-0 w-full h-full pointer-events-none preserve-3d">
          <defs>
            <linearGradient id="orbitTrajectoryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF55C8" stopOpacity="0.9" />
              <stop offset="35%" stopColor="#8D3CC7" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#FFD76A" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#57E389" stopOpacity="0.9" />
            </linearGradient>

            {/* Realistic Planet 1 Gradient: Tangensia Oceanic Cosmic Plum */}
            <radialGradient id="planet1Light" cx="30%" cy="25%" r="75%">
              <stop offset="0%" stopColor="#FFB5E8" />
              <stop offset="25%" stopColor="#FF55C8" />
              <stop offset="60%" stopColor="#8D3CC7" />
              <stop offset="85%" stopColor="#321442" />
              <stop offset="100%" stopColor="#170D24" />
            </radialGradient>

            {/* Realistic Planet 2 Gradient: Angularis Cosmic Violet */}
            <radialGradient id="planet2Light" cx="30%" cy="25%" r="75%">
              <stop offset="0%" stopColor="#F5D0FE" />
              <stop offset="25%" stopColor="#C084FC" />
              <stop offset="60%" stopColor="#8D3CC7" />
              <stop offset="85%" stopColor="#3B0764" />
              <stop offset="100%" stopColor="#170D24" />
            </radialGradient>

            {/* Realistic Planet 3 Gradient: Arcadia Solar Gold Gas Giant */}
            <radialGradient id="planet3Light" cx="30%" cy="25%" r="75%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="25%" stopColor="#FFD76A" />
              <stop offset="60%" stopColor="#D97706" />
              <stop offset="85%" stopColor="#78350F" />
              <stop offset="100%" stopColor="#170D24" />
            </radialGradient>

            {/* Realistic Planet 4 Gradient: Nexus Deep Iron Cyborg */}
            <radialGradient id="planet4Light" cx="30%" cy="25%" r="75%">
              <stop offset="0%" stopColor="#FF55C8" />
              <stop offset="20%" stopColor="#62536D" />
              <stop offset="65%" stopColor="#321442" />
              <stop offset="90%" stopColor="#24102F" />
              <stop offset="100%" stopColor="#170D24" />
            </radialGradient>
          </defs>

          {/* S-curve dotted trajectory connecting Planet 1 -> 2 -> 3 -> 4 */}
          <path
            d="M 190 140 C 450 40, 550 160, 800 150 C 950 280, 500 380, 220 480 C 400 620, 650 560, 810 500"
            fill="none"
            stroke="url(#orbitTrajectoryGrad)"
            strokeWidth="4"
            strokeDasharray="8 8"
          />

          {/* Cosmic navigational radar pings */}
          <circle cx="490" cy="115" r="4" fill="#FF55C8" className="animate-ping" />
          <circle cx="520" cy="390" r="4" fill="#FFD76A" className="animate-ping" />
        </svg>

        {/* 4 Extra-Large Realistic 3D Planets Placed Along The Orbit */}
        <div className="relative w-full h-full min-h-[520px] lg:h-full">
          {/* =========================================================
              PLANET 1: Lingkaran & Juring (Tangensia)
              ========================================================= */}
          {(() => {
            const planet = PLANETS[0];
            const status = getPlanetStatus(planet);
            const info = levelInfoMap[planet.id];
            const stars = getLevelStars(planet.id);
            const isCompleted = status === 'completed';
            const isInProgress = status === 'in_progress';
            const isLocked = status === 'locked';

            return (
              <div
                onClick={() => handlePlanetClick(planet)}
                className={`absolute top-2 left-2 sm:left-10 lg:left-16 flex flex-col items-center cursor-pointer group z-10 transition-transform duration-300 hover:scale-105 ${
                  isLocked ? 'opacity-70 grayscale-[30%]' : ''
                }`}
              >
                <div className="relative">
                  {/* Outer Atmospheric Glow Halo */}
                  <div className={`absolute -inset-4 rounded-full blur-xl transition-all ${
                    isCompleted ? 'bg-[#57E389]/20' : 'bg-neon-magenta/25 group-hover:bg-neon-magenta/40'
                  }`} />

                  {/* Active Level Pulse Ring */}
                  {status === 'unlocked' && (
                    <div className="absolute -inset-2 rounded-full border-2 border-dashed border-[#FF55C8] animate-spin-slow opacity-90 pointer-events-none" />
                  )}

                  {/* Realistic 3D Planet Sphere */}
                  <svg viewBox="0 0 160 160" className="w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 drop-shadow-[0_10px_25px_rgba(255,85,200,0.35)]">
                    <circle cx="80" cy="80" r="68" fill="url(#planet1Light)" stroke="#FF55C8" strokeWidth="2" />
                    <path
                      d="M 25 65 Q 80 85 135 65 Q 90 55 25 65 Z"
                      fill="#FFFFFF"
                      fillOpacity="0.25"
                    />
                    <path
                      d="M 35 95 Q 80 115 125 95 Q 80 85 35 95 Z"
                      fill="#FFB5E8"
                      fillOpacity="0.25"
                    />
                    <circle cx="80" cy="80" r="67" fill="none" stroke="rgba(255,181,232,0.4)" strokeWidth="1.5" />
                  </svg>

                  {/* Checklist Completed Badge (Checkmark hijau #57E389) */}
                  {isCompleted && (
                    <div 
                      className="absolute -top-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#57E389] text-[#170D24] flex items-center justify-center font-bold shadow-[0_0_15px_rgba(87,227,137,0.8)] border-2 border-[#170D24] z-20"
                      title="Level 1 Selesai!"
                    >
                      <Check className="w-5 h-5 stroke-[3] text-[#170D24]" />
                    </div>
                  )}

                  {/* In Progress Badge */}
                  {isInProgress && (
                    <div 
                      className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#FF55C8] text-[#170D24] text-[9px] font-extrabold shadow-[0_0_12px_rgba(255,85,200,0.6)] border border-[#170D24] flex items-center gap-1 z-20"
                      title="Sedang Dikerjakan"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FFF5FF] animate-ping" />
                      <span>PROSES</span>
                    </div>
                  )}

                  {/* Lock Overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-[#170D24]/75 backdrop-blur-[2px] z-20">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#321442] border-2 border-[#62536D] flex items-center justify-center text-[#62536D] shadow-xl">
                        <Lock className="w-5 h-5 text-[#62536D]" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-center mt-2 bg-[#321442]/90 px-3 py-1.5 rounded-2xl border border-[#FF55C8]/30 backdrop-blur-md max-w-[155px] sm:max-w-[190px] shadow-lg">
                  <span className="font-orbitron font-extrabold text-xs sm:text-sm text-[#FFF5FF] block drop-shadow">
                    {info.label}
                  </span>
                  <span className="text-[10px] text-[#C6B2D2] font-mono block">Lv. {info.lv}</span>
                  <div className="text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 mt-0.5 text-[#FFD76A] drop-shadow-[0_0_8px_rgba(255,85,200,0.4)]">
                    <Star className="w-3.5 h-3.5 fill-[#FFD76A] text-[#FFD76A] animate-star-pulse" />
                    <span>⭐ {stars}/20</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* =========================================================
              PLANET 2: Sudut Pusat & Sudut Keliling (Angularis)
              ========================================================= */}
          {(() => {
            const planet = PLANETS[1];
            const status = getPlanetStatus(planet);
            const info = levelInfoMap[planet.id];
            const stars = getLevelStars(planet.id);
            const isCompleted = status === 'completed';
            const isInProgress = status === 'in_progress';
            const isLocked = status === 'locked';

            return (
              <div
                onClick={() => handlePlanetClick(planet)}
                className={`absolute top-8 right-2 sm:right-10 lg:right-20 flex flex-col items-center cursor-pointer group z-10 transition-transform duration-300 hover:scale-105 ${
                  isLocked ? 'opacity-70 grayscale-[35%]' : ''
                }`}
              >
                <div className="relative">
                  <div className={`absolute -inset-4 rounded-full blur-xl transition-all ${
                    isCompleted ? 'bg-[#57E389]/20' : 'bg-[#8D3CC7]/25 group-hover:bg-[#8D3CC7]/45'
                  }`} />

                  {/* Active Level Pulse Ring */}
                  {status === 'unlocked' && (
                    <div className="absolute -inset-2 rounded-full border-2 border-dashed border-[#FF55C8] animate-spin-slow opacity-90 pointer-events-none" />
                  )}

                  {/* Realistic 3D Planet Sphere */}
                  <svg viewBox="0 0 160 160" className="w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 drop-shadow-[0_10px_25px_rgba(141,60,199,0.4)]">
                    <circle cx="80" cy="80" r="68" fill="url(#planet2Light)" stroke="#8D3CC7" strokeWidth="2" />
                    <path
                      d="M 22 55 Q 80 40 138 55 Q 80 70 22 55 Z"
                      fill="#F5D0FE"
                      fillOpacity="0.25"
                    />
                    <path
                      d="M 20 85 Q 80 75 140 85 Q 80 95 20 85 Z"
                      fill="#C084FC"
                      fillOpacity="0.3"
                    />
                    <circle cx="60" cy="78" r="8" fill="#FF55C8" fillOpacity="0.4" />
                    <circle cx="80" cy="80" r="67" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                  </svg>

                  {/* Checklist Completed Badge */}
                  {isCompleted && (
                    <div 
                      className="absolute -top-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#57E389] text-[#170D24] flex items-center justify-center font-bold shadow-[0_0_15px_rgba(87,227,137,0.8)] border-2 border-[#170D24] z-20"
                      title="Level 2 Selesai!"
                    >
                      <Check className="w-5 h-5 stroke-[3] text-[#170D24]" />
                    </div>
                  )}

                  {/* In Progress Badge */}
                  {isInProgress && (
                    <div 
                      className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#FF55C8] text-[#170D24] text-[9px] font-extrabold shadow-[0_0_12px_rgba(255,85,200,0.6)] border border-[#170D24] flex items-center gap-1 z-20"
                      title="Sedang Dikerjakan"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FFF5FF] animate-ping" />
                      <span>PROSES</span>
                    </div>
                  )}

                  {/* Lock Overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-[#170D24]/75 backdrop-blur-[2px] z-20">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#321442] border-2 border-[#62536D] flex items-center justify-center text-[#62536D] shadow-xl">
                        <Lock className="w-5 h-5 text-[#62536D]" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-center mt-2 bg-[#321442]/90 px-3 py-1.5 rounded-2xl border border-[#FF55C8]/30 backdrop-blur-md max-w-[155px] sm:max-w-[190px] shadow-lg">
                  <span className="font-orbitron font-extrabold text-xs sm:text-sm text-[#FFF5FF] block drop-shadow">
                    {info.label}
                  </span>
                  <span className="text-[10px] text-[#C6B2D2] font-mono block">Lv. {info.lv}</span>
                  <div className="text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 mt-0.5 text-[#FFD76A] drop-shadow-[0_0_8px_rgba(255,85,200,0.4)]">
                    <Star className="w-3.5 h-3.5 fill-[#FFD76A] text-[#FFD76A] animate-star-pulse" />
                    <span>⭐ {stars}/20</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* =========================================================
              PLANET 3: Panjang Busur & Luas Juring (Arcadia)
              ========================================================= */}
          {(() => {
            const planet = PLANETS[2];
            const status = getPlanetStatus(planet);
            const info = levelInfoMap[planet.id];
            const stars = getLevelStars(planet.id);
            const isCompleted = status === 'completed';
            const isInProgress = status === 'in_progress';
            const isLocked = status === 'locked';

            return (
              <div
                onClick={() => handlePlanetClick(planet)}
                className={`absolute bottom-28 left-2 sm:left-12 lg:left-28 flex flex-col items-center cursor-pointer group z-10 transition-transform duration-300 hover:scale-105 ${
                  isLocked ? 'opacity-70 grayscale-[35%]' : ''
                }`}
              >
                <div className="relative">
                  <div className={`absolute -inset-4 rounded-full blur-xl transition-all ${
                    isCompleted ? 'bg-[#57E389]/20' : 'bg-amber-400/25 group-hover:bg-amber-400/40'
                  }`} />

                  {/* Active Level Pulse Ring */}
                  {status === 'unlocked' && (
                    <div className="absolute -inset-2 rounded-full border-2 border-dashed border-[#FF55C8] animate-spin-slow opacity-90 pointer-events-none" />
                  )}

                  {/* Realistic 3D Planet Sphere With Rings */}
                  <svg viewBox="0 0 200 180" className="w-32 h-28 sm:w-40 sm:h-36 lg:w-44 lg:h-40 drop-shadow-[0_10px_25px_rgba(255,215,106,0.35)]">
                    <ellipse
                      cx="100"
                      cy="90"
                      rx="95"
                      ry="32"
                      fill="none"
                      stroke="#FFD76A"
                      strokeWidth="5"
                      transform="rotate(-22 100 90)"
                      opacity="0.8"
                      strokeDasharray="260 200"
                    />
                    <ellipse
                      cx="100"
                      cy="90"
                      rx="85"
                      ry="26"
                      fill="none"
                      stroke="#FF55C8"
                      strokeWidth="3"
                      transform="rotate(-22 100 90)"
                      opacity="0.9"
                    />

                    <circle cx="100" cy="90" r="56" fill="url(#planet3Light)" stroke="#FFD76A" strokeWidth="2" />
                    <path
                      d="M 50 80 Q 100 95 150 80 Q 100 70 50 80 Z"
                      fill="#FEF08A"
                      fillOpacity="0.3"
                    />
                    <circle cx="100" cy="90" r="55" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />

                    <ellipse
                      cx="100"
                      cy="90"
                      rx="95"
                      ry="32"
                      fill="none"
                      stroke="#FFD76A"
                      strokeWidth="5"
                      transform="rotate(-22 100 90)"
                      strokeDasharray="160 300"
                      strokeDashoffset="-220"
                    />
                  </svg>

                  {/* Checklist Completed Badge */}
                  {isCompleted && (
                    <div 
                      className="absolute -top-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#57E389] text-[#170D24] flex items-center justify-center font-bold shadow-[0_0_15px_rgba(87,227,137,0.8)] border-2 border-[#170D24] z-20"
                      title="Level 3 Selesai!"
                    >
                      <Check className="w-5 h-5 stroke-[3] text-[#170D24]" />
                    </div>
                  )}

                  {/* In Progress Badge */}
                  {isInProgress && (
                    <div 
                      className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#FF55C8] text-[#170D24] text-[9px] font-extrabold shadow-[0_0_12px_rgba(255,85,200,0.6)] border border-[#170D24] flex items-center gap-1 z-20"
                      title="Sedang Dikerjakan"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FFF5FF] animate-ping" />
                      <span>PROSES</span>
                    </div>
                  )}

                  {/* Lock Overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-[#170D24]/75 backdrop-blur-[2px] z-20">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#321442] border-2 border-[#62536D] flex items-center justify-center text-[#62536D] shadow-xl">
                        <Lock className="w-5 h-5 text-[#62536D]" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-center mt-1 bg-[#321442]/90 px-3 py-1.5 rounded-2xl border border-[#FF55C8]/30 backdrop-blur-md max-w-[155px] sm:max-w-[190px] shadow-lg">
                  <span className="font-orbitron font-extrabold text-xs sm:text-sm text-[#FFF5FF] block drop-shadow">
                    {info.label}
                  </span>
                  <span className="text-[10px] text-[#C6B2D2] font-mono block">Lv. {info.lv}</span>
                  <div className="text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 mt-0.5 text-[#FFD76A] drop-shadow-[0_0_8px_rgba(255,85,200,0.4)]">
                    <Star className="w-3.5 h-3.5 fill-[#FFD76A] text-[#FFD76A] animate-star-pulse" />
                    <span>⭐ {stars}/20</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* =========================================================
              PLANET 4: Nexus Terpadu: Sintesis Geometri Lingkaran
              ========================================================= */}
          {(() => {
            const planet = PLANETS[3];
            const status = getPlanetStatus(planet);
            const info = levelInfoMap[planet.id];
            const stars = getLevelStars(planet.id);
            const isCompleted = status === 'completed';
            const isInProgress = status === 'in_progress';
            const isLocked = status === 'locked';

            return (
              <div
                onClick={() => handlePlanetClick(planet)}
                className={`absolute bottom-6 right-2 sm:right-12 lg:right-28 flex flex-col items-center cursor-pointer group z-10 transition-transform duration-300 hover:scale-105 ${
                  isLocked ? 'opacity-70 grayscale-[35%]' : ''
                }`}
              >
                <div className="relative">
                  <div className={`absolute -inset-4 rounded-full blur-xl transition-all ${
                    isCompleted ? 'bg-[#57E389]/20' : 'bg-neon-magenta/20 group-hover:bg-neon-magenta/40'
                  }`} />

                  {/* Active Level Pulse Ring */}
                  {status === 'unlocked' && (
                    <div className="absolute -inset-2 rounded-full border-2 border-dashed border-[#FF55C8] animate-spin-slow opacity-90 pointer-events-none" />
                  )}

                  {/* Realistic 3D Cyborg Planet */}
                  <svg viewBox="0 0 160 160" className="w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]">
                    <circle cx="80" cy="80" r="68" fill="url(#planet4Light)" stroke="#62536D" strokeWidth="2" />
                    <path
                      d="M 35 45 L 65 75 L 85 75 L 110 100"
                      fill="none"
                      stroke="#FF55C8"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      opacity="0.85"
                    />
                    <path
                      d="M 50 110 L 80 110 L 105 85"
                      fill="none"
                      stroke="#8D3CC7"
                      strokeWidth="1.5"
                      opacity="0.8"
                    />
                    <circle cx="80" cy="80" r="67" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                  </svg>

                  {/* Checklist Completed Badge */}
                  {isCompleted && (
                    <div 
                      className="absolute -top-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#57E389] text-[#170D24] flex items-center justify-center font-bold shadow-[0_0_15px_rgba(87,227,137,0.8)] border-2 border-[#170D24] z-20"
                      title="Level 4 Selesai!"
                    >
                      <Check className="w-5 h-5 stroke-[3] text-[#170D24]" />
                    </div>
                  )}

                  {/* In Progress Badge */}
                  {isInProgress && (
                    <div 
                      className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#FF55C8] text-[#170D24] text-[9px] font-extrabold shadow-[0_0_12px_rgba(255,85,200,0.6)] border border-[#170D24] flex items-center gap-1 z-20"
                      title="Sedang Dikerjakan"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FFF5FF] animate-ping" />
                      <span>PROSES</span>
                    </div>
                  )}

                  {/* Lock Overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-[#170D24]/75 backdrop-blur-[2px] z-20">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#321442] border-2 border-[#62536D] flex items-center justify-center text-[#62536D] shadow-xl">
                        <Lock className="w-5 h-5 text-[#62536D]" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-center mt-2 bg-[#321442]/90 px-3 py-1.5 rounded-2xl border border-[#FF55C8]/30 backdrop-blur-md max-w-[155px] sm:max-w-[190px] shadow-lg">
                  <span className="font-orbitron font-extrabold text-xs sm:text-sm text-[#FFF5FF] block drop-shadow">
                    {info.label}
                  </span>
                  <span className="text-[10px] text-[#C6B2D2] font-mono block">Lv. {info.lv}</span>
                  <div className="text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 mt-0.5 text-[#FFD76A] drop-shadow-[0_0_8px_rgba(255,85,200,0.4)]">
                    <Star className="w-3.5 h-3.5 fill-[#FFD76A] text-[#FFD76A] animate-star-pulse" />
                    <span>⭐ {stars}/20</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Flying Spaceship On Orbit Path */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-float pointer-events-none">
            <svg viewBox="0 0 100 80" className="w-14 h-14 sm:w-16 sm:h-16 filter drop-shadow-[0_0_15px_rgba(255,85,200,0.9)]">
              <polygon points="50,5 60,35 75,55 90,65 50,58 10,65 25,55 40,35" fill="#321442" stroke="#FF55C8" strokeWidth="2.5" />
              <polygon points="50,12 55,35 65,50 50,46 35,50 45,35" fill="#FF55C8" fillOpacity="0.4" stroke="#FF55C8" strokeWidth="1" />
              <ellipse cx="50" cy="30" rx="4" ry="10" fill="#FFD76A" />
              <polygon points="45,58 50,75 55,58" fill="#57E389" />
            </svg>
          </div>
        </div>
      </div>

      {/* Briefing Modal / Integrated Level Hub */}
      {showBriefingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#170D24]/85 backdrop-blur-xl animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#321442] border-2 border-[#FF55C8]/50 p-6 shadow-2xl hud-corner">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] text-neon-magenta font-mono uppercase tracking-wider block">
                  Level {selectedPlanet.order} • Sektor {selectedPlanet.codeName}
                </span>
                <h3 className="text-xl font-orbitron font-extrabold text-[#FFF5FF]">
                  {selectedPlanet.name.toUpperCase()}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#FFD76A]/15 border border-[#FFD76A]/40 text-[#FFD76A] font-bold flex items-center gap-1 shadow-star-glow">
                  <Star className="w-3.5 h-3.5 fill-[#FFD76A]" />
                  <span>⭐ {getLevelStars(selectedPlanet.id)}/20 Bintang</span>
                </span>
              </div>
            </div>

            {/* Level Topic & Summary */}
            <div className="bg-[#24102F]/80 p-3.5 rounded-2xl border border-white/10 mb-4">
              <span className="text-xs font-bold text-neon-magenta block mb-1">
                Topik: {selectedPlanet.topicTitle}
              </span>
              <p className="text-xs text-[#FFF5FF]/80 leading-relaxed">
                {selectedPlanet.summary}
              </p>
            </div>

            {/* Core Formulas */}
            <div className="space-y-2 mb-4">
              <span className="text-xs font-bold text-[#FFD76A] uppercase font-rajdhani flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" /> Rumus Kunci yang Diuji:
              </span>
              {selectedPlanet.coreFormulas.map((f, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-[#24102F] border border-[#FF55C8]/20 text-xs font-mono text-[#FFF5FF]/90">
                  <span className="text-neon-magenta block font-semibold">{f.title}</span>
                  <span className="text-[#FFD76A]">{f.formula}</span>
                </div>
              ))}
            </div>

            {/* Optional Challenge Timer Mode */}
            <label className="flex items-center gap-3 p-3 rounded-2xl bg-[#24102F]/80 border border-white/10 cursor-pointer mb-5 hover:border-[#FF55C8]/40 transition-colors">
              <input
                type="checkbox"
                checked={challengeMode}
                onChange={(e) => setChallengeMode(e.target.checked)}
                className="w-4 h-4 rounded text-neon-magenta focus:ring-0 cursor-pointer accent-[#FF55C8]"
              />
              <div className="text-xs">
                <span className="font-bold text-[#FFF5FF] block">Mode Tantangan Waktu (120s)</span>
                <span className="text-[10px] text-[#C6B2D2]">Bonus poin XP & Kristal Kosmik untuk respon cepat</span>
              </div>
            </label>

            {/* Two Connected Action Buttons: Pelajari Modul vs Mulai Latihan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <button
                type="button"
                onClick={handleGoToMateri}
                className="py-3 px-4 rounded-2xl bg-[#24102F] hover:bg-[#8D3CC7]/30 border-2 border-[#8D3CC7] text-[#FFF5FF] font-bold text-xs sm:text-sm font-orbitron flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_15px_rgba(141,60,199,0.5)]"
              >
                <BookOpen className="w-4 h-4 text-neon-magenta" />
                <span>Pelajari Modul</span>
              </button>

              <button
                type="button"
                onClick={handleLaunch}
                className="py-3 px-4 rounded-2xl bg-gradient-to-r from-neon-magenta to-[#8D3CC7] hover:opacity-95 text-[#FFF5FF] font-black font-orbitron text-xs sm:text-sm tracking-wider shadow-neon-magenta flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Play className="w-4 h-4 fill-[#FFF5FF]" />
                <span>Mulai Latihan</span>
              </button>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowBriefingModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-[#C6B2D2] hover:text-[#FFF5FF] transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalaxyMapPage;

