import React, { useState } from 'react';
import { UserProfile, GameProgress } from '../types/game';
import { soundEffects } from '../utils/soundEffects';
import { authService } from '../services/authService';
import { PLANETS } from '../data/planets';
import { 
  ArrowLeft, 
  Trophy, 
  Gem, 
  Star, 
  ChevronRight, 
  Award, 
  Lock, 
  CheckCircle2, 
  Compass, 
  Edit2,
  X,
  Check,
  Play,
  RotateCw
} from 'lucide-react';

interface Props {
  currentUser: UserProfile;
  userProgress: Record<string, GameProgress>;
  onBack: () => void;
  onContinueGame: (planetId: string) => void;
  onProfileUpdated?: (updated: UserProfile) => void;
}

export const DashboardPage: React.FC<Props> = ({
  currentUser,
  userProgress,
  onBack,
  onContinueGame,
  onProfileUpdated,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(currentUser.displayName);

  const completedMissionsCount = Object.values(userProgress).filter((p) => p.status === 'completed').length;
  const questionsDone = Object.values(userProgress).reduce((acc, p) => acc + (p.questionsCompleted || 0), 0);

  // Exact achievements from Screen 5
  const achievements = [
    {
      code: 'pemula',
      title: 'Pemula',
      desc: 'Selesaikan Lv. 1 (Tangensia)',
      isUnlocked: questionsDone >= 1 || completedMissionsCount >= 1,
      color: 'border-amber-600/50 text-amber-400 bg-amber-950/30',
    },
    {
      code: 'ahli_sudut',
      title: 'Ahli Sudut',
      desc: 'Selesaikan Lv. 2 (Angularis)',
      isUnlocked: questionsDone >= 5 || completedMissionsCount >= 2,
      color: 'border-neon-cyan/50 text-neon-cyan bg-cyan-950/30',
    },
    {
      code: 'penakluk_juring',
      title: 'Penakluk Juring',
      desc: 'Selesaikan Lv. 3 (Arcadia)',
      isUnlocked: questionsDone >= 10 || completedMissionsCount >= 3,
      color: 'border-neon-gold/50 text-neon-gold bg-amber-950/30',
    },
    {
      code: 'master_lingkaran',
      title: 'Master Lingkaran',
      desc: 'Selesaikan semua level planet',
      isUnlocked: completedMissionsCount >= 4,
      color: 'border-white/10 text-neon-white/40 bg-space-deep/40',
    },
  ];

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playCorrect();
    const updated = await authService.updatePlayerName(tempName);
    if (onProfileUpdated) onProfileUpdated(updated);
    setIsEditingName(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4 sm:py-8 flex flex-col items-center">
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between pb-3 mb-6 border-b border-white/10">
        <button
          onClick={() => {
            soundEffects.playClick();
            onBack();
          }}
          className="p-2.5 rounded-2xl bg-space-surface hover:bg-space-deep border border-white/10 text-neon-white/80 hover:text-neon-cyan transition-colors"
          aria-label="Kembali"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-base sm:text-2xl font-orbitron font-extrabold text-neon-white tracking-widest uppercase">
          PROFIL & PRESTASI KADET
        </h1>

        <button
          onClick={() => setIsEditingName(true)}
          className="p-2.5 rounded-2xl bg-space-surface hover:bg-space-deep border border-white/10 text-neon-white/80 hover:text-neon-cyan transition-colors flex items-center gap-1.5 text-xs font-semibold"
          title="Ubah Nama"
        >
          <Edit2 className="w-4 h-4 text-neon-cyan" />
          <span className="hidden sm:inline">Ubah Nama</span>
        </button>
      </div>

      {/* Main Profile Deck (Expansive on Laptop / Stacked on Mobile) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Cadet Identity & Big Stats */}
        <div className="lg:col-span-6 rounded-3xl bg-space-blue/85 border border-space-border/80 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl hud-corner space-y-6">
          {/* Identity Card */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-space-deep border-2 border-neon-cyan p-0.5 shadow-neon-cyan/40 shadow-xl overflow-hidden flex items-center justify-center">
                <img
                  src={currentUser.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=CadetNova'}
                  alt={currentUser.displayName}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => setIsEditingName(true)}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-neon-cyan text-space-deep flex items-center justify-center font-bold text-xs shadow-md"
              >
                ✎
              </button>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-orbitron font-extrabold text-base sm:text-xl text-neon-white">
                  {currentUser.displayName.toUpperCase()}
                </h2>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-xs text-neon-cyan hover:underline font-mono"
                >
                  (EDIT)
                </button>
              </div>
              <span className="text-xs text-neon-white/60 font-rajdhani block">
                Penjelajah Antariksa • Tanpa Login Email
              </span>

              <div className="flex items-center justify-between text-xs font-mono mt-3 mb-1">
                <span className="font-bold text-neon-cyan">Lv. {currentUser.level || 1}</span>
                <span className="text-neon-white/50">{currentUser.xp % 300 || 0} / 300 XP</span>
              </div>

              <div className="w-full h-2 rounded-full bg-space-deep overflow-hidden border border-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, (((currentUser.xp % 300) || 120) / 300) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* 3 Stat Badges Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-space-deep/90 border border-white/10 flex flex-col items-center text-center">
              <Trophy className="w-6 h-6 text-neon-gold mb-1" />
              <span className="text-[10px] text-neon-white/50 uppercase font-rajdhani font-semibold">Skor Tersimpan</span>
              <span className="text-lg sm:text-2xl font-black font-orbitron text-neon-white mt-0.5">
                {currentUser.xp || 0}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-space-deep/90 border border-white/10 flex flex-col items-center text-center">
              <Gem className="w-6 h-6 text-neon-cyan mb-1" />
              <span className="text-[10px] text-neon-white/50 uppercase font-rajdhani font-semibold">Kristal</span>
              <span className="text-lg sm:text-2xl font-black font-orbitron text-neon-cyan mt-0.5">
                {currentUser.crystals || 0}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-space-deep/90 border border-white/10 flex flex-col items-center text-center">
              <Star className="w-6 h-6 text-neon-gold fill-neon-gold mb-1" />
              <span className="text-[10px] text-neon-white/50 uppercase font-rajdhani font-semibold">Misi Selesai</span>
              <span className="text-lg sm:text-2xl font-black font-orbitron text-neon-white mt-0.5">
                {questionsDone} / 20
              </span>
            </div>
          </div>

          {/* Quick Info Banner */}
          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-neon-cyan flex items-center justify-between">
            <span>Poin dan lencana tersimpan permanen di perangkat Anda.</span>
            <span className="font-bold font-mono">100% Offline Safe</span>
          </div>
        </div>

        {/* Right Column: Achievements & Planet Progression */}
        <div className="lg:col-span-6 rounded-3xl bg-space-blue/85 border border-space-border/80 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl hud-corner space-y-6">
          {/* Pencapaian > (Achievements List from Screen 5) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-orbitron font-bold text-sm sm:text-base text-neon-white flex items-center gap-2">
                <Award className="w-5 h-5 text-neon-gold" />
                <span>Pencapaian Kadet</span>
                <ChevronRight className="w-4 h-4 text-neon-cyan" />
              </h3>
              <span className="text-xs text-neon-gold font-mono font-bold">
                {achievements.filter((a) => a.isUnlocked).length} / 4 Terbuka
              </span>
            </div>

            <div className="space-y-3">
              {achievements.map((ach) => (
                <div
                  key={ach.code}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                    ach.isUnlocked
                      ? 'bg-space-deep/90 border-white/15 shadow-sm'
                      : 'bg-space-deep/40 border-white/5 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center font-bold ${ach.color}`}>
                      {ach.isUnlocked ? <Award className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                    </div>
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-neon-white block font-orbitron">
                        {ach.title}
                      </span>
                      <span className="text-xs text-neon-white/50 block font-rajdhani">
                        {ach.desc}
                      </span>
                    </div>
                  </div>

                  <div>
                    {ach.isUnlocked ? (
                      <span className="text-xs font-bold text-neon-emerald flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-4 h-4" /> Terbuka
                      </span>
                    ) : (
                      <span className="text-xs text-neon-white/40 italic">Terkunci</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Name Edit Modal */}
      {isEditingName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-deep/80 backdrop-blur-xl animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-3xl bg-space-surface border border-neon-cyan/50 p-6 shadow-2xl hud-corner">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <h3 className="font-orbitron font-bold text-sm text-neon-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-neon-cyan" />
                <span>Ubah Nama Kadet</span>
              </h3>
              <button
                onClick={() => setIsEditingName(false)}
                className="p-1 rounded-lg text-neon-white/60 hover:text-neon-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveName} className="space-y-4">
              <div>
                <label className="block text-xs text-neon-white/70 mb-1.5 font-semibold">
                  Nama Tampilan Kadet:
                </label>
                <input
                  type="text"
                  required
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Ketik nama Anda (contoh: Kadet Bima)"
                  className="w-full px-4 py-2.5 rounded-xl bg-space-deep border border-white/10 focus:border-neon-cyan focus:outline-none text-sm text-neon-white font-orbitron"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  className="flex-1 py-2.5 rounded-xl bg-space-deep border border-white/10 text-xs text-neon-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-neon-cyan text-space-deep font-bold text-xs font-orbitron shadow-neon-cyan flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
