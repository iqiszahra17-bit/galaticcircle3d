import React, { useState, useEffect } from 'react';
import { GameProgress } from '../types/game';
import { PLANETS } from '../data/planets';
import { soundEffects } from '../utils/soundEffects';
import {
  BookOpen,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Play,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Star,
  RotateCcw,
  Compass,
  Check
} from 'lucide-react';

interface Props {
  initialPlanetId?: string;
  userProgress?: Record<string, GameProgress>;
  onStartPractice: (planetId: string) => void;
  onBackToMap?: () => void;
  onModuleProgressUpdate?: (planetId: string, stars: number) => void;
}

interface InteractiveExercise {
  id: string;
  question: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
}

interface LevelModuleData {
  planetId: string;
  levelNumber: number;
  planetName: string;
  title: string;
  subtitle: string;
  learningObjectives: string[];
  materiContent: {
    heading: string;
    description: string;
    points: string[];
    formulaHighlight?: string;
  }[];
  workedExamples: {
    title: string;
    problem: string;
    diketahui: string;
    ditanya: string;
    formula: string;
    calculationSteps: string[];
    finalAnswer: string;
  }[];
  interactiveExercises: InteractiveExercise[];
  summaryPoints: {
    title: string;
    formula: string;
    notes: string;
  }[];
  svgIllustration: React.ReactNode;
}

export const MateriPage: React.FC<Props> = ({
  initialPlanetId = 'tangensia',
  userProgress = {},
  onStartPractice,
  onBackToMap,
  onModuleProgressUpdate,
}) => {
  const initialIndex = Math.max(
    0,
    PLANETS.findIndex((p) => p.id === initialPlanetId)
  );

  const [activeLevelIndex, setActiveLevelIndex] = useState<number>(initialIndex);
  const [activeTab, setActiveTab] = useState<'modul' | 'latihan' | 'ringkasan'>('modul');

  // Interactive Exercise state per question ID
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [checkedAnswers, setCheckedAnswers] = useState<Record<string, boolean>>({});
  const [interactiveStars, setInteractiveStars] = useState<Record<string, number>>({});

  useEffect(() => {
    if (initialPlanetId) {
      const idx = PLANETS.findIndex((p) => p.id === initialPlanetId);
      if (idx >= 0) setActiveLevelIndex(idx);
    }
  }, [initialPlanetId]);

  const currentPlanet = PLANETS[activeLevelIndex] || PLANETS[0];
  const currentProgress = userProgress[currentPlanet.id];
  const currentStars = currentProgress?.stars || interactiveStars[currentPlanet.id] || 0;

  // Complete curriculum data for all 4 levels
  const levelModules: LevelModuleData[] = [
    // =========================================================================
    // LEVEL 1: TANGENSIA (Garis Singgung Persekutuan Lingkaran)
    // =========================================================================
    {
      planetId: 'tangensia',
      levelNumber: 1,
      planetName: 'Tangensia',
      title: 'Garis Singgung Persekutuan Lingkaran (GSPL & GSPD)',
      subtitle: 'Unsur Lingkaran & Garis Singgung Persekutuan Luar dan Dalam',
      learningObjectives: [
        'Mengidentifikasi unsur-unsur dasar lingkaran (titik pusat, jari-jari, diameter, busur, juring, dan tali busur).',
        'Memahami sifat fundamental garis singgung lingkaran yang selalu tegak lurus (90°) dengan jari-jari di titik singgung.',
        'Menurunkan dan menggunakan rumus Garis Singgung Persekutuan Luar (GSPL): L = √(d² − (R − r)²).',
        'Menurunkan dan menggunakan rumus Garis Singgung Persekutuan Dalam (GSPD): L = √(d² − (R + r)²).',
        'Menganalisis skenario lintasan laser transmisi stasiun antariksa berbasis geometri garis singgung.'
      ],
      materiContent: [
        {
          heading: '1. Sifat Garis Singgung Lingkaran',
          description:
            'Garis singgung lingkaran adalah garis yang memotong lingkaran tepat pada SATU titik persekutuan (titik singgung). Garis singgung selalu membentuk sudut siku-siku (90°) terhadap jari-jari lingkaran yang ditarik ke titik singgung tersebut.',
          points: [
            'Titik singgung adalah titik pertemuan antara garis dan keliling lingkaran.',
            'Jari-jari lingkaran tegak lurus terhadap garis singgung: r ⊥ Garis Singgung.',
            'Dari satu titik di luar lingkaran, dapat ditarik tepat 2 garis singgung yang panjangnya sama.'
          ],
          formulaHighlight: 'r ⊥ g (Sudut kontak = 90°)'
        },
        {
          heading: '2. Garis Singgung Persekutuan Luar (GSPL)',
          description:
            'GSPL adalah garis yang menyinggung dua lingkaran tanpa memotong garis hubung titik pusat kedua lingkaran. Pada GSPL, kita mengurangkan jari-jari kecil dari jari-jari besar (R − r).',
          points: [
            'd = Jarak antara kedua pusat lingkaran (titik P ke titik Q).',
            'R = Jari-jari lingkaran yang lebih besar.',
            'r = Jari-jari lingkaran yang lebih kecil.',
            'Panjang GSPL selalu lebih kecil dari jarak pusat d.'
          ],
          formulaHighlight: 'L_GSPL = √(d² − (R − r)²)'
        },
        {
          heading: '3. Garis Singgung Persekutuan Dalam (GSPD)',
          description:
            'GSPD adalah garis singgung yang memotong garis hubung kedua pusat lingkaran di antara kedua lingkaran tersebut. Karena menyilang di tengah, kita menjumlahkan kedua jari-jari (R + r).',
          points: [
            'Jarak antarpusat d membentuk hipotenusa segitiga siku-siku.',
            'Jumlah jari-jari (R + r) merupakan salah satu sisi tegak.',
            'Syarat eksistensi GSPD: Jarak pusat d harus lebih besar dari (R + r).'
          ],
          formulaHighlight: 'L_GSPD = √(d² − (R + r)²)'
        }
      ],
      workedExamples: [
        {
          title: 'Contoh 1: Menghitung Panjang GSPL Antar Stasiun Alpha & Beta',
          problem:
            'Dua lingkaran berpusat di P dan Q dengan jari-jari berturut-turut R = 10 cm dan r = 4 cm. Jarak kedua pusat lingkaran adalah d = 10 cm. Hitunglah panjang garis singgung persekutuan luar (GSPL)!',
          diketahui: 'R = 10 cm, r = 4 cm, d = 10 cm',
          ditanya: 'Panjang GSPL (L)',
          formula: 'L = √(d² − (R − r)²)',
          calculationSteps: [
            'Langkah 1: Hitung selisih jari-jari: R − r = 10 − 4 = 6 cm.',
            'Langkah 2: Kuadratkan jarak pusat dan selisih jari-jari: d² = 10² = 100, (R − r)² = 6² = 36.',
            'Langkah 3: Kurangkan nilai kuadrat: d² − (R − r)² = 100 − 36 = 64.',
            'Langkah 4: Tarik akar kuadrat: L = √64 = 8 cm.'
          ],
          finalAnswer: 'Jadi, panjang garis singgung persekutuan luar adalah 8 cm.'
        },
        {
          title: 'Contoh 2: Menghitung Panjang GSPD Sensor Laser Orbital',
          problem:
            'Dua satelit buatan memiliki orbit melingkar dengan jari-jari R = 7 cm dan r = 2 cm. Jarak antarpusat orbit kedua satelit adalah d = 15 cm. Tentukan panjang lintasan laser GSPD!',
          diketahui: 'R = 7 cm, r = 2 cm, d = 15 cm',
          ditanya: 'Panjang GSPD (L)',
          formula: 'L = √(d² − (R + r)²)',
          calculationSteps: [
            'Langkah 1: Hitung jumlah jari-jari: R + r = 7 + 2 = 9 cm.',
            'Langkah 2: Hitung kuadrat: d² = 15² = 225, (R + r)² = 9² = 81.',
            'Langkah 3: Kurangkan: 225 − 81 = 144.',
            'Langkah 4: Tarik akar: L = √144 = 12 cm.'
          ],
          finalAnswer: 'Jadi, panjang lintasan garis singgung persekutuan dalam adalah 12 cm.'
        }
      ],
      interactiveExercises: [
        {
          id: 'ex-tan-1',
          question:
            'Dua lingkaran berjari-jari 14 cm dan 6 cm memiliki jarak pusat 17 cm. Berapakah panjang GSPL kedua lingkaran?',
          options: [
            { id: 'a', text: '12 cm', isCorrect: false },
            { id: 'b', text: '15 cm', isCorrect: true },
            { id: 'c', text: '16 cm', isCorrect: false },
            { id: 'd', text: '18 cm', isCorrect: false }
          ],
          explanation:
            'Pembahasan: R = 14, r = 6, d = 17. Selisih R − r = 14 − 6 = 8. L = √(17² − 8²) = √(289 − 64) = √225 = 15 cm.'
        },
        {
          id: 'ex-tan-2',
          question:
            'Jika panjang GSPD adalah 24 cm, jari-jari R = 6 cm, r = 4 cm. Berapakah jarak antarpusat (d) kedua lingkaran?',
          options: [
            { id: 'a', text: '26 cm', isCorrect: true },
            { id: 'b', text: '28 cm', isCorrect: false },
            { id: 'c', text: '30 cm', isCorrect: false },
            { id: 'd', text: '34 cm', isCorrect: false }
          ],
          explanation:
            'Pembahasan: L = √(d² − (R + r)²). Diketahui L = 24 dan R + r = 10. Maka 24² = d² − 10² ⇒ 576 = d² − 100 ⇒ d² = 676 ⇒ d = √676 = 26 cm.'
        }
      ],
      summaryPoints: [
        {
          title: 'Garis Singgung Persekutuan Luar (GSPL)',
          formula: 'L = √(d² − (R − r)²)',
          notes: 'Gunakan selisih (R − r). Nilai L selalu lebih pendek dari jarak pusat d.'
        },
        {
          title: 'Garis Singgung Persekutuan Dalam (GSPD)',
          formula: 'L = √(d² − (R + r)²)',
          notes: 'Gunakan penjumlahan (R + r). Garis singgung saling bersilangan di antara kedua lingkaran.'
        }
      ],
      svgIllustration: (
        <svg viewBox="0 0 160 100" className="w-full max-w-[240px] h-auto drop-shadow-lg">
          <circle cx="45" cy="50" r="32" fill="#321442" stroke="#FF55C8" strokeWidth="2.5" />
          <circle cx="120" cy="50" r="16" fill="#321442" stroke="#8D3CC7" strokeWidth="2" />
          <line x1="45" y1="50" x2="120" y2="50" stroke="#FFD76A" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="35" y1="19" x2="125" y2="34" stroke="#FF55C8" strokeWidth="3" />
          <circle cx="45" cy="50" r="3" fill="#FFD76A" />
          <circle cx="120" cy="50" r="3" fill="#FFD76A" />
        </svg>
      )
    },

    // =========================================================================
    // LEVEL 2: ANGULARIS (Sudut Pusat, Keliling & Segiempat Siklik)
    // =========================================================================
    {
      planetId: 'angularis',
      levelNumber: 2,
      planetName: 'Angularis',
      title: 'Sudut Pusat, Sudut Keliling & Segiempat Tali Busur',
      subtitle: 'Relasi Busur Lingkaran & Sifat Segiempat Siklik',
      learningObjectives: [
        'Membedakan sudut pusat (titik sudut di pusat) dan sudut keliling (titik sudut di keliling lingkaran).',
        'Membuktikan dan menerapkan teorema: Sudut Pusat = 2 × Sudut Keliling (jika menghadap busur sama).',
        'Memahami bahwa semua sudut keliling yang menghadap busur yang sama bernilai sama besar.',
        'Mengetahui bahwa sudut keliling yang menghadap diameter lingkaran besarnya tepat 90° (sudut siku-siku).',
        'Menerapkan sifat segiempat tali busur: Jumlah dua sudut yang saling berhadapan adalah tepat 180°.'
      ],
      materiContent: [
        {
          heading: '1. Relasi Sudut Pusat & Sudut Keliling',
          description:
            'Jika sebuah sudut pusat dan sudut keliling menghadap busur lingkaran yang sama, maka ukuran sudut pusat adalah DUA KALI ukuran sudut keliling.',
          points: [
            'Sudut Pusat (∠AOB) memiliki titik sudut di titik pusat O.',
            'Sudut Keliling (∠ACB) memiliki titik sudut di keliling lingkaran.',
            'Jika menghadap busur AB yang sama: ∠AOB = 2 × ∠ACB, atau ∠ACB = ½ × ∠AOB.'
          ],
          formulaHighlight: 'Sudut Pusat = 2 × Sudut Keliling'
        },
        {
          heading: '2. Sudut Keliling Khusus',
          description:
            'Terdapat dua sifat penting mengenai sudut keliling yang sering muncul dalam problem geometri:',
          points: [
            'Sudut-sudut keliling yang menghadap busur yang sama memiliki besar sudut yang SAMA.',
            'Sudut keliling yang menghadap diameter lingkaran besarnya PASTI 90° (siku-siku).'
          ],
          formulaHighlight: '∠Keliling_menghadap_diameter = 90°'
        },
        {
          heading: '3. Segiempat Tali Busur (Segiempat Siklik)',
          description:
            'Segiempat tali busur adalah segiempat yang keempat titik sudutnya terletak pada keliling lingkaran. Sifat utama yang berlaku adalah jumlah sudut-sudut yang saling berhadapan selalu sama dengan 180°.',
          points: [
            '∠A + ∠C = 180° (Sudut berhadapan 1)',
            '∠B + ∠D = 180° (Sudut berhadapan 2)'
          ],
          formulaHighlight: '∠Berhadapan_1 + ∠Berhadapan_2 = 180°'
        }
      ],
      workedExamples: [
        {
          title: 'Contoh 1: Menghitung Sudut Keliling',
          problem:
            'Pada kubah sensor Angularis, sudut pusat ∠AOB menghadap busur AB dengan besar 130°. Titik C berada di keliling kubah dan juga menghadap busur AB. Hitunglah besar sudut ∠ACB!',
          diketahui: 'Sudut pusat ∠AOB = 130°, menghadap busur AB',
          ditanya: 'Besar sudut keliling ∠ACB',
          formula: '∠ACB = ½ × ∠AOB',
          calculationSteps: [
            'Langkah 1: Identifikasi relasi: kedua sudut menghadap busur AB yang sama.',
            'Langkah 2: Terapkan rumus: ∠ACB = ½ × 130°.',
            'Langkah 3: Hitung hasil: ∠ACB = 65°.'
          ],
          finalAnswer: 'Jadi, besar sudut keliling ∠ACB adalah 65°.'
        },
        {
          title: 'Contoh 2: Menghitung Sudut Berhadapan Segiempat Tali Busur',
          problem:
            'Diketahui segiempat tali busur KLMN di mana ∠K = (2x + 10)° dan ∠M = (3x + 20)°. Tentukan nilai x dan besar sudut ∠M!',
          diketahui: '∠K dan ∠M saling berhadapan. ∠K = 2x + 10, ∠M = 3x + 20.',
          ditanya: 'Nilai x dan besar ∠M',
          formula: '∠K + ∠M = 180°',
          calculationSteps: [
            'Langkah 1: (2x + 10) + (3x + 20) = 180',
            'Langkah 2: 5x + 30 = 180',
            'Langkah 3: 5x = 180 − 30 = 150 ⇒ x = 30°',
            'Langkah 4: Substitusi ke ∠M: 3(30) + 20 = 90 + 20 = 110°.'
          ],
          finalAnswer: 'Jadi, nilai x = 30° dan besar sudut ∠M adalah 110°.'
        }
      ],
      interactiveExercises: [
        {
          id: 'ex-ang-1',
          question:
            'Jika sebuah sudut keliling besarnya 42°, berapakah besar sudut pusat yang menghadap busur yang sama?',
          options: [
            { id: 'a', text: '21°', isCorrect: false },
            { id: 'b', text: '42°', isCorrect: false },
            { id: 'c', text: '84°', isCorrect: true },
            { id: 'd', text: '138°', isCorrect: false }
          ],
          explanation:
            'Pembahasan: Sudut pusat = 2 × Sudut keliling = 2 × 42° = 84°.'
        },
        {
          id: 'ex-ang-2',
          question:
            'Pada segiempat tali busur ABCD, diketahui besar sudut ∠B = 105°. Berapakah besar sudut berhadapan ∠D?',
          options: [
            { id: 'a', text: '75°', isCorrect: true },
            { id: 'b', text: '85°', isCorrect: false },
            { id: 'c', text: '95°', isCorrect: false },
            { id: 'd', text: '105°', isCorrect: false }
          ],
          explanation:
            'Pembahasan: Pada segiempat tali busur, sudut yang berhadapan berjumlah 180°. Maka ∠D = 180° − 105° = 75°.'
        }
      ],
      summaryPoints: [
        {
          title: 'Teorema Sudut Pusat & Keliling',
          formula: '∠Pusat = 2 × ∠Keliling',
          notes: 'Hanya berlaku jika kedua kaki sudut menghadap busur yang sama.'
        },
        {
          title: 'Segiempat Tali Busur (Siklik)',
          formula: '∠A + ∠C = 180° | ∠B + ∠D = 180°',
          notes: 'Jumlah sudut yang berhadapan pada segiempat di dalam lingkaran selalu 180°.'
        }
      ],
      svgIllustration: (
        <svg viewBox="0 0 160 100" className="w-full max-w-[240px] h-auto drop-shadow-lg">
          <circle cx="80" cy="50" r="38" fill="#321442" stroke="#8D3CC7" strokeWidth="2.5" />
          <circle cx="80" cy="50" r="3" fill="#FFD76A" />
          <line x1="80" y1="50" x2="52" y2="76" stroke="#FFD76A" strokeWidth="2" strokeDasharray="2 2" />
          <line x1="80" y1="50" x2="108" y2="76" stroke="#FFD76A" strokeWidth="2" strokeDasharray="2 2" />
          <line x1="80" y1="12" x2="52" y2="76" stroke="#FF55C8" strokeWidth="2.5" />
          <line x1="80" y1="12" x2="108" y2="76" stroke="#FF55C8" strokeWidth="2.5" />
          <circle cx="80" cy="12" r="3" fill="#FF55C8" />
        </svg>
      )
    },

    // =========================================================================
    // LEVEL 3: ARCADIA (Panjang Busur & Luas Juring Lingkaran)
    // =========================================================================
    {
      planetId: 'arcadia',
      levelNumber: 3,
      planetName: 'Arcadia',
      title: 'Panjang Busur, Luas Juring & Tembereng Lingkaran',
      subtitle: 'Kalkulasi Proporsi Sudut Terhadap Satu Putaran 360°',
      learningObjectives: [
        'Memahami hubungan proporsional antara besar sudut pusat terhadap putaran penuh (360°).',
        'Menghitung panjang busur lingkaran dengan rumus: s = (θ / 360°) × 2πr.',
        'Menghitung luas juring (sektor lingkaran) dengan rumus: A = (θ / 360°) × πr².',
        'Menentukan luas tembereng lingkaran: Luas Juring dikurangi Luas Segitiga.',
        'Menggunakan nilai aproksimasi π = 22/7 untuk kelipatan 7 atau 3,14 secara tepat.'
      ],
      materiContent: [
        {
          heading: '1. Konsep Proporsionalitas Sudut Lingkaran',
          description:
            'Panjang busur dan luas juring merupakan fraksi atau bagian dari keliling dan luas lingkaran penuh, berbanding lurus dengan rasio sudut pusat θ terhadap 360°.',
          points: [
            'Keliling lingkaran penuh = 2πr (atau πd).',
            'Luas lingkaran penuh = πr².',
            'Rasio fraksi busur dan juring = θ / 360°.'
          ],
          formulaHighlight: 'Rasio = θ / 360°'
        },
        {
          heading: '2. Panjang Busur (Arc Length)',
          description:
            'Panjang busur adalah jarak lengkungan keliling lingkaran yang dibatasi oleh dua kaki sudut pusat θ.',
          points: [
            's = panjang busur lingkaran (cm atau m).',
            'θ = sudut pusat dalam derajat (°).',
            'r = jari-jari lingkaran.'
          ],
          formulaHighlight: 's = (θ / 360°) × 2πr'
        },
        {
          heading: '3. Luas Juring & Tembereng',
          description:
            'Juring adalah daerah di dalam lingkaran yang dibatasi oleh dua jari-jari dan sebuah busur. Tembereng adalah daerah yang dibatasi oleh busur dan tali busurnya.',
          points: [
            'Luas Juring: A = (θ / 360°) × πr².',
            'Luas Tembereng: Luas Juring − Luas Segitiga Pembentuk.'
          ],
          formulaHighlight: 'A_juring = (θ / 360°) × πr²'
        }
      ],
      workedExamples: [
        {
          title: 'Contoh 1: Menghitung Panjang Busur Orbit Cincin Arcadia',
          problem:
            'Sebuah wahana antariksa melintasi busur orbit dengan sudut pusat θ = 90° pada lingkaran beradius r = 14 cm. Tentukan panjang lintasan busur yang dilalui wahana! (Gunakan π = 22/7)',
          diketahui: 'θ = 90°, r = 14 cm, π = 22/7',
          ditanya: 'Panjang busur s',
          formula: 's = (θ / 360°) × 2πr',
          calculationSteps: [
            'Langkah 1: Sederhanakan fraksi sudut: 90° / 360° = 1/4.',
            'Langkah 2: Hitung keliling lingkaran penuh: 2 × (22/7) × 14 = 2 × 22 × 2 = 88 cm.',
            'Langkah 3: Kalikan fraksi dengan keliling: s = 1/4 × 88 = 22 cm.'
          ],
          finalAnswer: 'Jadi, panjang busur orbit yang dilalui adalah 22 cm.'
        },
        {
          title: 'Contoh 2: Menghitung Luas Juring Solar Panel',
          problem:
            'Sebuah panel surya berbentuk juring lingkaran memiliki sudut pusat 60° dan jari-jari r = 21 cm. Hitunglah luas penampang solar panel tersebut! (Gunakan π = 22/7)',
          diketahui: 'θ = 60°, r = 21 cm, π = 22/7',
          ditanya: 'Luas juring A',
          formula: 'A = (θ / 360°) × πr²',
          calculationSteps: [
            'Langkah 1: Fraksi sudut: 60° / 360° = 1/6.',
            'Langkah 2: Luas lingkaran penuh: (22/7) × 21² = (22/7) × 441 = 22 × 63 = 1386 cm².',
            'Langkah 3: Kalikan fraksi dengan luas: A = 1/6 × 1386 = 231 cm².'
          ],
          finalAnswer: 'Jadi, luas juring solar panel tersebut adalah 231 cm².'
        }
      ],
      interactiveExercises: [
        {
          id: 'ex-arc-1',
          question:
            'Sebuah juring lingkaran dengan sudut pusat 45° memiliki jari-jari 28 cm. Berapakah panjang busurnya? (π = 22/7)',
          options: [
            { id: 'a', text: '18 cm', isCorrect: false },
            { id: 'b', text: '22 cm', isCorrect: true },
            { id: 'c', text: '24 cm', isCorrect: false },
            { id: 'd', text: '26 cm', isCorrect: false }
          ],
          explanation:
            'Pembahasan: s = (45/360) × 2 × (22/7) × 28 = 1/8 × 176 = 22 cm.'
        },
        {
          id: 'ex-arc-2',
          question:
            'Jika luas juring lingkaran beradius 14 cm dengan sudut pusat 90° adalah A, berapakah nilai A? (π = 22/7)',
          options: [
            { id: 'a', text: '144 cm²', isCorrect: false },
            { id: 'b', text: '154 cm²', isCorrect: true },
            { id: 'c', text: '164 cm²', isCorrect: false },
            { id: 'd', text: '308 cm²', isCorrect: false }
          ],
          explanation:
            'Pembahasan: A = (90/360) × (22/7) × 14² = 1/4 × 616 = 154 cm².'
        }
      ],
      summaryPoints: [
        {
          title: 'Panjang Busur Lingkaran',
          formula: 's = (θ / 360°) × 2πr',
          notes: 'Berbanding lurus dengan keliling lingkaran.'
        },
        {
          title: 'Luas Juring Lingkaran',
          formula: 'A = (θ / 360°) × πr²',
          notes: 'Berbanding lurus dengan luas daerah lingkaran.'
        }
      ],
      svgIllustration: (
        <svg viewBox="0 0 160 100" className="w-full max-w-[240px] h-auto drop-shadow-lg">
          <circle cx="80" cy="50" r="38" fill="#321442" stroke="rgba(255,215,106,0.3)" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M 80 50 L 80 12 A 38 38 0 0 1 118 50 Z" fill="rgba(255,85,200,0.3)" stroke="#FF55C8" strokeWidth="2" />
          <path d="M 80 12 A 38 38 0 0 1 118 50" fill="none" stroke="#FFD76A" strokeWidth="3.5" />
          <circle cx="80" cy="50" r="3" fill="#FFD76A" />
        </svg>
      )
    },

    // =========================================================================
    // LEVEL 4: NEXUS (Sintesis Geometri Lingkaran Terpadu)
    // =========================================================================
    {
      planetId: 'nexus',
      levelNumber: 4,
      planetName: 'Nexus',
      title: 'Nexus Terpadu: Sintesis Geometri Lingkaran',
      subtitle: 'Integrasi Multi-Teorema: Garis Singgung, Sudut Siklik & Busur',
      learningObjectives: [
        'Mengintegrasikan teorema garis singgung lingkaran (GSPL & GSPD) dengan sudut pusat dan keliling.',
        'Menyelesaikan permasalahan geometri beranomali multi-lingkaran kompleks secara bertahap.',
        'Menganalisis skenario perpaduan panjang busur dan luas tembereng pada transmisi satelit.',
        'Mengembangkan strategi pemecahan masalah non-rutin dengan dekomposisi geometri tingkat lanjut.'
      ],
      materiContent: [
        {
          heading: '1. Sintesis Garis Singgung & Relasi Orbital',
          description:
            'Di pusat komputasi Nexus, stasiun transmisi biner dihubungkan oleh kabel laser persekutuan sekaligus membaca sudut busur sensor energi secara simultan.',
          points: [
            'Gunakan dekomposisi segitiga siku-siku untuk menyelesaikan GSPL dan GSPD.',
            'Kaitkan panjang jari-jari dengan kalkulasi busur orbital satelit di kedua stasiun.'
          ],
          formulaHighlight: 'GSPL = √(d² − (R − r)²) & s = (θ/360°) × 2πr'
        },
        {
          heading: '2. Harmonisasi Sudut Siklik & Sektor Juring',
          description:
            'Ketika formasi empat satelit membentuk segiempat tali busur di sekeliling pemancar energi bundar, relasi sudut 180° berhadapan dipadukan dengan luas juring pancaran gelombang.',
          points: [
            'Langkah 1: Cari besar sudut menggunakan sifat segiempat tali busur atau sudut pusat.',
            'Langkah 2: Gunakan sudut yang diperoleh untuk menghitung luas juring atau panjang busur.'
          ],
          formulaHighlight: '∠Berhadapan = 180° → A = (θ/360°) × πr²'
        }
      ],
      workedExamples: [
        {
          title: 'Contoh Komprehensif: Analisis Multi-Parameter Nexus',
          problem:
            'Dua satelit Nexus memiliki jarak pusat d = 26 cm dengan R = 15 cm dan r = 5 cm. Kabel optik luar menghubungkan keduanya melalui GSPL. Sensor sudut di stasiun pertama mendeteksi sudut keliling 30°. Hitunglah: (a) Panjang kabel GSPL, (b) Besar sudut pusat sensor!',
          diketahui: 'd = 26 cm, R = 15 cm, r = 5 cm, Sudut keliling = 30°',
          ditanya: 'Panjang GSPL dan Besar Sudut Pusat',
          formula: 'L = √(d² − (R − r)²) dan Sudut Pusat = 2 × Sudut Keliling',
          calculationSteps: [
            'Bagian (a) GSPL: R − r = 15 − 5 = 10 cm.',
            'L = √(26² − 10²) = √(676 − 100) = √576 = 24 cm.',
            'Bagian (b) Sudut Pusat: Sudut Pusat = 2 × 30° = 60°.'
          ],
          finalAnswer: 'Jadi, panjang kabel GSPL adalah 24 cm dan besar sudut pusat sensor adalah 60°.'
        }
      ],
      interactiveExercises: [
        {
          id: 'ex-nex-1',
          question:
            'Dua lingkaran dengan d = 25 cm memiliki GSPL sepanjang 24 cm. Jika R = 11 cm, berapakah jari-jari lingkaran kecil r?',
          options: [
            { id: 'a', text: '3 cm', isCorrect: false },
            { id: 'b', text: '4 cm', isCorrect: true },
            { id: 'c', text: '5 cm', isCorrect: false },
            { id: 'd', text: '6 cm', isCorrect: false }
          ],
          explanation:
            'Pembahasan: L² = d² − (R − r)². Maka 24² = 25² − (R − r)² ⇒ 576 = 625 − (R − r)² ⇒ (R − r)² = 49 ⇒ R − r = 7. Karena R = 11, maka r = 11 − 7 = 4 cm.'
        }
      ],
      summaryPoints: [
        {
          title: 'Mastery GSPL & GSPD',
          formula: 'L = √(d² − (R ∓ r)²)',
          notes: 'GSPL kurangkan selisih, GSPD jumlahkan jari-jari.'
        },
        {
          title: 'Mastery Sudut & Juring',
          formula: '∠Pusat = 2 × ∠Keliling | A = (θ/360°) × πr²',
          notes: 'Dekomposisi bertahap untuk menyelesaikan masalah geometri tingkat lanjut.'
        }
      ],
      svgIllustration: (
        <svg viewBox="0 0 160 100" className="w-full max-w-[240px] h-auto drop-shadow-lg">
          <circle cx="80" cy="50" r="38" fill="#321442" stroke="#62536D" strokeWidth="2" />
          <path d="M 35 45 L 65 75 L 85 75 L 110 100" fill="none" stroke="#FF55C8" strokeWidth="2" strokeDasharray="4 2" />
          <path d="M 50 110 L 80 110 L 105 85" fill="none" stroke="#8D3CC7" strokeWidth="1.5" />
          <circle cx="80" cy="50" r="4" fill="#FFD76A" />
        </svg>
      )
    }
  ];

  const currentModule = levelModules[activeLevelIndex] || levelModules[0];

  const handleSelectOption = (exerciseId: string, optionId: string) => {
    soundEffects.playClick();
    setSelectedAnswers((prev) => ({ ...prev, [exerciseId]: optionId }));
    // Reset checked state when changing option
    setCheckedAnswers((prev) => ({ ...prev, [exerciseId]: false }));
  };

  const handleCheckExercise = (exerciseId: string) => {
    soundEffects.playClick();
    setCheckedAnswers((prev) => ({ ...prev, [exerciseId]: true }));

    const exercise = currentModule.interactiveExercises.find((e) => e.id === exerciseId);
    if (!exercise) return;

    const chosenOption = exercise.options.find((o) => o.id === selectedAnswers[exerciseId]);
    if (chosenOption?.isCorrect) {
      soundEffects.playCorrect();
      // Interactive practice grants stars without decrementing
      const earned = 12; // Base practice stars
      setInteractiveStars((prev) => ({
        ...prev,
        [currentModule.planetId]: Math.max(prev[currentModule.planetId] || 0, earned)
      }));
      if (onModuleProgressUpdate) {
        onModuleProgressUpdate(currentModule.planetId, earned);
      }
    } else {
      soundEffects.playWrong();
    }
  };

  const handleResetExercise = (exerciseId: string) => {
    soundEffects.playClick();
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[exerciseId];
      return copy;
    });
    setCheckedAnswers((prev) => ({ ...prev, [exerciseId]: false }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 sm:py-10 flex flex-col items-center">
      {/* Top Navigation & Level Selector Bar */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 mb-6 border-b border-[#FF55C8]/20">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {onBackToMap && (
            <button
              onClick={() => {
                soundEffects.playClick();
                onBackToMap();
              }}
              className="p-2.5 rounded-2xl bg-[#321442] hover:bg-[#24102F] border border-[#FF55C8]/30 text-[#FFF5FF] hover:text-neon-magenta transition-colors"
              aria-label="Kembali ke Peta"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div>
            <span className="text-[10px] text-neon-magenta font-mono uppercase tracking-wider block">
              MODUL PEMBELAJARAN SMA KELAS XI
            </span>
            <h1 className="text-xl sm:text-2xl font-black font-orbitron text-[#FFF5FF]">
              {currentModule.planetName.toUpperCase()} • LEVEL {currentModule.levelNumber}
            </h1>
          </div>
        </div>

        {/* Level Selector Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#321442] border border-[#FF55C8]/25 overflow-x-auto max-w-full">
          {levelModules.map((mod, idx) => {
            const isActive = activeLevelIndex === idx;
            const isCompleted = userProgress[mod.planetId]?.status === 'completed';

            return (
              <button
                key={mod.planetId}
                onClick={() => {
                  soundEffects.playClick();
                  setActiveLevelIndex(idx);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-orbitron font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-neon-magenta text-[#170D24] shadow-neon-magenta scale-105'
                    : 'text-[#C6B2D2] hover:text-[#FFF5FF] hover:bg-[#24102F]'
                }`}
              >
                <span>Lv.{mod.levelNumber}</span>
                {isCompleted && (
                  <Check className={`w-3.5 h-3.5 stroke-[3] ${isActive ? 'text-[#170D24]' : 'text-[#57E389]'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Level Header Card in Cosmic Plum */}
      <div className="w-full rounded-3xl bg-[#321442] border border-[#FF55C8]/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden mb-6 hud-corner">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#8D3CC7]/30 border border-[#8D3CC7] text-xs font-mono font-bold text-[#FFB5E8]">
                Sektor {currentModule.planetName}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#FFD76A]/15 border border-[#FFD76A]/40 text-xs font-bold text-[#FFD76A] flex items-center gap-1 shadow-star-glow">
                <Star className="w-3.5 h-3.5 fill-[#FFD76A]" />
                <span>⭐ {currentStars}/20 Bintang</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-3xl font-extrabold font-orbitron text-[#FFF5FF]">
              {currentModule.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#C6B2D2] leading-relaxed max-w-2xl">
              {currentModule.subtitle}
            </p>
          </div>

          <div className="shrink-0 flex items-center justify-center p-2 rounded-2xl bg-[#24102F] border border-[#FF55C8]/30">
            {currentModule.svgIllustration}
          </div>
        </div>

        {/* Section Tabs: Modul, Latihan, Ringkasan */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/10">
          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('modul');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-orbitron transition-all flex items-center gap-2 ${
              activeTab === 'modul'
                ? 'bg-neon-magenta text-[#170D24] shadow-neon-magenta'
                : 'bg-[#24102F] text-[#C6B2D2] hover:text-[#FFF5FF]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Materi & Contoh Soal</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('latihan');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-orbitron transition-all flex items-center gap-2 ${
              activeTab === 'latihan'
                ? 'bg-neon-magenta text-[#170D24] shadow-neon-magenta'
                : 'bg-[#24102F] text-[#C6B2D2] hover:text-[#FFF5FF]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Latihan Soal Interaktif</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('ringkasan');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-orbitron transition-all flex items-center gap-2 ${
              activeTab === 'ringkasan'
                ? 'bg-neon-magenta text-[#170D24] shadow-neon-magenta'
                : 'bg-[#24102F] text-[#C6B2D2] hover:text-[#FFF5FF]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Ringkasan Rumus</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          TAB 1: MATERI & CONTOH SOAL DENGAN LANGKAH PENYELESAIAN
          ===================================================================== */}
      {activeTab === 'modul' && (
        <div className="w-full space-y-6">
          {/* 1. Tujuan Pembelajaran Card */}
          <div className="p-6 rounded-3xl bg-[#321442] border border-[#FF55C8]/30 backdrop-blur-xl">
            <h3 className="text-base font-bold font-orbitron text-[#FFF5FF] mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-neon-magenta animate-ping" />
              Tujuan Pembelajaran Level {currentModule.levelNumber}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentModule.learningObjectives.map((obj, i) => (
                <div key={i} className="p-3 rounded-2xl bg-[#24102F]/90 border border-white/5 flex items-start gap-2.5 text-xs text-[#FFF5FF]/90">
                  <span className="text-neon-magenta font-bold shrink-0">✓</span>
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Uraian Materi & Penjelasan Teori */}
          <div className="space-y-4">
            {currentModule.materiContent.map((mat, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-[#321442] border border-[#FF55C8]/25 backdrop-blur-xl space-y-3">
                <h4 className="text-base font-bold font-orbitron text-[#FFF5FF] flex items-center justify-between">
                  <span>{mat.heading}</span>
                  {mat.formulaHighlight && (
                    <span className="text-xs px-3 py-1 rounded-xl bg-[#24102F] border border-[#FFD76A]/40 text-[#FFD76A] font-mono">
                      {mat.formulaHighlight}
                    </span>
                  )}
                </h4>
                <p className="text-xs sm:text-sm text-[#FFF5FF]/80 leading-relaxed">
                  {mat.description}
                </p>
                <div className="p-3.5 rounded-2xl bg-[#24102F]/90 border border-white/5">
                  <ul className="space-y-1.5 text-xs text-[#C6B2D2]">
                    {mat.points.map((p, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2">
                        <span className="text-neon-magenta">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* 3. Contoh Soal Beserta Langkah Penyelesaian Terinci */}
          <div className="p-6 rounded-3xl bg-[#321442] border border-[#FF55C8]/30 backdrop-blur-xl space-y-4">
            <h3 className="text-base font-bold font-orbitron text-[#FFF5FF] flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#FFD76A]" />
              Contoh Soal & Langkah Penyelesaian Bertahap
            </h3>

            <div className="space-y-5">
              {currentModule.workedExamples.map((ex, exIdx) => (
                <div key={exIdx} className="p-5 rounded-2xl bg-[#24102F] border border-[#FF55C8]/20 space-y-3">
                  <h5 className="font-bold text-sm text-[#FFB5E8] font-orbitron">
                    {ex.title}
                  </h5>
                  <p className="text-xs text-[#FFF5FF] bg-[#321442]/80 p-3 rounded-xl border border-white/5 leading-relaxed">
                    <strong>Soal:</strong> {ex.problem}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#321442]/60 border border-white/5">
                      <span className="text-[#C6B2D2] block text-[11px]">Diketahui:</span>
                      <span className="text-[#FFF5FF] font-medium">{ex.diketahui}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#321442]/60 border border-white/5">
                      <span className="text-[#C6B2D2] block text-[11px]">Ditanyakan:</span>
                      <span className="text-[#FFF5FF] font-medium">{ex.ditanya}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#321442] border border-[#FFD76A]/30 text-xs">
                    <span className="text-[#FFD76A] font-bold block mb-1 font-mono">Rumus: {ex.formula}</span>
                    <div className="space-y-1 text-[#FFF5FF]/90 font-mono text-[11px]">
                      {ex.calculationSteps.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-1.5">
                          <span className="text-neon-magenta">→</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#57E389]/10 border border-[#57E389]/30 text-xs font-semibold text-[#57E389]">
                    {ex.finalAnswer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: LATIHAN SOAL INTERAKTIF DENGAN PEMBAHASAN JAWABAN
          ===================================================================== */}
      {activeTab === 'latihan' && (
        <div className="w-full space-y-6">
          <div className="p-4 rounded-2xl bg-[#8D3CC7]/20 border border-[#8D3CC7]/40 text-xs text-[#FFF5FF] flex items-center justify-between">
            <span>
              Kerjakan latihan interaktif ini untuk menguji pemahamanmu. Pembahasan lengkap akan muncul setelah kamu menekan tombol periksa!
            </span>
            <Sparkles className="w-5 h-5 text-[#FFD76A] shrink-0 ml-2" />
          </div>

          <div className="space-y-5">
            {currentModule.interactiveExercises.map((exercise, qIdx) => {
              const selectedOpt = selectedAnswers[exercise.id];
              const isChecked = checkedAnswers[exercise.id];
              const correctOpt = exercise.options.find((o) => o.isCorrect);
              const isUserCorrect = selectedOpt && exercise.options.find((o) => o.id === selectedOpt)?.isCorrect;

              return (
                <div key={exercise.id} className="p-6 rounded-3xl bg-[#321442] border border-[#FF55C8]/30 backdrop-blur-xl space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-xs font-bold font-orbitron text-neon-magenta">
                      Latihan #{qIdx + 1}
                    </span>
                    {isChecked && (
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                        isUserCorrect
                          ? 'bg-[#57E389]/20 text-[#57E389] border border-[#57E389]'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500'
                      }`}>
                        {isUserCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>{isUserCorrect ? 'Jawaban Benar! (+⭐)' : 'Kurang Tepat'}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-[#FFF5FF] font-medium leading-relaxed">
                    {exercise.question}
                  </p>

                  {/* Multiple Choice Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {exercise.options.map((opt) => {
                      const isSelected = selectedOpt === opt.id;
                      let optionBorder = 'border-white/10 hover:border-neon-magenta/50';
                      let optionBg = 'bg-[#24102F]';

                      if (isChecked) {
                        if (opt.isCorrect) {
                          optionBorder = 'border-[#57E389]';
                          optionBg = 'bg-[#57E389]/20 text-[#57E389]';
                        } else if (isSelected && !opt.isCorrect) {
                          optionBorder = 'border-rose-500';
                          optionBg = 'bg-rose-500/20 text-rose-300';
                        }
                      } else if (isSelected) {
                        optionBorder = 'border-neon-magenta';
                        optionBg = 'bg-neon-magenta/20 text-[#FFF5FF]';
                      }

                      return (
                        <button
                          key={opt.id}
                          disabled={isChecked}
                          onClick={() => handleSelectOption(exercise.id, opt.id)}
                          className={`p-3.5 rounded-2xl border ${optionBorder} ${optionBg} text-xs text-left transition-all flex items-center justify-between`}
                        >
                          <span className="font-medium">
                            <strong className="uppercase mr-2 font-mono">[{opt.id}]</strong>
                            {opt.text}
                          </span>
                          {isChecked && opt.isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-[#57E389] shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Action Button: Periksa Jawaban or Ulangi */}
                  <div className="flex items-center justify-between pt-2">
                    {!isChecked ? (
                      <button
                        type="button"
                        disabled={!selectedOpt}
                        onClick={() => handleCheckExercise(exercise.id)}
                        className={`px-5 py-2.5 rounded-xl font-bold font-orbitron text-xs transition-all flex items-center gap-2 ${
                          selectedOpt
                            ? 'bg-gradient-to-r from-neon-magenta to-[#8D3CC7] text-[#FFF5FF] shadow-neon-magenta hover:opacity-90'
                            : 'bg-[#24102F] text-[#C6B2D2]/40 cursor-not-allowed'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Periksa Jawaban</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleResetExercise(exercise.id)}
                        className="px-4 py-2 rounded-xl bg-[#24102F] hover:bg-[#321442] border border-[#FF55C8]/30 text-xs text-[#FFF5FF] flex items-center gap-2 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-neon-magenta" />
                        <span>Ulangi Soal Ini</span>
                      </button>
                    )}
                  </div>

                  {/* Pembahasan Jawaban (Appears after checking) */}
                  {isChecked && (
                    <div className="p-4 rounded-2xl bg-[#24102F] border border-[#FFD76A]/40 animate-fadeIn space-y-2">
                      <span className="text-xs font-bold text-[#FFD76A] uppercase font-orbitron flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-[#FFD76A]" />
                        Pembahasan Jawaban Lengkap:
                      </span>
                      {!isUserCorrect && correctOpt && (
                        <div className="p-2.5 rounded-xl bg-[#170D24] border border-[#57E389]/40 text-xs">
                          <span className="text-[#57E389] font-bold font-mono">Jawaban yang Benar: </span>
                          <span className="text-[#FFF5FF] font-semibold">[{correctOpt.id.toUpperCase()}] {correctOpt.text}</span>
                        </div>
                      )}
                      <p className="text-xs text-[#FFF5FF]/90 font-mono leading-relaxed">
                        {exercise.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: RINGKASAN MATERI
          ===================================================================== */}
      {activeTab === 'ringkasan' && (
        <div className="w-full space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentModule.summaryPoints.map((sum, sIdx) => (
              <div key={sIdx} className="p-5 rounded-3xl bg-[#321442] border border-[#FF55C8]/30 backdrop-blur-xl space-y-2">
                <h4 className="font-bold text-sm text-[#FFB5E8] font-orbitron">
                  {sum.title}
                </h4>
                <div className="p-3 rounded-xl bg-[#24102F] border border-[#FFD76A]/30 text-xs font-mono text-[#FFD76A]">
                  {sum.formula}
                </div>
                <p className="text-xs text-[#C6B2D2] leading-relaxed">
                  {sum.notes}
                </p>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-3xl bg-[#321442] border border-[#FF55C8]/30 text-xs text-[#FFF5FF] space-y-2">
            <span className="text-xs font-bold text-neon-magenta uppercase font-orbitron block">
              Tips Menghadapi Soal Misi Geometri:
            </span>
            <ul className="space-y-1.5 text-[#C6B2D2]">
              <li>• Selalu perhatikan apakah jari-jari yang diberikan merupakan kelipatan 7 untuk mempermudah perhitungan dengan π = 22/7.</li>
              <li>• Pada GSPL dan GSPD, pastikan selisih atau jumlah jari-jari dikuadratkan terlebih dahulu sebelum dikurangkan dari d².</li>
              <li>• Ingat bahwa besar sudut pusat selalu 2 kali lipat sudut keliling jika menghadap busur yang sama.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Bottom Action & Navigation Bar */}
      <div className="w-full mt-8 p-4 rounded-3xl bg-[#321442] border border-[#FF55C8]/40 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-2">
          {onBackToMap && (
            <button
              onClick={() => {
                soundEffects.playClick();
                onBackToMap();
              }}
              className="px-4 py-2.5 rounded-2xl bg-[#24102F] hover:bg-[#170D24] border border-[#FF55C8]/30 text-xs font-bold text-[#FFF5FF] flex items-center gap-2 transition-colors"
            >
              <Compass className="w-4 h-4 text-neon-magenta" />
              <span>Kembali ke Peta</span>
            </button>
          )}

          {activeLevelIndex > 0 && (
            <button
              onClick={() => {
                soundEffects.playClick();
                setActiveLevelIndex((prev) => prev - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2.5 rounded-2xl bg-[#24102F] hover:bg-[#170D24] border border-[#FF55C8]/30 text-xs font-bold text-[#FFF5FF] flex items-center gap-2 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Materi Sebelumnya</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {activeLevelIndex < levelModules.length - 1 && (
            <button
              onClick={() => {
                soundEffects.playClick();
                setActiveLevelIndex((prev) => prev + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2.5 rounded-2xl bg-[#24102F] hover:bg-[#170D24] border border-[#FF55C8]/30 text-xs font-bold text-[#FFF5FF] flex items-center gap-2 transition-colors"
            >
              <span>Materi Berikutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => {
              soundEffects.playClick();
              onStartPractice(currentModule.planetId);
            }}
            className="py-3 px-6 rounded-2xl bg-gradient-to-r from-neon-magenta via-[#8D3CC7] to-neon-magenta hover:opacity-95 text-[#FFF5FF] font-black font-orbitron text-xs sm:text-sm tracking-wider shadow-neon-magenta flex items-center gap-2 transition-all hover:scale-105"
          >
            <Play className="w-4 h-4 fill-[#FFF5FF]" />
            <span>Mulai Latihan Level {currentModule.levelNumber}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MateriPage;
