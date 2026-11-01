import React from 'react';
import { Orbit, ShieldCheck, Database, Award } from 'lucide-react';
import { isSupabaseConfigured } from '../../services/supabase';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-space-border/40 bg-space-deep/90 text-neon-white/60 py-10 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <Orbit className="w-6 h-6 text-neon-cyan" />
            <span className="font-orbitron font-bold text-lg text-neon-white tracking-wider">
              GALACTIC <span className="text-neon-cyan">CIRCLE</span>
            </span>
          </div>
          <p className="text-sm text-neon-white/70 max-w-md">
            Explore the Galaxy, Master the Circle. Platform game edukasi matematika interaktif geometri lingkaran untuk siswa SMA Kelas XI dengan pengalaman eksplorasi luar angkasa imersif.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-space-surface border border-neon-cyan/20 text-xs text-neon-cyan">
              <ShieldCheck className="w-3.5 h-3.5" /> Row Level Security (RLS)
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-space-surface border border-neon-gold/20 text-xs text-neon-gold">
              <Award className="w-3.5 h-3.5" /> 20 Soal Geometri Tervalidasi
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-space-surface border border-neon-violet/20 text-xs text-neon-violet">
              <Database className="w-3.5 h-3.5" /> {isSupabaseConfigured ? 'Supabase PostgreSQL' : 'Local Persistence'}
            </span>
          </div>
        </div>

        {/* 4 Planets */}
        <div>
          <h4 className="text-xs font-bold text-neon-white uppercase tracking-wider font-orbitron mb-3">
            Peta 4 Planet
          </h4>
          <ul className="space-y-1.5 text-xs text-neon-white/60 font-rajdhani text-sm">
            <li className="hover:text-neon-cyan transition-colors">Planet I: Tangensia (GSPL & GSPD)</li>
            <li className="hover:text-neon-violet transition-colors">Planet II: Angularis (Sudut Pusat & Keliling)</li>
            <li className="hover:text-neon-gold transition-colors">Planet III: Arcadia (Busur & Luas Juring)</li>
            <li className="hover:text-neon-emerald transition-colors">Planet IV: Nexus (Sintesis Multi-Sistem)</li>
          </ul>
        </div>

        {/* Curriculum */}
        <div>
          <h4 className="text-xs font-bold text-neon-white uppercase tracking-wider font-orbitron mb-3">
            Standar Pembelajaran
          </h4>
          <ul className="space-y-1.5 text-xs text-neon-white/60">
            <li>Matematika Wajib / Peminatan SMA Kelas XI</li>
            <li>Visualisasi SVG Vektor Interaktif</li>
            <li>Toleransi Radikal & Desimal Eksak</li>
            <li>Leaderboard Publik Bebas Data Sensitif</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-neon-white/40 gap-4">
        <p>© 2026 GALACTIC CIRCLE. Dirancang untuk Pembelajaran Matematika Tingkat Lanjut.</p>
        <p className="font-rajdhani tracking-wider">
          STATUS SISTEM: <span className="text-neon-emerald font-bold">ONLINE & SECURE</span>
        </p>
      </div>
    </footer>
  );
};
