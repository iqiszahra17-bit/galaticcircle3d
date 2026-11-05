import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { UserProfile } from '../../types/game';
import { soundEffects } from '../../utils/soundEffects';
import { X, User, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  currentUser?: UserProfile | null;
}

const AVATAR_SEEDS = [
  'CadetNova', 'CosmoZen', 'StarlightAria', 'OrbitVance', 'AstroKira',
  'GalacticRex', 'NebulaSage', 'CyberPulse', 'SolarisRey', 'LunaZephyr'
];

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, currentUser }) => {
  const [displayName, setDisplayName] = useState(currentUser?.displayName || 'KADET ANTARIKSA');
  const [avatarSeed, setAvatarSeed] = useState('CadetNova');
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName);
      const seedMatch = currentUser.avatarUrl.match(/seed=([^&]+)/);
      if (seedMatch) {
        setAvatarSeed(decodeURIComponent(seedMatch[1]));
      }
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const currentAvatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(avatarSeed)}`;

  const handleRandomAvatar = () => {
    soundEffects.playClick();
    const nextSeed = AVATAR_SEEDS[Math.floor(Math.random() * AVATAR_SEEDS.length)] + Math.floor(Math.random() * 99);
    setAvatarSeed(nextSeed);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = displayName.trim() || 'KADET ANTARIKSA';
    setLoading(true);

    try {
      soundEffects.playCorrect();
      const current = await authService.getCurrentProfile();
      const cleanUsername = trimmed.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'kadet';
      
      const updated: UserProfile = {
        ...current,
        displayName: trimmed,
        username: cleanUsername,
        avatarUrl: currentAvatarUrl,
        updatedAt: new Date().toISOString(),
      };

      const saved = await authService.updateProfile(updated);
      setSavedSuccess(true);
      onSuccess(saved);
      setTimeout(() => {
        onClose();
        setSavedSuccess(false);
        setLoading(false);
      }, 400);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-deep/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-space-surface/95 border border-space-border p-6 sm:p-8 shadow-2xl overflow-hidden hud-corner">
        {/* Glow ambient background */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-neon-cyan/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-neon-violet/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            soundEffects.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl text-neon-white/60 hover:text-neon-white hover:bg-space-deep/60 transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-space-deep border border-neon-cyan/40 text-xs font-semibold text-neon-cyan mb-2 shadow-neon-cyan/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>IDENTITAS KADET GALAKSI</span>
          </div>
          <h3 className="font-orbitron font-extrabold text-xl text-neon-white">
            NAMA PANGGILAN KADET
          </h3>
          <p className="text-xs text-neon-white/60 max-w-xs mx-auto mt-1">
            Tentukan nama panggilan Anda untuk dicatat di Papan Peringkat Galaksi lintas perangkat.
          </p>
        </div>

        {/* Avatar Showcase & Randomizer */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="relative mb-2">
            <img
              src={currentAvatarUrl}
              alt="Avatar Kadet"
              className="w-20 h-20 rounded-2xl bg-space-deep border-2 border-neon-cyan p-1 shadow-neon-cyan/30"
            />
            <button
              type="button"
              onClick={handleRandomAvatar}
              className="absolute -bottom-2 -right-2 p-2 rounded-full bg-gradient-to-r from-neon-cyan to-blue-500 text-space-deep shadow-lg hover:scale-110 active:scale-95 transition-all"
              title="Acak Avatar Kosmik"
            >
              <RefreshCw className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
          <span className="text-[11px] text-neon-white/50 font-rajdhani">
            Klik ikon acak untuk ganti wujud robot
          </span>
        </div>

        {/* Name Input Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neon-white/80 mb-1.5">
              Nama Panggilan (Nickname):
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-neon-cyan" />
              <input
                type="text"
                required
                maxLength={24}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Contoh: Kadet Budi, Siti, Arka..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-space-deep border border-white/10 focus:border-neon-cyan focus:outline-none text-sm text-neon-white font-medium placeholder:text-neon-white/30"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-space-deep/60 border border-white/5 text-[11px] text-neon-white/60 flex items-center gap-2 font-mono">
            <span className="text-neon-cyan font-bold">INFO:</span>
            <span>Skor Anda otomatis tersimpan ke cloud dan tampil di Papan Peringkat Global.</span>
          </div>

          <button
            type="submit"
            disabled={loading || savedSuccess}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-violet hover:opacity-90 font-orbitron font-bold text-space-deep text-xs tracking-wider shadow-neon-cyan transition-all flex items-center justify-center gap-2"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-space-deep" /> Identitas Disimpan!
              </>
            ) : loading ? (
              <span className="animate-pulse">Menyimpan...</span>
            ) : (
              'SIMPAN & LANJUTKAN BERMAIN'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
