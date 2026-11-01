/**
 * Secure CSV Exporter with Formula Injection Mitigation
 * Neutralizes potential formula injection characters (=, +, -, @, \t, \r)
 * and includes UTF-8 BOM for proper spreadsheet opening.
 */

import { UserProfile, LeaderboardEntry, MissionResult } from '../types/game';

/**
 * Sanitizes a cell string against CSV formula injection (OWASP recommendation).
 * If a cell begins with '=', '+', '-', '@', '\t', or '\r', it prepends a single quote (').
 */
export const sanitizeCSVCell = (val: unknown): string => {
  if (val === null || val === undefined) {
    return '""';
  }

  let str = String(val).trim();

  // Neutralize formula trigger characters
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }

  // Escape double quotes by doubling them
  str = str.replace(/"/g, '""');

  return `"${str}"`;
};

export const downloadCSVFile = (content: string, filename: string): void => {
  // UTF-8 Byte Order Mark (BOM) for Excel compatibility
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export class CSVExporterService {
  /**
   * Export Player Profiles to CSV
   */
  public exportUsers(users: UserProfile[], filename = 'galactic_circle_pemain.csv'): void {
    const headers = [
      'ID Pemain',
      'Username',
      'Nama Tampilan',
      'Email',
      'Level',
      'Total XP',
      'Kristal Kosmik',
      'Role Admin',
      'Tanggal Bergabung',
    ];

    const rows = users.map((u) => [
      sanitizeCSVCell(u.id),
      sanitizeCSVCell(u.username),
      sanitizeCSVCell(u.displayName),
      sanitizeCSVCell(u.email || '-'),
      sanitizeCSVCell(u.level),
      sanitizeCSVCell(u.xp),
      sanitizeCSVCell(u.crystals),
      sanitizeCSVCell(u.isAdmin ? 'Admin' : 'Kadet'),
      sanitizeCSVCell(new Date(u.createdAt).toLocaleString('id-ID')),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    downloadCSVFile(csvContent, filename);
  }

  /**
   * Export Leaderboard to CSV
   */
  public exportLeaderboard(entries: LeaderboardEntry[], filename = 'galactic_circle_leaderboard.csv'): void {
    const headers = [
      'Peringkat',
      'Nama Publik Pemain',
      'Level',
      'Total Skor',
      'Total XP',
      'Total Kristal',
      'Misi Selesai',
      'Akurasi Rata-rata (%)',
      'Aktivitas Terakhir',
    ];

    const rows = entries.map((e, index) => [
      sanitizeCSVCell(e.rank || index + 1),
      sanitizeCSVCell(e.displayName),
      sanitizeCSVCell(e.level),
      sanitizeCSVCell(e.totalScore),
      sanitizeCSVCell(e.totalXp),
      sanitizeCSVCell(e.totalCrystals),
      sanitizeCSVCell(e.missionsCompleted),
      sanitizeCSVCell(`${e.accuracy}%`),
      sanitizeCSVCell(new Date(e.lastActive).toLocaleString('id-ID')),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    downloadCSVFile(csvContent, filename);
  }

  /**
   * Export Mission Results to CSV
   */
  public exportMissionResults(results: MissionResult[], filename = 'galactic_circle_riwayat_misi.csv'): void {
    const headers = [
      'ID Percobaan',
      'ID Pemain',
      'Planet',
      'Skor Diperoleh',
      'Jawaban Benar',
      'Total Soal',
      'Akurasi (%)',
      'XP Didapat',
      'Kristal Didapat',
      'Waktu Pengerjaan (detik)',
      'Waktu Selesai',
    ];

    const rows = results.map((r) => [
      sanitizeCSVCell(r.id),
      sanitizeCSVCell(r.userId),
      sanitizeCSVCell(r.planetName),
      sanitizeCSVCell(r.score),
      sanitizeCSVCell(r.correctCount),
      sanitizeCSVCell(r.totalQuestions),
      sanitizeCSVCell(`${r.accuracy}%`),
      sanitizeCSVCell(r.xpEarned),
      sanitizeCSVCell(r.crystalsEarned),
      sanitizeCSVCell(r.timeSpentSeconds),
      sanitizeCSVCell(new Date(r.completedAt).toLocaleString('id-ID')),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    downloadCSVFile(csvContent, filename);
  }
}

export const csvExporter = new CSVExporterService();
