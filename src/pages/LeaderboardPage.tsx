import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../types/game';
import { gameService } from '../services/gameService';
import { soundEffects } from '../utils/soundEffects';
import { 
  Trophy, 
  Search, 
  Sparkles, 
  Gem, 
  Crown, 
  Medal, 
  Compass, 
  Filter,
  Users,
  RefreshCw
} from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'xp' | 'accuracy' | 'missions'>('score');

  const fetchLeaderboard = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await gameService.getLeaderboard();
      setEntries(data);
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Gagal memuat papan peringkat.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Filtered & Sorted Entries
  const filtered = entries
    .filter((e) => e.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'score') {
        if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
        return b.accuracy - a.accuracy;
      }
      if (sortBy === 'xp') return b.totalXp - a.totalXp;
      if (sortBy === 'accuracy') return b.accuracy - a.accuracy;
      if (sortBy === 'missions') return b.missionsCompleted - a.missionsCompleted;
      return 0;
    });

  // Top 3 Podium
  const top1 = filtered[0];
  const top2 = filtered[1];
  const top3 = filtered[2];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-space-surface border border-neon-gold/40 text-xs font-semibold text-neon-gold mb-2">
          <Trophy className="w-3.5 h-3.5" />
          <span>HALL OF FAME KOSMIK</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-orbitron text-neon-white tracking-wider">
          PAPAN PERINGKAT GALAKSI
        </h1>
        <p className="text-xs sm:text-sm text-neon-white/60 max-w-md mx-auto mt-1">
          Daftar peringkat publik kadet terbaik berdasarkan total skor, akurasi, dan perolehan XP geometri lingkaran.
        </p>
      </div>

      {/* Controls Bar: Search & Sort Filter */}
      <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-3 mb-8">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neon-white/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama kadet..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-space-surface/90 border border-white/10 focus:border-neon-cyan focus:outline-none text-xs sm:text-sm text-neon-white placeholder:text-neon-white/30"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1.5 text-xs text-neon-white/60">
            <Filter className="w-3.5 h-3.5" /> Urutkan:
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'score' | 'xp' | 'accuracy' | 'missions')}
            className="px-3 py-2 rounded-xl bg-space-surface border border-white/10 text-xs text-neon-white focus:outline-none focus:border-neon-cyan"
          >
            <option value="score">Total Skor Tertinggi</option>
            <option value="xp">Total XP Tertinggi</option>
            <option value="accuracy">Akurasi Tertinggi</option>
            <option value="missions">Misi Selesai</option>
          </select>

          <button
            onClick={() => {
              soundEffects.playClick();
              fetchLeaderboard();
            }}
            className="p-2 rounded-xl bg-space-surface border border-white/10 hover:border-neon-cyan text-neon-white/70 hover:text-neon-cyan transition-colors"
            title="Muat Ulang Peringkat"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="w-full py-20 flex flex-col items-center justify-center text-neon-white/60">
          <RefreshCw className="w-8 h-8 animate-spin text-neon-cyan mb-3" />
          <p className="text-sm font-rajdhani">Mengambil data peringkat dari satelit pusat...</p>
        </div>
      )}

      {/* Error state */}
      {!loading && errorMsg && (
        <div className="w-full max-w-md p-6 rounded-2xl bg-red-950/40 border border-red-500/40 text-center text-red-200">
          <p className="text-sm font-bold mb-2">{errorMsg}</p>
          <button
            onClick={fetchLeaderboard}
            className="px-4 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 text-xs font-semibold"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Empty State (No dummy data!) */}
      {!loading && !errorMsg && entries.length === 0 && (
        <div className="w-full max-w-lg p-10 rounded-2xl bg-space-surface/60 border border-white/10 text-center">
          <div className="w-14 h-14 rounded-full bg-space-deep border border-neon-cyan/20 flex items-center justify-center text-neon-cyan mx-auto mb-4">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="font-orbitron font-bold text-lg text-neon-white mb-1">
            Belum Ada Peringkat Terdaftar
          </h3>
          <p className="text-xs text-neon-white/60 max-w-sm mx-auto">
            Jadilah kadet pertama yang menyelesaikan misi di Planet Tangensia dan ukir namamu di puncak galaksi!
          </p>
        </div>
      )}

      {/* Top 3 Podium (Only if we have players) */}
      {!loading && !errorMsg && filtered.length > 0 && (
        <div className="w-full max-w-3xl mb-12">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-12 pb-4">
            {/* Rank 2 (Silver) */}
            {top2 ? (
              <div className="p-3 sm:p-5 rounded-2xl bg-space-surface/80 border border-slate-400/40 flex flex-col items-center text-center relative overflow-hidden order-1 h-56 sm:h-64 justify-end shadow-lg">
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-400/20 text-[10px] font-bold text-slate-300 font-mono">
                  #2 SILVER
                </div>
                <img
                  src={top2.avatarUrl}
                  alt={top2.displayName}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-slate-300 mb-2 bg-space-deep shadow-md"
                />
                <h4 className="font-bold text-xs sm:text-sm text-neon-white truncate max-w-full">
                  {top2.displayName}
                </h4>
                <span className="text-[10px] text-slate-300 font-rajdhani">Level {top2.level}</span>
                <div className="mt-2 text-sm sm:text-base font-extrabold text-neon-white font-orbitron">
                  {top2.totalScore} <span className="text-[10px] text-neon-white/50 font-normal">pts</span>
                </div>
              </div>
            ) : (
              <div className="h-44 order-1" />
            )}

            {/* Rank 1 (Gold) */}
            {top1 && (
              <div className="p-4 sm:p-6 rounded-2xl bg-space-surface/95 border-2 border-neon-gold flex flex-col items-center text-center relative overflow-hidden order-2 h-64 sm:h-76 justify-end shadow-neon-gold/20 shadow-2xl ring-2 ring-neon-gold/30">
                <div className="absolute -top-3 w-10 h-10 rounded-full bg-neon-gold text-space-deep flex items-center justify-center shadow-lg font-bold">
                  <Crown className="w-6 h-6 animate-pulse" />
                </div>
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-neon-gold/20 text-[10px] font-bold text-neon-gold font-mono">
                  #1 GOLD
                </div>
                <img
                  src={top1.avatarUrl}
                  alt={top1.displayName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-neon-gold mb-2 bg-space-deep shadow-neon-gold/40 shadow-xl"
                />
                <h4 className="font-bold text-sm sm:text-base text-neon-white truncate max-w-full">
                  {top1.displayName}
                </h4>
                <span className="text-xs text-neon-gold font-rajdhani font-bold">Level {top1.level} Kadet Utama</span>
                <div className="mt-2 text-base sm:text-xl font-extrabold text-neon-gold font-orbitron">
                  {top1.totalScore} <span className="text-xs text-neon-gold/70 font-normal">pts</span>
                </div>
                <span className="text-[10px] text-neon-white/60 mt-0.5">
                  {top1.totalXp} XP • {top1.accuracy}% Akurasi
                </span>
              </div>
            )}

            {/* Rank 3 (Bronze Cyan) */}
            {top3 ? (
              <div className="p-3 sm:p-5 rounded-2xl bg-space-surface/80 border border-amber-600/40 flex flex-col items-center text-center relative overflow-hidden order-3 h-48 sm:h-56 justify-end shadow-lg">
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-amber-600/20 text-[10px] font-bold text-amber-400 font-mono">
                  #3 BRONZE
                </div>
                <img
                  src={top3.avatarUrl}
                  alt={top3.displayName}
                  className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-amber-600 mb-2 bg-space-deep shadow-md"
                />
                <h4 className="font-bold text-xs sm:text-sm text-neon-white truncate max-w-full">
                  {top3.displayName}
                </h4>
                <span className="text-[10px] text-amber-400 font-rajdhani">Level {top3.level}</span>
                <div className="mt-2 text-sm sm:text-base font-extrabold text-neon-white font-orbitron">
                  {top3.totalScore} <span className="text-[10px] text-neon-white/50 font-normal">pts</span>
                </div>
              </div>
            ) : (
              <div className="h-36 order-3" />
            )}
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      {!loading && !errorMsg && filtered.length > 0 && (
        <div className="w-full max-w-4xl rounded-2xl bg-space-surface/90 border border-space-border overflow-hidden backdrop-blur-xl shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-space-deep/90 text-neon-white/60 uppercase font-mono tracking-wider border-b border-white/10 text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 text-center">Rank</th>
                  <th className="py-3.5 px-4">Pemain</th>
                  <th className="py-3.5 px-4 text-center">Level</th>
                  <th className="py-3.5 px-4 text-right">Total Skor</th>
                  <th className="py-3.5 px-4 text-right">Total XP</th>
                  <th className="py-3.5 px-4 text-center">Misi Selesai</th>
                  <th className="py-3.5 px-4 text-right">Akurasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {filtered.map((entry, index) => {
                  const rank = index + 1;
                  return (
                    <tr
                      key={entry.userId}
                      className="hover:bg-space-deep/40 transition-colors"
                    >
                      <td className="py-3 px-4 text-center">
                        {rank === 1 ? (
                          <span className="w-6 h-6 rounded-full bg-neon-gold text-space-deep font-bold flex items-center justify-center mx-auto text-xs">
                            1
                          </span>
                        ) : rank === 2 ? (
                          <span className="w-6 h-6 rounded-full bg-slate-300 text-space-deep font-bold flex items-center justify-center mx-auto text-xs">
                            2
                          </span>
                        ) : rank === 3 ? (
                          <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center mx-auto text-xs">
                            3
                          </span>
                        ) : (
                          <span className="font-mono text-neon-white/50">{rank}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={entry.avatarUrl}
                            alt={entry.displayName}
                            className="w-7 h-7 rounded-full bg-space-deep border border-white/10"
                          />
                          <span className="font-semibold text-neon-white text-xs sm:text-sm">
                            {entry.displayName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-rajdhani font-bold text-neon-cyan">
                        Lvl {entry.level}
                      </td>
                      <td className="py-3 px-4 text-right font-orbitron font-bold text-neon-white">
                        {entry.totalScore}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-neon-gold">
                        {entry.totalXp} XP
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        {entry.missionsCompleted} / 4 Planet
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-neon-emerald">
                        {entry.accuracy}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
