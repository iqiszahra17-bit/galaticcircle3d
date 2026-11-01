import React, { useState } from 'react';
import { UserProfile } from '../../types/game';
import { soundEffects } from '../../utils/soundEffects';
import { isSupabaseConfigured } from '../../services/supabase';
import { 
  Orbit, 
  Trophy, 
  Compass, 
  BookOpen, 
  Gamepad2, 
  User, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  LogOut, 
  Menu, 
  X, 
  Gem, 
  Sparkles,
  Cloud,
  HardDrive,
  Home,
  Zap
} from 'lucide-react';

interface Props {
  activePage: string;
  onNavigate: (page: string) => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<Props> = ({
  activePage,
  onNavigate,
  currentUser,
  onOpenAuth,
  onSignOut,
}) => {
  const [isMuted, setIsMuted] = useState(soundEffects.getMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const toggleSound = () => {
    const next = !isMuted;
    soundEffects.setMuted(next);
    setIsMuted(next);
    if (!next) soundEffects.playClick();
  };

  const handleNav = (page: string) => {
    soundEffects.playClick();
    onNavigate(page);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-space-border/50 bg-space-deep/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={() => handleNav('landing')}
          className="flex items-center gap-3 text-left focus:outline-none group"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-space-surface border border-neon-cyan/40 group-hover:border-neon-cyan transition-all duration-300 shadow-neon-cyan/20 group-hover:shadow-neon-cyan">
            <Orbit className="w-5 h-5 sm:w-6 sm:h-6 text-neon-cyan animate-spin-slow" />
            <div className="absolute inset-0 rounded-full border border-neon-gold/30 animate-pulse-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-orbitron font-extrabold text-sm sm:text-lg tracking-wider text-neon-white group-hover:text-neon-cyan transition-colors">
                GALACTIC <span className="text-neon-cyan">CIRCLE</span>
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-neon-gold tracking-widest uppercase font-rajdhani font-bold hidden sm:block">
              Petualangan Lingkaran 3D
            </p>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => handleNav('landing')}
            className={`px-3 py-1.5 rounded-xl text-xs lg:text-sm font-semibold transition-all ${
              activePage === 'landing'
                ? 'bg-space-surface text-neon-cyan border border-neon-cyan/40 shadow-sm'
                : 'text-neon-white/70 hover:text-neon-white hover:bg-space-surface/50'
            }`}
          >
            Beranda
          </button>

          <button
            onClick={() => handleNav('map')}
            className={`px-3 py-1.5 rounded-xl text-xs lg:text-sm font-semibold flex items-center gap-1.5 transition-all ${
              activePage === 'map'
                ? 'bg-space-surface text-neon-cyan border border-neon-cyan/40 shadow-sm'
                : 'text-neon-white/70 hover:text-neon-white hover:bg-space-surface/50'
            }`}
          >
            <Compass className="w-4 h-4 text-neon-cyan" />
            Peta Galaksi
          </button>

          <button
            onClick={() => handleNav('materi')}
            className={`px-3 py-1.5 rounded-xl text-xs lg:text-sm font-semibold flex items-center gap-1.5 transition-all ${
              activePage === 'materi'
                ? 'bg-space-surface text-neon-cyan border border-neon-cyan/40 shadow-sm'
                : 'text-neon-white/70 hover:text-neon-white hover:bg-space-surface/50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-neon-cyan" />
            Materi
          </button>

          <button
            onClick={() => handleNav('mission')}
            className={`px-3 py-1.5 rounded-xl text-xs lg:text-sm font-semibold flex items-center gap-1.5 transition-all ${
              activePage === 'mission'
                ? 'bg-space-surface text-neon-cyan border border-neon-cyan/40 shadow-sm'
                : 'text-neon-white/70 hover:text-neon-white hover:bg-space-surface/50'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-neon-cyan" />
            Permainan
          </button>

          <button
            onClick={() => handleNav('dashboard')}
            className={`px-3 py-1.5 rounded-xl text-xs lg:text-sm font-semibold flex items-center gap-1.5 transition-all ${
              activePage === 'dashboard'
                ? 'bg-space-surface text-neon-cyan border border-neon-cyan/40 shadow-sm'
                : 'text-neon-white/70 hover:text-neon-white hover:bg-space-surface/50'
            }`}
          >
            <User className="w-4 h-4 text-neon-cyan" />
            Profil
          </button>

          {currentUser?.isAdmin && (
            <button
              onClick={() => handleNav('admin')}
              className={`px-3 py-1.5 rounded-xl text-xs lg:text-sm font-semibold flex items-center gap-1.5 transition-all ${
                activePage === 'admin'
                  ? 'bg-red-950/40 text-red-400 border border-red-500/40 shadow-sm'
                  : 'text-red-400/80 hover:text-red-300 hover:bg-red-950/20'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-red-400" />
              Admin
            </button>
          )}
        </nav>

        {/* Right Section: Sound, Status, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cloud / Local Mode indicator tag */}
          <div
            title={
              isSupabaseConfigured
                ? 'Terhubung dengan Supabase Cloud PostgreSQL'
                : 'Mode Simulasi Lokal (Tambahkan .env untuk Cloud DB)'
            }
            className="hidden xl:flex items-center gap-1 px-2.5 py-1 rounded-full bg-space-surface/60 border border-white/10 text-[11px] text-neon-white/60"
          >
            {isSupabaseConfigured ? (
              <>
                <Cloud className="w-3.5 h-3.5 text-neon-emerald" />
                <span className="text-neon-emerald">Supabase Cloud</span>
              </>
            ) : (
              <>
                <HardDrive className="w-3.5 h-3.5 text-neon-cyan" />
                <span className="text-neon-cyan">Simulasi Lokal</span>
              </>
            )}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Nyalakan Efek Suara' : 'Matikan Efek Suara'}
            className="p-2 rounded-xl bg-space-surface/70 border border-white/10 text-neon-white/70 hover:text-neon-cyan hover:border-neon-cyan/40 transition-colors focus:outline-none"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-neon-cyan" />}
          </button>

          {/* User Profile Pill or Login Button */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-space-surface/80 border border-space-border hover:border-neon-cyan transition-all"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.displayName}
                  className="w-7 h-7 rounded-full bg-space-deep border border-neon-cyan/50"
                />
                <span className="text-xs font-semibold text-neon-white hidden sm:block max-w-[100px] truncate">
                  {currentUser.displayName}
                </span>
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-space-blue/95 border border-space-border shadow-2xl backdrop-blur-xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-white/10">
                    <p className="text-xs font-bold text-neon-white truncate">{currentUser.displayName}</p>
                    <p className="text-[11px] text-neon-cyan font-rajdhani">Level {currentUser.level} Kadet</p>
                  </div>
                  <div className="py-1 text-xs">
                    <button
                      onClick={() => handleNav('dashboard')}
                      className="w-full text-left px-3 py-2 text-neon-white hover:bg-space-surface rounded-lg flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-neon-cyan" />
                      Profil Kadet
                    </button>
                    <button
                      onClick={() => {
                        soundEffects.playClick();
                        setProfileDropdownOpen(false);
                        onOpenAuth();
                      }}
                      className="w-full text-left px-3 py-2 text-neon-cyan hover:bg-space-surface rounded-lg flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-neon-cyan" />
                      Ganti Nama / Avatar
                    </button>
                    {currentUser.isAdmin && (
                      <button
                        onClick={() => handleNav('admin')}
                        className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-950/30 rounded-lg flex items-center gap-2"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Admin Command Center
                      </button>
                    )}
                    <button
                      onClick={() => {
                        soundEffects.playClick();
                        onSignOut();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-rose-400 hover:bg-rose-950/30 rounded-lg flex items-center gap-2 mt-1 border-t border-white/5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Reset Profil Lokal
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                soundEffects.playClick();
                onOpenAuth();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-neon-cyan to-blue-500 text-space-deep text-xs font-bold font-orbitron tracking-wide shadow-neon-cyan hover:opacity-90 transition-all flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              Identitas Kadet
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-space-surface border border-white/10 text-neon-white hover:text-neon-cyan"
            aria-label="Buka Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* =========================================================
          MOBILE SLIDE-OVER DRAWER (Exact Match with Screen 6)
          ========================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-space-deep/80 backdrop-blur-xl animate-fadeIn">
          <div className="w-full max-w-xs h-full bg-space-surface border-l border-space-border/80 p-6 flex flex-col justify-between shadow-2xl relative overflow-y-auto">
            <div>
              {/* Drawer Header: Logo + Close X */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Orbit className="w-6 h-6 text-neon-cyan" />
                  <div>
                    <span className="font-orbitron font-extrabold text-sm text-neon-white block">
                      GALACTIC <span className="text-neon-cyan">CIRCLE</span>
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-xl bg-space-deep text-neon-white/70 hover:text-neon-white border border-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Menu Items (Screen 6 Exact List) */}
              <div className="space-y-2">
                <button
                  onClick={() => handleNav('landing')}
                  className={`w-full p-3 rounded-2xl flex items-center gap-3 text-xs font-bold font-orbitron transition-all ${
                    activePage === 'landing'
                      ? 'bg-gradient-to-r from-neon-cyan/20 to-blue-500/20 border border-neon-cyan text-neon-white shadow-neon-cyan/20 shadow-md'
                      : 'bg-space-deep/60 text-neon-white/70 hover:text-neon-white border border-transparent'
                  }`}
                >
                  <Home className="w-4 h-4 text-neon-cyan" />
                  <span>Beranda</span>
                </button>

                <button
                  onClick={() => handleNav('map')}
                  className={`w-full p-3 rounded-2xl flex items-center gap-3 text-xs font-bold font-orbitron transition-all ${
                    activePage === 'map'
                      ? 'bg-gradient-to-r from-neon-cyan/20 to-blue-500/20 border border-neon-cyan text-neon-white shadow-neon-cyan/20 shadow-md'
                      : 'bg-space-deep/60 text-neon-white/70 hover:text-neon-white border border-transparent'
                  }`}
                >
                  <Compass className="w-4 h-4 text-neon-cyan" />
                  <span>Peta Galaksi</span>
                </button>

                <button
                  onClick={() => handleNav('materi')}
                  className={`w-full p-3 rounded-2xl flex items-center gap-3 text-xs font-bold font-orbitron transition-all ${
                    activePage === 'materi'
                      ? 'bg-gradient-to-r from-neon-cyan/20 to-blue-500/20 border border-neon-cyan text-neon-white shadow-neon-cyan/20 shadow-md'
                      : 'bg-space-deep/60 text-neon-white/70 hover:text-neon-white border border-transparent'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-neon-cyan" />
                  <span>Materi</span>
                </button>

                <button
                  onClick={() => handleNav('mission')}
                  className={`w-full p-3 rounded-2xl flex items-center gap-3 text-xs font-bold font-orbitron transition-all ${
                    activePage === 'mission'
                      ? 'bg-gradient-to-r from-neon-cyan/20 to-blue-500/20 border border-neon-cyan text-neon-white shadow-neon-cyan/20 shadow-md'
                      : 'bg-space-deep/60 text-neon-white/70 hover:text-neon-white border border-transparent'
                  }`}
                >
                  <Gamepad2 className="w-4 h-4 text-neon-cyan" />
                  <span>Permainan</span>
                </button>

                <button
                  onClick={() => handleNav('dashboard')}
                  className={`w-full p-3 rounded-2xl flex items-center gap-3 text-xs font-bold font-orbitron transition-all ${
                    activePage === 'dashboard'
                      ? 'bg-gradient-to-r from-neon-cyan/20 to-blue-500/20 border border-neon-cyan text-neon-white shadow-neon-cyan/20 shadow-md'
                      : 'bg-space-deep/60 text-neon-white/70 hover:text-neon-white border border-transparent'
                  }`}
                >
                  <User className="w-4 h-4 text-neon-cyan" />
                  <span>Profil</span>
                </button>

                {currentUser?.isAdmin && (
                  <button
                    onClick={() => handleNav('admin')}
                    className="w-full p-3 rounded-2xl flex items-center gap-3 text-xs font-bold font-orbitron bg-red-950/40 text-red-400 border border-red-500/30"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Quote Card (Exact Screen 6 Match) */}
            <div className="mt-8 pt-4 border-t border-white/10 space-y-4">
              <div className="p-3.5 rounded-2xl bg-space-deep border border-neon-cyan/20 text-center">
                <p className="text-[11px] text-neon-white/80 italic leading-relaxed font-rajdhani">
                  "Lingkaran itu bukan hanya dalam matematika, tapi juga di setiap perjalanan menuju mimpi."
                </p>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-neon-cyan/70 font-mono">
                <Zap className="w-3 h-3 text-neon-cyan" />
                <span>Powered by Galactic 3D Engine</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
