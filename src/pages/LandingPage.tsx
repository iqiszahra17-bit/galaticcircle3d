import React, { useState } from 'react';
import { UserProfile } from '../types/game';
import { soundEffects } from '../utils/soundEffects';
import { authService } from '../services/authService';
import { 
  Trophy, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Gem, 
  Globe, 
  Smartphone, 
  Brain, 
  Star,
  Edit2,
  X,
  Check,
  Compass,
  Play
} from 'lucide-react';

interface Props {
  currentUser: UserProfile | null;
  onStartExploring: () => void;
  onViewGalaxyMap: () => void;
  onProfileUpdated?: (updated: UserProfile) => void;
  onOpenAuth?: () => void;
}

export const LandingPage: React.FC<Props> = ({
  currentUser,
  onStartExploring,
  onViewGalaxyMap,
  onProfileUpdated,
  onOpenAuth,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(currentUser?.displayName || 'KADET ANTARIKSA');

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playCorrect();
    const updated = await authService.updatePlayerName(tempName);
    if (onProfileUpdated) onProfileUpdated(updated);
    setIsEditingName(false);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* =========================================================
          TOP SHOWCASE HERO (Responsive on Mobile & Laptop)
          ========================================================= */}
      <section className="w-full max-w-7xl mx-auto px-4 pt-4 sm:pt-6 pb-6 border-b border-white/10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center lg:text-left max-w-2xl">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-orbitron text-neon-white leading-tight">
              Jelajahi Galaksi, Kuasi Lingkaran, Raih Mimpimu! ✨
            </h1>
            <p className="text-xs sm:text-sm text-neon-white/70 leading-relaxed">
              Game edukasi matematika berbasis petualangan luar angkasa, khusus untuk mempelajari konsep lingkaran di kelas 11 SMA.
            </p>
            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-space-surface border border-white/10 text-xs text-neon-gold">
                <Star className="w-3.5 h-3.5 text-neon-gold fill-neon-gold" /> Interaktif
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-space-surface border border-white/10 text-xs text-neon-violet">
                <Brain className="w-3.5 h-3.5" /> Edukatif
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-space-surface border border-white/10 text-xs text-neon-cyan">
                <Smartphone className="w-3.5 h-3.5" /> Mobile Friendly
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-space-surface border border-white/10 text-xs text-neon-emerald">
                <ShieldCheck className="w-3.5 h-3.5" /> Modern & Aesthetic
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          MAIN GAME CONSOLE COCKPIT
          Full-width responsive on laptop (2 columns), single column on mobile
          ========================================================= */}
      <section className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="rounded-3xl bg-space-blue/85 border border-space-border/80 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden hud-corner">
          {/* Top In-Game Bar (Avatar with instant name edit, Total Skor, Kristal) */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between pb-6 mb-8 border-b border-white/10 gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <img
                  src={currentUser?.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=CadetNova'}
                  alt="Avatar"
                  className="w-12 h-12 rounded-2xl bg-space-deep border-2 border-neon-cyan p-0.5 shadow-neon-cyan/30"
                />
                <button
                  onClick={() => setIsEditingName(true)}
                  className="absolute -bottom-1 -right-1 p-1 rounded-full bg-neon-cyan text-space-deep shadow-md hover:scale-110 transition-transform"
                  title="Ubah Nama Kadet"
                >
                  <Edit2 className="w-3 h-3 stroke-[3]" />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-orbitron font-extrabold text-neon-white">
                    {currentUser?.displayName || 'KADET ANTARIKSA'}
                  </span>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-[10px] text-neon-cyan/70 hover:text-neon-cyan font-mono underline"
                  >
                    (EDIT)
                  </button>
                </div>
                <span className="text-xs text-neon-white/50 block">Penjelajah Antariksa • Level {currentUser?.level || 1}</span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs sm:text-sm font-mono">
              <div className="p-2.5 px-4 rounded-2xl bg-space-deep/90 border border-white/10 text-right">
                <span className="text-[10px] text-neon-white/40 uppercase block font-rajdhani">Total Skor Tersimpan</span>
                <span className="text-neon-gold font-bold flex items-center gap-1.5 justify-end text-base font-orbitron">
                  <Trophy className="w-4 h-4 text-neon-gold" /> {currentUser?.xp || 0} / 2000
                </span>
              </div>

              <div className="p-2.5 px-4 rounded-2xl bg-space-deep/90 border border-white/10 text-right">
                <span className="text-[10px] text-neon-white/40 uppercase block font-rajdhani">Kristal Kosmik</span>
                <span className="text-neon-cyan font-bold flex items-center gap-1.5 justify-end text-base font-orbitron">
                  <Gem className="w-4 h-4 text-neon-cyan" /> {currentUser?.crystals || 0} / 20
                </span>
              </div>
            </div>
          </div>

          {/* Grid Layout on Laptop: Left = 3D Planet & Story, Right = Quick Station Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Center / Left: 3D Ringed Planet Visual */}
            <div className="lg:col-span-7 flex flex-col items-center text-center">
              <div className="relative w-56 h-56 sm:w-72 sm:h-72 my-2 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-neon-cyan/15 blur-3xl animate-pulse-slow" />
                
                {/* 3D Planetary Ring Vector */}
                <svg viewBox="0 0 260 260" className="w-full h-full select-none">
                  {/* Back Ring Segment */}
                  <ellipse
                    cx="130"
                    cy="130"
                    rx="120"
                    ry="42"
                    fill="none"
                    stroke="#00E5FF"
                    strokeWidth="6"
                    transform="rotate(-28 130 130)"
                    opacity="0.8"
                    strokeDasharray="320 230"
                  />
                  <ellipse
                    cx="130"
                    cy="130"
                    rx="108"
                    ry="35"
                    fill="none"
                    stroke="#FFD34E"
                    strokeWidth="3"
                    transform="rotate(-28 130 130)"
                    opacity="0.9"
                  />

                  {/* Planet Sphere */}
                  <defs>
                    <radialGradient id="homePlanetGradFull" cx="35%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#38BDF8" />
                      <stop offset="25%" stopColor="#0284C7" />
                      <stop offset="60%" stopColor="#0F172A" />
                      <stop offset="90%" stopColor="#020617" />
                      <stop offset="100%" stopColor="#00E5FF" />
                    </radialGradient>
                  </defs>
                  <circle
                    cx="130"
                    cy="130"
                    r="72"
                    fill="url(#homePlanetGradFull)"
                    stroke="rgba(0, 229, 255, 0.6)"
                    strokeWidth="2"
                  />

                  {/* Front Ring Segment */}
                  <ellipse
                    cx="130"
                    cy="130"
                    rx="120"
                    ry="42"
                    fill="none"
                    stroke="#00E5FF"
                    strokeWidth="6"
                    transform="rotate(-28 130 130)"
                    strokeDasharray="210 350"
                    strokeDashoffset="-275"
                  />
                </svg>
              </div>

              {/* Logo & Subtitle */}
              <div className="relative z-10 -mt-6 mb-3">
                <h2 className="text-3xl sm:text-5xl font-black font-orbitron text-neon-white tracking-wider drop-shadow-xl">
                  GALACTIC <span className="text-neon-cyan">CIRCLE</span>
                </h2>
                <span className="text-xs sm:text-sm font-extrabold text-neon-gold uppercase font-rajdhani tracking-widest block mt-1">
                  PETUALANGAN LINGKARAN 3D
                </span>
              </div>

              {/* Lore Text */}
              <p className="text-xs sm:text-sm text-neon-white/70 max-w-md mb-6 leading-relaxed">
                Energi Galaksi Lingkaran terpecah di empat planet misterius. Kemudikan pesawatmu, jelajahi orbit kosmik, selesaikan 20 tantangan geometri lingkaran SMA, dan jadilah{' '}
                <span className="text-neon-gold font-semibold">Master Lingkaran Galaksi!</span>
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md mb-6">
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    onStartExploring();
                  }}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-neon-cyan to-blue-500 hover:from-cyan-400 hover:to-blue-600 text-space-deep font-extrabold font-orbitron text-xs sm:text-sm tracking-wider shadow-neon-cyan flex items-center justify-center gap-2 transition-all group"
                >
                  <span>MULAI PETUALANGAN</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => {
                    soundEffects.playClick();
                    onViewGalaxyMap();
                  }}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-space-deep/90 border border-neon-cyan/50 hover:border-neon-cyan text-neon-cyan text-xs sm:text-sm font-bold font-orbitron tracking-wider flex items-center justify-center gap-2 transition-all hover:bg-neon-cyan/10"
                >
                  <Globe className="w-4 h-4" />
                  <span>PETA GALAKSI 3D</span>
                </button>
              </div>

              {/* Fighter Spaceship Visual */}
              <div className="w-28 h-20 animate-float">
                <svg viewBox="0 0 100 80" className="w-full h-full text-neon-cyan filter drop-shadow-[0_0_12px_rgba(0,229,255,0.7)]">
                  <polygon points="50,5 60,35 75,55 90,65 50,58 10,65 25,55 40,35" fill="#0D2447" stroke="#00E5FF" strokeWidth="2.5" />
                  <polygon points="50,12 55,35 65,50 50,46 35,50 45,35" fill="#00E5FF" fillOpacity="0.4" stroke="#00E5FF" strokeWidth="1" />
                  <ellipse cx="50" cy="30" rx="4" ry="10" fill="#FFD34E" />
                  <polygon points="45,58 50,75 55,58" fill="#00FF9D" />
                </svg>
              </div>
            </div>

            {/* Right on Laptop (Expanded Mission Status Deck) */}
            <div className="lg:col-span-5 rounded-3xl bg-space-deep/80 border border-white/10 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-orbitron font-bold text-sm text-neon-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-neon-cyan" />
                  <span>Status 4 Planet Ekspedisi</span>
                </h3>
                <span className="text-[11px] text-neon-gold font-mono font-bold">20 Soal</span>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Planet I: Tangensia', topic: 'GSPL & GSPD Lingkaran', lv: 1, color: '#00E5FF' },
                  { name: 'Planet II: Angularis', topic: 'Sudut Pusat, Keliling & Siklik', lv: 2, color: '#7861FF' },
                  { name: 'Planet III: Arcadia', topic: 'Panjang Busur & Luas Juring', lv: 3, color: '#FFD34E' },
                  { name: 'Planet IV: Nexus', topic: 'Sintesis Terpadu Multi-Sistem', lv: 4, color: '#00FF9D' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      soundEffects.playClick();
                      onViewGalaxyMap();
                    }}
                    className="p-3.5 rounded-2xl bg-space-surface/90 border border-white/5 hover:border-neon-cyan/40 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-neon-white block">{item.name}</span>
                      <span className="text-[11px] text-neon-white/60 font-rajdhani">{item.topic}</span>
                    </div>
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold"
                      style={{ color: item.color, backgroundColor: `${item.color}20` }}
                    >
                      Lv. {item.lv}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-neon-cyan space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-neon-gold" /> Otomatis Tersimpan Tanpa Login
                </span>
                <p className="text-[11px] text-neon-white/70">
                  Seluruh skor, XP, kristal, dan lencana tersimpan di browser Anda. Anda bisa langsung menjelajah kapan saja!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Name Edit Modal (No Email Needed!) */}
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
                  placeholder="Ketik nama Anda (contoh: Bima)"
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
