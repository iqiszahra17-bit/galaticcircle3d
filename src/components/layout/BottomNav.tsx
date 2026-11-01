import React from 'react';
import { Home, Compass, BookOpen, Gamepad2, User } from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';

interface Props {
  activePage: string;
  onNavigate: (page: string) => void;
}

export const BottomNav: React.FC<Props> = ({ activePage, onNavigate }) => {
  const tabs = [
    { id: 'landing', label: 'Beranda', icon: Home },
    { id: 'map', label: 'Peta', icon: Compass },
    { id: 'materi', label: 'Materi', icon: BookOpen },
    { id: 'mission', label: 'Permainan', icon: Gamepad2 },
    { id: 'dashboard', label: 'Profil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-space-deep/95 border-t border-space-border/60 backdrop-blur-2xl py-2 px-3 flex items-center justify-around sm:hidden shadow-2xl">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activePage === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => {
              soundEffects.playClick();
              onNavigate(tab.id);
            }}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              isActive
                ? 'text-neon-cyan font-bold scale-105'
                : 'text-neon-white/50 hover:text-neon-white/80'
            }`}
          >
            <div className={`p-1 rounded-lg ${isActive ? 'bg-neon-cyan/20 border border-neon-cyan/40 shadow-neon-cyan/20' : ''}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-1 font-rajdhani tracking-wider">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
