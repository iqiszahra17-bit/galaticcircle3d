import { Planet } from '../types/math';

export const PLANETS: Planet[] = [
  {
    id: 'tangensia',
    name: 'Tangensia',
    codeName: 'PLANET-I',
    order: 1,
    difficultyRange: 'Medium → Challenging',
    topicTitle: 'Garis Singgung Persekutuan Lingkaran',
    summary: 'Kuasai kalkulasi Garis Singgung Persekutuan Luar (GSPL) dan Garis Singgung Persekutuan Dalam (GSPD) antar stasiun antariksa.',
    description: 'Planet Tangensia dikelilingi orbit ganda stasiun komunikasi antariksa. Di sini, Anda akan menganalisis lintasan transmisi sinar laser lurus yang menyinggung dua orbit lingkaran sekaligus.',
    coreFormulas: [
      {
        title: 'GSPL (Garis Singgung Persekutuan Luar)',
        formula: 'L = √(d² − (R − r)²)',
        description: 'L = panjang GSPL, d = jarak antarpusat, R = jari-jari besar, r = jari-jari kecil'
      },
      {
        title: 'GSPD (Garis Singgung Persekutuan Dalam)',
        formula: 'L = √(d² − (R + r)²)',
        description: 'L = panjang GSPD, d = jarak antarpusat, R = jari-jari besar, r = jari-jari kecil'
      }
    ],
    color: {
      primary: '#00E5FF',
      secondary: '#07152B',
      accent: '#00FF9D',
      glow: 'rgba(0, 229, 255, 0.4)',
      border: 'rgba(0, 229, 255, 0.3)',
      bgGradient: 'from-cyan-950/40 via-space-surface to-space-deep'
    },
    unlockCondition: {
      minLevel: 1,
      description: 'Terbuka untuk seluruh kadet antariksa baru.'
    },
    iconName: 'Compass'
  },
  {
    id: 'angularis',
    name: 'Angularis',
    codeName: 'PLANET-II',
    order: 2,
    difficultyRange: 'Medium → Challenging',
    topicTitle: 'Sudut Pusat, Sudut Keliling & Segiempat Tali Busur',
    summary: 'Pecahkan dinamika sudut navigasi pada kubah pelindung energi dan formasi satelit segiempat tali busur.',
    description: 'Planet Angularis memancarkan kristalisasi medan magnetik bundar. Anda harus menghitung relasi sudut pusat dan sudut keliling yang menghadap busur sama serta simetri segiempat siklik.',
    coreFormulas: [
      {
        title: 'Relasi Sudut Pusat & Sudut Keliling',
        formula: 'Sudut Pusat = 2 × Sudut Keliling',
        description: 'Berlaku jika menghadap busur lingkaran yang sama.'
      },
      {
        title: 'Sifat Segiempat Tali Busur',
        formula: '∠Berhadapan_1 + ∠Berhadapan_2 = 180°',
        description: 'Jumlah dua sudut yang saling berhadapan pada segiempat tali busur adalah 180°.'
      }
    ],
    color: {
      primary: '#7861FF',
      secondary: '#07152B',
      accent: '#B388FF',
      glow: 'rgba(120, 97, 255, 0.4)',
      border: 'rgba(120, 97, 255, 0.3)',
      bgGradient: 'from-violet-950/40 via-space-surface to-space-deep'
    },
    unlockCondition: {
      minLevel: 2,
      requiredPreviousPlanetId: 'tangensia',
      description: 'Selesaikan misi Planet Tangensia terlebih dahulu.'
    },
    iconName: 'RotateCw'
  },
  {
    id: 'arcadia',
    name: 'Arcadia',
    codeName: 'PLANET-III',
    order: 3,
    difficultyRange: 'Medium → Challenging',
    topicTitle: 'Panjang Busur & Luas Juring Lingkaran',
    summary: 'Hitung lintasan orbit melengkung wahana pengintai dan kalkulasi luas sektor energi solar panel juring raksasa.',
    description: 'Arcadia adalah planet yang diselimuti cincin plasma emas. Navigasi antariksa di sini membutuhkan akurasi tinggi dalam menentukan panjang lengkungan busur dan luas sektor juring lingkaran.',
    coreFormulas: [
      {
        title: 'Panjang Busur Lingkaran',
        formula: 's = (θ / 360°) × 2πr',
        description: 's = panjang busur, θ = sudut pusat dalam derajat, r = jari-jari'
      },
      {
        title: 'Luas Juring Lingkaran',
        formula: 'A = (θ / 360°) × πr²',
        description: 'A = luas juring, θ = sudut pusat, r = jari-jari (Gunakan π = 22/7)'
      }
    ],
    color: {
      primary: '#FFD34E',
      secondary: '#07152B',
      accent: '#FFAB00',
      glow: 'rgba(255, 211, 78, 0.4)',
      border: 'rgba(255, 211, 78, 0.3)',
      bgGradient: 'from-amber-950/40 via-space-surface to-space-deep'
    },
    unlockCondition: {
      minLevel: 3,
      requiredPreviousPlanetId: 'angularis',
      description: 'Selesaikan misi Planet Angularis terlebih dahulu.'
    },
    iconName: 'PieChart'
  },
  {
    id: 'nexus',
    name: 'Nexus',
    codeName: 'PLANET-IV',
    order: 4,
    difficultyRange: 'Medium → Challenging',
    topicTitle: 'Nexus Terpadu: Sintesis Geometri Lingkaran',
    summary: 'Tantangan tertinggi: gabungan garis singgung, sudut keliling, busur, dan luas juring dalam satu sektor komputasi.',
    description: 'Pusat galaksi Nexus menggabungkan seluruh anomali geometri gravitasi. Kadet harus mengerahkan seluruh kemampuannya memadukan GSPL/GSPD, relasi sudut, dan kalkulasi busur orbital.',
    coreFormulas: [
      {
        title: 'Sintesis Garis Singgung & Orbital',
        formula: 'L = √(d² − (R ± r)²) & s = (θ/360°) × 2πr',
        description: 'Penyelesaian bertingkat untuk sistem stasiun multi-orbit antariksa.'
      },
      {
        title: 'Harmonisasi Juring & Sudut Pusat',
        formula: 'A = (θ/360°) × πr² & Sudut Pusat = 2 × Sudut Keliling',
        description: 'Relasi multi-parameter untuk analisis sektor ruang angkasa.'
      }
    ],
    color: {
      primary: '#00FF9D',
      secondary: '#07152B',
      accent: '#00E5FF',
      glow: 'rgba(0, 255, 157, 0.4)',
      border: 'rgba(0, 255, 157, 0.3)',
      bgGradient: 'from-emerald-950/40 via-space-surface to-space-deep'
    },
    unlockCondition: {
      minLevel: 4,
      requiredPreviousPlanetId: 'arcadia',
      description: 'Selesaikan misi Planet Arcadia terlebih dahulu.'
    },
    iconName: 'Radio'
  }
];
