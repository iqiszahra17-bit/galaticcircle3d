import React, { useState, useEffect } from 'react';
import { UserProfile, MissionResult, LeaderboardEntry } from '../types/game';
import { gameService } from '../services/gameService';
import { csvExporter } from '../services/csvExporter';
import { soundEffects } from '../utils/soundEffects';
import { 
  ShieldAlert, 
  Users, 
  Activity, 
  TrendingUp, 
  CheckCircle2, 
  Download, 
  Search, 
  RefreshCw, 
  FileSpreadsheet,
  Lock,
  ArrowUpDown,
  BookOpen
} from 'lucide-react';

interface Props {
  currentUser: UserProfile | null;
  onBackToApp: () => void;
}

export const AdminDashboardPage: React.FC<Props> = ({ currentUser, onBackToApp }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [missions, setMissions] = useState<MissionResult[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'missions'>('users');

  // Verify Admin authorization
  const isAuthorized = Boolean(currentUser && currentUser.isAdmin);

  const loadAdminData = async () => {
    if (!isAuthorized) return;
    setLoading(true);
    try {
      const [uList, mList, lList] = await Promise.all([
        gameService.getAdminUserList(),
        gameService.getAdminMissionHistory(),
        gameService.getLeaderboard(),
      ]);
      setUsers(uList);
      setMissions(mList);
      setLeaderboard(lList);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [isAuthorized]);

  // Deny access if not admin
  if (!isAuthorized) {
    return (
      <div className="w-full max-w-lg mx-auto py-24 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-500/50 text-red-400 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-orbitron font-bold text-neon-white mb-2">
          AKSES DITOLAK: HAK ADMIN DIBUTUHKAN
        </h2>
        <p className="text-xs text-neon-white/60 mb-6 leading-relaxed">
          Halaman ini dilindungi oleh otorisasi keamanan tinggi. Anda harus memiliki role Admin di database Supabase atau masuk dengan kredensial Admin untuk mengakses Command Center ini.
        </p>
        <div className="p-4 rounded-xl bg-space-deep border border-white/10 text-xs text-neon-white/70 text-left mb-6 font-mono space-y-1">
          <p className="text-neon-cyan font-bold">Prosedur Admin Pertama (Supabase SQL):</p>
          <p className="text-neon-gold text-[11px]">
            UPDATE public.profiles SET is_admin = true WHERE email = 'email_anda@domain.com';
          </p>
        </div>
        <button
          onClick={onBackToApp}
          className="px-6 py-2.5 rounded-xl bg-space-surface border border-white/10 hover:border-neon-cyan text-xs font-semibold text-neon-white transition-colors"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  // Admin summary statistics
  const totalUsersCount = users.length;
  const totalAttemptsCount = missions.length;
  const avgScore = totalAttemptsCount > 0
    ? Math.round(missions.reduce((sum, m) => sum + m.score, 0) / totalAttemptsCount)
    : 0;
  const avgAccuracy = totalAttemptsCount > 0
    ? Math.round(missions.reduce((sum, m) => sum + m.accuracy, 0) / totalAttemptsCount)
    : 0;

  // Filtered Users
  const filteredUsers = users.filter(
    (u) =>
      u.displayName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(userSearch.toLowerCase()))
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between pb-6 mb-8 border-b border-red-500/30 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-red-400 tracking-widest uppercase">
              ADMINISTRATIVE COMMAND CENTER
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-orbitron text-neon-white">
            PUSAT KENDALI GALAKSI
          </h1>
          <p className="text-xs text-neon-white/60 mt-0.5">
            Manajemen pengguna, audit percobaan misi, dan ekspor dataset CSV aman.
          </p>
        </div>

        {/* Global CSV Export Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              soundEffects.playClick();
              csvExporter.exportUsers(users);
            }}
            className="px-3.5 py-2 rounded-xl bg-space-surface border border-neon-cyan/40 hover:border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            title="Ekspor seluruh daftar profil pemain ke format CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>CSV Pemain</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              csvExporter.exportLeaderboard(leaderboard);
            }}
            className="px-3.5 py-2 rounded-xl bg-space-surface border border-neon-gold/40 hover:border-neon-gold text-neon-gold hover:bg-neon-gold/10 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            title="Ekspor data peringkat leaderboard ke format CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>CSV Leaderboard</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              csvExporter.exportMissionResults(missions);
            }}
            className="px-3.5 py-2 rounded-xl bg-space-surface border border-neon-violet/40 hover:border-neon-violet text-neon-violet hover:bg-neon-violet/10 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            title="Ekspor log riwayat seluruh percobaan misi ke format CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>CSV Riwayat Misi</span>
          </button>

          <button
            onClick={loadAdminData}
            className="p-2 rounded-xl bg-space-surface border border-white/10 hover:border-white/40 text-neon-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-space-surface/90 border border-white/10">
          <div className="flex items-center justify-between text-neon-white/60 mb-2">
            <span className="text-xs font-rajdhani uppercase font-semibold">Total Pengguna</span>
            <Users className="w-4 h-4 text-neon-cyan" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-orbitron text-neon-white">
            {totalUsersCount}
          </div>
          <span className="text-[10px] text-neon-white/40">Akun kadet terdaftar</span>
        </div>

        <div className="p-4 rounded-2xl bg-space-surface/90 border border-white/10">
          <div className="flex items-center justify-between text-neon-white/60 mb-2">
            <span className="text-xs font-rajdhani uppercase font-semibold">Total Percobaan</span>
            <Activity className="w-4 h-4 text-neon-violet" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-orbitron text-neon-violet">
            {totalAttemptsCount}
          </div>
          <span className="text-[10px] text-neon-white/40">Misi planet diselesaikan</span>
        </div>

        <div className="p-4 rounded-2xl bg-space-surface/90 border border-white/10">
          <div className="flex items-center justify-between text-neon-white/60 mb-2">
            <span className="text-xs font-rajdhani uppercase font-semibold">Rata-rata Skor</span>
            <TrendingUp className="w-4 h-4 text-neon-gold" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-orbitron text-neon-gold">
            {avgScore}
          </div>
          <span className="text-[10px] text-neon-white/40">Poin per sesi misi</span>
        </div>

        <div className="p-4 rounded-2xl bg-space-surface/90 border border-white/10">
          <div className="flex items-center justify-between text-neon-white/60 mb-2">
            <span className="text-xs font-rajdhani uppercase font-semibold">Akurasi Rata-rata</span>
            <CheckCircle2 className="w-4 h-4 text-neon-emerald" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-orbitron text-neon-emerald">
            {avgAccuracy}%
          </div>
          <span className="text-[10px] text-neon-white/40">Tingkat ketepatan geometri</span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="w-full flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-orbitron transition-all ${
            activeTab === 'users'
              ? 'bg-space-surface text-neon-cyan border border-neon-cyan/40 shadow-sm'
              : 'text-neon-white/60 hover:text-neon-white'
          }`}
        >
          Daftar Pengguna ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('missions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-orbitron transition-all ${
            activeTab === 'missions'
              ? 'bg-space-surface text-neon-violet border border-neon-violet/40 shadow-sm'
              : 'text-neon-white/60 hover:text-neon-white'
          }`}
        >
          Log Riwayat Percobaan ({missions.length})
        </button>
      </div>

      {/* TAB 1: User Management Table */}
      {activeTab === 'users' && (
        <div className="w-full rounded-2xl bg-space-surface/90 border border-space-border overflow-hidden backdrop-blur-xl shadow-xl">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neon-white/40" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Cari user, email, nama..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-space-deep border border-white/10 text-xs text-neon-white focus:outline-none focus:border-neon-cyan"
              />
            </div>
            <span className="text-xs text-neon-white/40 font-mono">
              Menampilkan {filteredUsers.length} dari {users.length} kadet
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-space-deep text-neon-white/60 uppercase font-mono tracking-wider border-b border-white/10 text-[10px]">
                <tr>
                  <th className="py-3 px-4">Pengguna</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4 text-center">Level</th>
                  <th className="py-3 px-4 text-right">XP</th>
                  <th className="py-3 px-4 text-right">Kristal</th>
                  <th className="py-3 px-4 text-center">Role</th>
                  <th className="py-3 px-4 text-right">Bergabung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-space-deep/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={u.avatarUrl}
                          alt={u.displayName}
                          className="w-6 h-6 rounded-full bg-space-deep border border-white/10"
                        />
                        <div>
                          <span className="font-bold text-neon-white block">{u.displayName}</span>
                          <span className="text-[10px] text-neon-white/40 font-mono">@{u.username}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-neon-white/70">{u.email || '-'}</td>
                    <td className="py-3 px-4 text-center font-rajdhani font-bold text-neon-cyan">
                      Lvl {u.level}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-neon-white">{u.xp}</td>
                    <td className="py-3 px-4 text-right font-mono text-neon-gold">{u.crystals}</td>
                    <td className="py-3 px-4 text-center">
                      {u.isAdmin ? (
                        <span className="px-2 py-0.5 rounded bg-red-950/60 border border-red-500/40 text-[10px] text-red-400 font-bold uppercase">
                          Admin
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-space-deep text-[10px] text-neon-white/60">
                          Kadet
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right text-neon-white/50">
                      {new Date(u.createdAt).toLocaleDateString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Mission History Table */}
      {activeTab === 'missions' && (
        <div className="w-full rounded-2xl bg-space-surface/90 border border-space-border overflow-hidden backdrop-blur-xl shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-space-deep text-neon-white/60 uppercase font-mono tracking-wider border-b border-white/10 text-[10px]">
                <tr>
                  <th className="py-3 px-4">ID Sesi</th>
                  <th className="py-3 px-4">Planet</th>
                  <th className="py-3 px-4 text-right">Skor</th>
                  <th className="py-3 px-4 text-center">Jawaban Benar</th>
                  <th className="py-3 px-4 text-right">Akurasi</th>
                  <th className="py-3 px-4 text-right">XP & Kristal</th>
                  <th className="py-3 px-4 text-center">Waktu Pengerjaan</th>
                  <th className="py-3 px-4 text-right">Selesai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {missions.map((m) => (
                  <tr key={m.id} className="hover:bg-space-deep/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-[10px] text-neon-white/40 truncate max-w-[100px]">
                      {m.id}
                    </td>
                    <td className="py-3 px-4 font-bold text-neon-white">{m.planetName}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-neon-cyan">{m.score} pts</td>
                    <td className="py-3 px-4 text-center font-mono">
                      {m.correctCount} / {m.totalQuestions}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-neon-emerald">{m.accuracy}%</td>
                    <td className="py-3 px-4 text-right text-neon-gold font-rajdhani">
                      +{m.xpEarned} XP • +{m.crystalsEarned} Kristal
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-neon-white/60">
                      {m.timeSpentSeconds}s
                    </td>
                    <td className="py-3 px-4 text-right text-neon-white/50">
                      {new Date(m.completedAt).toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
