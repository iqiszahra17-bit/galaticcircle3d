import { Achievement } from '../types/game';

export const ACHIEVEMENTS: Achievement[] = [
  {
    code: 'cadet_tangensia',
    name: 'Penakluk Tangensia',
    description: 'Menyelesaikan seluruh 5 misi garis singgung di Planet Tangensia.',
    icon: 'Compass',
    category: 'planet',
    requiredCondition: 'Selesaikan Planet Tangensia'
  },
  {
    code: 'master_angularis',
    name: 'Penguasa Angularis',
    description: 'Menguasai formasi sudut pusat, keliling, dan segiempat siklik di Planet Angularis.',
    icon: 'RotateCw',
    category: 'planet',
    requiredCondition: 'Selesaikan Planet Angularis'
  },
  {
    code: 'architect_arcadia',
    name: 'Arsitek Busur Arcadia',
    description: 'Menghitung kalkulasi busur orbital dan juring surya di Planet Arcadia.',
    icon: 'PieChart',
    category: 'planet',
    requiredCondition: 'Selesaikan Planet Arcadia'
  },
  {
    code: 'overlord_nexus',
    name: 'Master Galaksi Nexus',
    description: 'Menaklukkan tantangan klimaks sintesis geometri lingkaran di Nexus.',
    icon: 'Award',
    category: 'planet',
    requiredCondition: 'Selesaikan seluruh 4 Planet'
  },
  {
    code: 'perfectionist',
    name: 'Presisi Sempurna',
    description: 'Menyelesaikan sebuah misi planet dengan akurasi 100% (semua 5 soal benar).',
    icon: 'Sparkles',
    category: 'mastery',
    requiredCondition: 'Akurasi 100% dalam satu misi'
  },
  {
    code: 'speed_star',
    name: 'Kecepatan Warp',
    description: 'Menyelesaikan seluruh soal dalam satu planet dalam waktu kurang dari 3 menit.',
    icon: 'Zap',
    category: 'speed',
    requiredCondition: 'Selesai < 180 detik'
  },
  {
    code: 'crystal_hoarder',
    name: 'Kolektor Kristal Kosmik',
    description: 'Mengumpulkan lebih dari 100 Kristal Kosmik dari penyelesaian misi.',
    icon: 'Gem',
    category: 'score',
    requiredCondition: 'Koleksi 100+ Kristal'
  },
  {
    code: 'grandmaster',
    name: 'Grandmaster Lingkaran SMA',
    description: 'Mencapai Level 4 dengan akumulasi lebih dari 1.500 XP.',
    icon: 'ShieldCheck',
    category: 'mastery',
    requiredCondition: 'Level 4 & 1.500+ XP'
  }
];
