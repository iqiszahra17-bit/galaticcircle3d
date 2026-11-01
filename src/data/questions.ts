import { Question } from '../types/math';

export const QUESTIONS: Question[] = [
  // ==========================================
  // PLANET 1: TANGENSIA (Garis Singgung)
  // ==========================================
  {
    id: 'tan-01',
    planetId: 'tangensia',
    questionNumber: 1,
    title: 'Misi Transmisi GSPL Stasiun Alpha',
    difficulty: 'Medium',
    topic: 'Garis Singgung Persekutuan Luar',
    questionText: 'Dua lingkaran memiliki jari-jari 10 cm dan 4 cm. Jarak kedua pusatnya 10 cm. Tentukan panjang garis singgung persekutuan luar (GSPL).',
    diagramConfig: {
      type: 'gspl',
      title: 'GSPL Dua Lingkaran (R = 10 cm, r = 4 cm, d = 10 cm)',
      params: {
        R: 10,
        r: 4,
        d: 10,
        tangentLength: 8,
        showGSPL: true,
        labels: { center1: 'P (10 cm)', center2: 'Q (4 cm)', tangent: 'GSPL = 8 cm' }
      }
    },
    type: 'multiple_choice',
    choices: [
      { id: 'a', label: '6 cm', isCorrect: false, explanation: 'Salah hitung selisih atau kuadrat.' },
      { id: 'b', label: '8 cm', isCorrect: true, explanation: 'Tepat! L = √(10² - (10 - 4)²) = √(100 - 36) = √64 = 8 cm.' },
      { id: 'c', label: '10 cm', isCorrect: false, explanation: 'Ini adalah jarak kedua pusat lingkaran.' },
      { id: 'd', label: '12 cm', isCorrect: false, explanation: 'Panjang garis singgung tidak mungkin melebihi jarak antarpusat.' }
    ],
    expectedAnswer: '8',
    acceptableAnswers: ['8', '8 cm', '8cm'],
    unit: 'cm',
    hints: [
      'Gunakan rumus GSPL: L = √(d² − (R − r)²).',
      'Hitung selisih jari-jari terlebih dahulu: R − r = 10 − 4 = 6 cm.',
      'Kurangkan d² dengan (R − r)²: 10² − 6² = 100 − 36 = 64.'
    ],
    solutionSteps: [
      {
        title: 'Langkah 1: Identifikasi Data',
        description: 'Jari-jari lingkaran besar (R) = 10 cm, jari-jari lingkaran kecil (r) = 4 cm, jarak antarpusat (d) = 10 cm.'
      },
      {
        title: 'Langkah 2: Terapkan Rumus GSPL',
        description: 'Rumus garis singgung persekutuan luar:',
        formula: 'L = √(d² − (R − r)²)'
      },
      {
        title: 'Langkah 3: Substitusi & Perhitungan',
        description: 'Hitung nilai di bawah tanda akar:',
        calculation: 'L = √(10² − (10 − 4)²) = √(100 − 6²) = √(100 − 36) = √64 = 8 cm.'
      }
    ],
    finalAnswerFormatted: '8 cm',
    baseScore: 100,
    xpReward: 120,
    crystalReward: 15
  },
  {
    id: 'tan-02',
    planetId: 'tangensia',
    questionNumber: 2,
    title: 'Sinar Silang GSPD Reaktor Beta',
    difficulty: 'Medium',
    topic: 'Garis Singgung Persekutuan Dalam',
    questionText: 'Dua lingkaran memiliki jari-jari 8 cm dan 3 cm. Jarak kedua pusatnya 13 cm. Tentukan panjang garis singgung persekutuan dalam (GSPD).',
    diagramConfig: {
      type: 'gspd',
      title: 'GSPD Dua Lingkaran (R = 8 cm, r = 3 cm, d = 13 cm)',
      params: {
        R: 8,
        r: 3,
        d: 13,
        showGSPD: true,
        labels: { center1: 'P (8 cm)', center2: 'Q (3 cm)', tangent: 'GSPD = 4√3 cm' }
      }
    },
    type: 'multiple_choice',
    choices: [
      { id: 'a', label: '4√3 cm', isCorrect: true, explanation: 'Tepat! L = √(13² - (8 + 3)²) = √(169 - 121) = √48 = 4√3 cm.' },
      { id: 'b', label: '12 cm', isCorrect: false, explanation: '√48 bukan 12 (12 = √144).' },
      { id: 'c', label: '6√2 cm', isCorrect: false, explanation: '6√2 = √72, bukan √48.' },
      { id: 'd', label: '2√13 cm', isCorrect: false, explanation: '2√13 = √52.' }
    ],
    expectedAnswer: '4√3',
    acceptableAnswers: ['4√3', '4 akar 3', '4sqrt(3)', '4sqrt3', '6.93', '6.928'],
    unit: 'cm',
    hints: [
      'Gunakan rumus GSPD: L = √(d² − (R + r)²). Perhatikan tanda tambah (+) untuk garis dalam.',
      'Jumlahkan jari-jari terlebih dahulu: R + r = 8 + 3 = 11 cm.',
      'Hitung d² − (R + r)² = 13² − 11² = 169 − 121 = 48, lalu sederhanakan bentuk akar √48.'
    ],
    solutionSteps: [
      {
        title: 'Langkah 1: Identifikasi Variabel',
        description: 'R = 8 cm, r = 3 cm, d = 13 cm.'
      },
      {
        title: 'Langkah 2: Rumus Garis Singgung Dalam',
        description: 'Gunakan penjumlahan jari-jari pada pengurang:',
        formula: 'L = √(d² − (R + r)²)'
      },
      {
        title: 'Langkah 3: Kalkulasi & Penyederhanaan Akar',
        description: 'Substitusi ke rumus:',
        calculation: 'L = √(13² − (8 + 3)²) = √(169 − 11²) = √(169 − 121) = √48 = √(16 × 3) = 4√3 cm.'
      }
    ],
    finalAnswerFormatted: '4√3 cm',
    baseScore: 120,
    xpReward: 140,
    crystalReward: 20
  },
  {
    id: 'tan-03',
    planetId: 'tangensia',
    questionNumber: 3,
    title: 'Orbit Paralel Satelit Gamma',
    difficulty: 'Hard',
    topic: 'GSPL Jarak Menengah',
    questionText: 'Dua lingkaran memiliki jari-jari 13 cm dan 5 cm. Jarak kedua pusatnya 17 cm. Tentukan panjang GSPL.',
    diagramConfig: {
      type: 'gspl',
      title: 'GSPL (R = 13 cm, r = 5 cm, d = 17 cm)',
      params: {
        R: 13,
        r: 5,
        d: 17,
        tangentLength: 15,
        showGSPL: true,
        labels: { center1: 'P (13 cm)', center2: 'Q (5 cm)', tangent: 'GSPL = 15 cm' }
      }
    },
    type: 'multiple_choice',
    choices: [
      { id: 'a', label: '14 cm', isCorrect: false, explanation: '14² = 196, selisih kuadrat menghasilkan 225.' },
      { id: 'b', label: '15 cm', isCorrect: true, explanation: 'Tepat! L = √(17² - (13 - 5)²) = √(289 - 64) = √225 = 15 cm.' },
      { id: 'c', label: '16 cm', isCorrect: false, explanation: '16² = 256.' },
      { id: 'd', label: '8√5 cm', isCorrect: false, explanation: '8√5 = √320.' }
    ],
    expectedAnswer: '15',
    acceptableAnswers: ['15', '15 cm', '15cm'],
    unit: 'cm',
    hints: [
      'Rumus GSPL: L = √(d² − (R − r)²).',
      'Hitung R − r = 13 − 5 = 8 cm.',
      'd² = 17² = 289, 8² = 64. Kurangkan keduanya dan cari nilai akarnya.'
    ],
    solutionSteps: [
      {
        title: 'Langkah 1: Identifikasi Data',
        description: 'R = 13 cm, r = 5 cm, d = 17 cm.'
      },
      {
        title: 'Langkah 2: Rumus GSPL',
        description: 'Terapkan rumus persekutuan luar:',
        formula: 'L = √(d² − (R − r)²)'
      },
      {
        title: 'Langkah 3: Perhitungan Numerik',
        description: 'Hitung akar dari selisih kuadrat:',
        calculation: 'L = √(17² − (13 − 5)²) = √(289 − 8²) = √(289 − 64) = √225 = 15 cm.'
      }
    ],
    finalAnswerFormatted: '15 cm',
    baseScore: 150,
    xpReward: 180,
    crystalReward: 25
  },
  {
    id: 'tan-04',
    planetId: 'tangensia',
    questionNumber: 4,
    title: 'Pelacakan Jarak Antarpusat GSPL',
    difficulty: 'Hard',
    topic: 'Kalkulasi Jarak Antarpusat dari GSPL',
    questionText: 'Dua lingkaran memiliki jari-jari 10 cm dan 6 cm. Panjang GSPL adalah 24 cm. Tentukan jarak antarpusat kedua lingkaran.',
    diagramConfig: {
      type: 'gspl',
      title: 'Mencari Jarak Pusat d (R = 10 cm, r = 6 cm, L = 24 cm)',
      params: {
        R: 10,
        r: 6,
        showGSPL: true,
        labels: { center1: 'P (10 cm)', center2: 'Q (6 cm)', tangent: 'GSPL = 24 cm', distance: 'd = ?' }
      }
    },
    type: 'multiple_choice',
    choices: [
      { id: 'a', label: '20 cm', isCorrect: false, explanation: 'Jarak pusat harus lebih besar dari panjang garis singgung.' },
      { id: 'b', label: '4√37 cm', isCorrect: true, explanation: 'Tepat! d = √(L² + (R - r)²) = √(24² + 4²) = √592 = 4√37 cm.' },
      { id: 'c', label: '26 cm', isCorrect: false, explanation: '26² = 676, sedangkan 24² + 4² = 592.' },
      { id: 'd', label: '2√146 cm', isCorrect: false, explanation: '2√146 = √584.' }
    ],
    expectedAnswer: '4√37',
    acceptableAnswers: ['4√37', '4 akar 37', '4sqrt(37)', '4sqrt37', '24.33'],
    unit: 'cm',
    hints: [
      'Gunakan modifikasi rumus GSPL: d² = L² + (R − r)².',
      'Hitung selisih jari-jari: R − r = 10 − 6 = 4 cm.',
      'd = √(24² + 4²) = √(576 + 16) = √592. Faktorkan 592 = 16 × 37.'
    ],
    solutionSteps: [
      {
        title: 'Langkah 1: Hubungan Teorema Pythagoras',
        description: 'Dari L² = d² − (R − r)², maka jarak antarpusat d diperoleh dengan:',
        formula: 'd = √(L² + (R − r)²)'
      },
      {
        title: 'Langkah 2: Substitusi Nilai',
        description: 'L = 24 cm, R − r = 10 − 6 = 4 cm:',
        calculation: 'd = √(24² + 4²) = √(576 + 16) = √592 cm.'
      },
      {
        title: 'Langkah 3: Penyederhanaan Bentuk Akar',
        description: 'Faktorkan bilangan kuadrat terbesar dari 592:',
        calculation: '√592 = √(16 × 37) = 4√37 cm.'
      }
    ],
    finalAnswerFormatted: '4√37 cm',
    baseScore: 160,
    xpReward: 200,
    crystalReward: 30
  },
  {
    id: 'tan-05',
    planetId: 'tangensia',
    questionNumber: 5,
    title: 'Anomali Dualitas Tangensia',
    difficulty: 'Challenging',
    topic: 'Analisis GSPD & GSPL Bertingkat',
    questionText: 'Dua lingkaran memiliki jari-jari 15 cm dan 7 cm. Panjang GSPD adalah 24 cm. Tentukan jarak antarpusat (d), kemudian tentukan panjang GSPL kedua lingkaran tersebut.',
    diagramConfig: {
      type: 'gspl',
      title: 'Dua Lingkaran (R = 15 cm, r = 7 cm, GSPD = 24 cm)',
      params: {
        R: 15,
        r: 7,
        showGSPL: true,
        showGSPD: true,
        labels: { center1: 'P (15 cm)', center2: 'Q (7 cm)', tangent: 'GSPD = 24 cm' }
      }
    },
    type: 'multi_part',
    multiParts: [
      {
        partId: 'a',
        label: 'a. Jarak Antarpusat (d)',
        prompt: 'Tentukan jarak antarpusat kedua lingkaran (d):',
        expectedAnswer: '2√265',
        acceptableAnswers: ['2√265', '2 akar 265', '2sqrt(265)', '2sqrt265', '32.56', '32.558'],
        unit: 'cm'
      },
      {
        partId: 'b',
        label: 'b. Panjang GSPL',
        prompt: 'Tentukan panjang garis singgung persekutuan luar (GSPL):',
        expectedAnswer: '2√249',
        acceptableAnswers: ['2√249', '2 akar 249', '2sqrt(249)', '2sqrt249', '31.56', '31.559'],
        unit: 'cm'
      }
    ],
    expectedAnswer: '2√265 dan 2√249',
    acceptableAnswers: ['2√265, 2√249', '2√265 dan 2√249'],
    hints: [
      'Pertama, cari d dari data GSPD: d = √(GSPD² + (R + r)²).',
      'R + r = 15 + 7 = 22 cm. GSPD = 24 cm. d² = 24² + 22² = 576 + 484 = 1060.',
      'Sederhanakan √1060 = √(4 × 265) = 2√265 cm.',
      'Kedua, cari GSPL: GSPL = √(d² − (R − r)²). Substitusi d² = 1060 dan (R − r) = 15 − 7 = 8.'
    ],
    solutionSteps: [
      {
        title: 'Langkah 1: Menentukan Jarak Antarpusat (d)',
        description: 'Gunakan rumus GSPD: d² = GSPD² + (R + r)²',
        calculation: 'd² = 24² + (15 + 7)² = 576 + 22² = 576 + 484 = 1060.\nd = √1060 = √(4 × 265) = 2√265 cm.'
      },
      {
        title: 'Langkah 2: Menentukan Panjang GSPL',
        description: 'Substitusi nilai d² = 1060 ke rumus GSPL:',
        formula: 'GSPL = √(d² − (R − r)²)'
      },
      {
        title: 'Langkah 3: Perhitungan GSPL',
        description: 'R − r = 15 − 7 = 8 cm. Maka:',
        calculation: 'GSPL = √(1060 − 8²) = √(1060 − 64) = √996 = √(4 × 249) = 2√249 cm.'
      }
    ],
    finalAnswerFormatted: 'a. d = 2√265 cm, b. GSPL = 2√249 cm',
    baseScore: 200,
    xpReward: 250,
    crystalReward: 40
  },

  // ==========================================
  // PLANET 2: ANGULARIS (Sudut & Segiempat)
  // ==========================================
  {
    id: 'ang-01',
    planetId: 'angularis',
    questionNumber: 1,
    title: 'Kubah Navigasi Busur AB',
    difficulty: 'Medium',
    topic: 'Sudut Pusat & Sudut Keliling',
    questionText: 'Sudut pusat ∠AOB adalah 100°. Tentukan sudut keliling ∠ACB yang menghadap busur AB yang sama.',
    diagramConfig: {
      type: 'central_inscribed',
      title: 'Sudut Pusat ∠AOB = 100° dan Sudut Keliling ∠ACB',
      params: {
        centralAngle: 100,
        inscribedAngle: 50,
        labels: { center: 'O', arc: 'Busur AB', central: '∠AOB = 100°', inscribed: '∠ACB = ?' }
      }
    },
    type: 'multiple_choice',
    choices: [
      { id: 'a', label: '25°', isCorrect: false, explanation: 'Terlalu kecil, bukan seperempat sudut pusat.' },
      { id: 'b', label: '50°', isCorrect: true, explanation: 'Tepat! Sudut keliling = 1/2 × Sudut pusat = 1/2 × 100° = 50°.' },
      { id: 'c', label: '100°', isCorrect: false, explanation: 'Itu adalah besar sudut pusat.' },
      { id: 'd', label: '200°', isCorrect: false, explanation: 'Sudut keliling lebih kecil dari sudut pusat, bukan dua kalinya.' }
    ],
    expectedAnswer: '50',
    acceptableAnswers: ['50', '50°', '50 derajat'],
    unit: '°',
    hints: [
      'Gunakan teorema sudut lingkaran: Besar sudut keliling sama dengan setengah dari sudut pusat yang menghadap busur sama.',
      'Sudut Keliling = 1/2 × Sudut Pusat.',
      'Hitung 1/2 × 100°.'
    ],
    solutionSteps: [
      {
        title: 'Langkah 1: Konsep Dasar Teorema Sudut',
        description: 'Jika sudut pusat dan sudut keliling menghadap busur yang sama, maka berlaku hubungan:',
        formula: 'Sudut Keliling = 1/2 × Sudut Pusat'
      },
      {
        title: 'Langkah 2: Kalkulasi',
        description: 'Diketahui sudut pusat ∠AOB = 100°:',
        calculation: '∠ACB = 1/2 × 100° = 50°.'
      }
    ],
    finalAnswerFormatted: '50°',
    baseScore: 100,
    xpReward: 120,
    crystalReward: 15
  },
  {
    id: 'ang-02',
    planetId: 'angularis',
    questionNumber: 2,
    title: 'Transmisi Dua Sudut Keliling',
    difficulty: 'Medium',
    topic: 'Sudut Keliling Menghadap Busur Sama',
    questionText: 'Dua sudut keliling menghadap busur yang sama pada sebuah lingkaran. Sudut pertama besarnya adalah 38°. Tentukan besar sudut kedua.',
    diagramConfig: {
      type: 'central_inscribed',
      title: 'Dua Sudut Keliling Menghadap Busur Sama (38°)',
      params: {
        centralAngle: 76,
        inscribedAngle: 38,
        secondInscribedAngle: 38,
        labels: { center: 'O', arc: 'Busur Sama', angle1: '38°', angle2: '?' }
      }
    },
    type: 'multiple_choice',
    choices: [
      { id: 'a', label: '19°', isCorrect: false, explanation: 'Salah membagi dua.' },
      { id: 'b', label: '38°', isCorrect: true, explanation: 'Tepat! Semua sudut keliling yang menghadap busur yang sama memiliki besar yang sama.' },
      { id: 'c', label: '76°', isCorrect: false, explanation: '76° adalah besar sudut pusatnya (2 × 38°).' },
      { id: 'd', label: '142°', isCorrect: false, explanation: 'Salah menghitung sudut pelurus.' }
    ],
    expectedAnswer: '38',
    acceptableAnswers: ['38', '38°', '38 derajat'],
    unit: '°',
    hints: [
      'Ingat sifat dasar sudut keliling lingkaran.',
      'Semua sudut keliling yang menghadap busur yang sama mempunyai besar sudut yang sama persis.',
      'Karena sudut pertama 38°, maka sudut kedua juga...'
    ],
    solutionSteps: [
      {
        title: 'Langkah 1: Karakteristik Sudut Keliling',
        description: 'Berdasarkan sifat geometri lingkaran: "Besar sudut-sudut keliling yang menghadap busur yang sama adalah SAMA BESAR."',
        formula: '∠Keliling₁ = ∠Keliling₂ (menghadap busur yang sama)'
      },
      {
        title: 'Langkah 2: Kesimpulan Perhitungan',
        description: 'Karena sudut keliling pertama adalah 38° dan sudut keliling kedua menghadap busur yang sama persis, maka besar sudut kedua = 38°.',
        calculation: '∠Kedua = ∠Pertama = 38°.'
      }
    ],
    finalAnswerFormatted: '38°',
    baseScore: 100,
    xpReward: 120,
    crystalReward: 15
  },
  {
    id: 'ang-03',
    planetId: 'angularis',
    questionNumber: 3,
    title: 'Persamaan Aljabar Sudut Orbit',
    difficulty: 'Hard',
    topic: 'Aljabar Relasi Sudut Pusat & Keliling',
    questionText: 'Sebuah sudut keliling dinyatakan dengan (3x + 5)°. Sudut pusat yang menghadap busur sama dinyatakan dengan (8x − 10)°. Tentukan nilai x, besar sudut keliling, dan besar sudut pusat.',
    diagramConfig: {
      type: 'central_inscribed',
      title: 'Sudut Pusat (8x - 10)° & Sudut Keliling (3x + 5)°',
      params: {
        centralAngle: 70,
        inscribedAngle: 35,
        labels: { center: 'O', central: '(8x - 10)°', inscribed: '(3x + 5)°' }
      }
    },
    type: 'multi_part',
    multiParts: [
      {
        partId: 'a',
        label: 'Nilai x',
        prompt: 'Nilai variabel x:',
        expectedAnswer: '10',
        acceptableAnswers: ['10', 'x=10', 'x = 10'],
        unit: ''
      },
      {
        partId: 'b',
        label: 'Sudut Keliling',
        prompt: 'Besar sudut keliling:',
        expectedAnswer: '35',
        acceptableAnswers: ['35', '35°', '35 derajat'],
        unit: '°'
      },
      {
        partId: 'c',
        label: 'Sudut Pusat',
        prompt: 'Besar sudut pusat:',
        expectedAnswer: '70',
        acceptableAnswers: ['70', '70°', '70 derajat'],
        unit: '°'
      }
    ],
    expectedAnswer: 'x = 10, Sudut keliling = 35°, Sudut pusat = 70°',
    acceptableAnswers: ['10, 35, 70', 'x=10, 35, 70', '10, 35°, 70°'],
    hints: [
      'Gunakan persamaan: Sudut Pusat = 2 × (Sudut Keliling).',
      'Bentuk aljabar: 8x − 10 = 2(3x + 5).',
      'Jabarkan ruas kanan: 8x − 10 = 6x + 10. Pindahkan suku bervariabel ke ruas kiri: 8x − 6x = 10 + 10.'
    ],
    solutionSteps: [
      {
        title: 'Langkah 1: Menyusun Persamaan',
        description: 'Karena Sudut Pusat = 2 × Sudut Keliling:',
        formula: '8x − 10 = 2(3x + 5)'
      },
      {
        title: 'Langkah 2: Menentukan Nilai x',
        description: 'Selesaikan persamaan linear satu variabel:',
        calculation: '8x − 10 = 6x + 10\n8x − 6x = 10 + 10\n2x = 20\nx = 10.'
      },
      {
        title: 'Langkah 3: Menghitung Besar Sudut',
        description: 'Substitusi nilai x = 10:',
        calculation: 'Sudut keliling = 3(10) + 5 = 30 + 5 = 35°.\nSudut pusat = 8(10) − 10 = 80 − 10 = 70°.\n(Verifikasi: 70° = 2 × 35°, konsisten!).'
      }
    ],
    finalAnswerFormatted: 'x = 10, Sudut keliling = 35°, Sudut pusat = 70°',
    baseScore: 160,
    xpReward: 200,
    crystalReward: 30
  },
  {
    id: 'ang-04',
    planetId: 'angularis',
    questionNumber: 4,
    title: 'Keseimbangan Segiempat Siklik ABCD',
    difficulty: 'Hard',
    topic: 'Segiempat Tali Busur',
    questionText: 'ABCD merupakan segiempat tali busur pada medan pelindung. Sudut ∠A = (2x + 15)° dan sudut ∠C = (3x + 5)°. Tentukan nilai x, besar sudut ∠A, dan besar sudut ∠C.',
    diagramConfig: {
      type: 'cyclic_quad',
      title: 'Segiempat Tali Busur ABCD (∠A berhadapan dengan ∠C)',
      params: {
        angleA: 79,
        angleC: 101,
        labels: { A: 'A (2x+15)°', B: 'B', C: 'C (3x+5)°', D: 'D' }
      }
    },
    type: 'multi_part',
    multiParts: [
      {
        partId: 'a',
        label: 'Nilai x',
        prompt: 'Nilai variabel x:',
        expectedAnswer: '32',
        acceptableAnswers: ['32', 'x=32', 'x = 32'],
        unit: ''
      },
      {
        partId: 'b',
        label: 'Besar Sudut A',
        prompt: 'Besar sudut ∠A:',
        expectedAnswer: '79',
        acceptableAnswers: ['79', '79°', '79 derajat'],
        unit: '°'
      },
      {
        partId: 'c',
        label: 'Besar Sudut C',
        prompt: 'Besar sudut ∠C:',
        expectedAnswer: '101',
        acceptableAnswers: ['101', '101°', '101 derajat'],
        unit: '°'
      }
    ],
    expectedAnswer: 'x = 32, Sudut A = 79°, Sudut C = 101°',
    acceptableAnswers: ['32, 79, 101', 'x=32, 79, 101', '32, 79°, 101°'],
    hints: [
      'Titik A dan C adalah dua sudut yang saling berhadapan pada segiempat tali busur ABCD.',
      'Sifat penting: Jumlah dua sudut yang saling berhadapan pada segiempat tali busur adalah 180°.',
      'Persamaan: (2x + 15) + (3x + 5) = 180.'
    ],
    solutionSteps: [
      {
        title: 'Langkah 1: Teorema Sudut Segiempat Tali Busur',
        description: 'Dua sudut yang saling berhadapan berjumlah 180°:',
        formula: '∠A + ∠C = 180°'
      },
      {
        title: 'Langkah 2: Menentukan Nilai x',
        description: 'Jumlahkan bentuk aljabarnya:',
        calculation: '(2x + 15) + (3x + 5) = 180\n5x + 20 = 180\n5x = 160\nx = 32.'
      },
      {
        title: 'Langkah 3: Substitusi ke Sudut A dan C',
        description: 'Hitung masing-masing sudut:',
        calculation: '∠A = 2(32) + 15 = 64 + 15 = 79°.\n∠C = 3(32) + 5 = 96 + 5 = 101°.\n(Verifikasi: 79° + 101° = 180°, tepat!).'
      }
    ],
    finalAnswerFormatted: 'x = 32, ∠A = 79°, ∠C = 101°',
    baseScore: 160,
    xpReward: 200,
    crystalReward: 30
  },
  {
    id: 'ang-05',
    planetId: 'angularis',
    questionNumber: 5,
    title: 'Dual Sensor Busur Besar AB',
    difficulty: 'Challenging',
    topic: 'Relasi Dua Sudut Keliling & Sudut Pusat',
    questionText: 'Sudut pusat ∠AOB adalah 144°. Titik C dan D berada pada busur besar AB dan masing-masing sudut ∠ACB serta ∠ADB menghadap busur kecil AB. Tentukan besar kedua sudut keliling tersebut.',
    diagramConfig: {
      type: 'central_inscribed',
      title: 'Sudut Pusat ∠AOB = 144° & Sudut Keliling ∠ACB, ∠ADB',
      params: {
        centralAngle: 144,
        inscribedAngle: 72,
        secondInscribedAngle: 72,
        labels: { center: 'O (144°)', inscribed: 'C (72°)', secondInscribed: 'D (72°)', arc: 'Busur kecil AB' }
      }
    },
    type: 'multiple_choice',
    choices: [
      { id: 'a', label: '∠ACB = 72° dan ∠ADB = 72°', isCorrect: true, explanation: 'Tepat! Keduanya sudut keliling menghadap busur sama: 144° / 2 = 72°.' },
      { id: 'b', label: '∠ACB = 72° dan ∠ADB = 108°', isCorrect: false, explanation: 'Keduanya menghadap busur kecil yang sama, sehingga harus sama besar.' },
      { id: 'c', label: '∠ACB = 36° dan ∠ADB = 36°', isCorrect: false, explanation: 'Salah membagi (144 / 4 bukan 144 / 2).' },
      { id: 'd', label: '∠ACB = 144° dan ∠ADB = 144°', isCorrect: false, explanation: 'Sudut keliling tidak sama dengan sudut pusat.' }
    ],
    expectedAnswer: '∠ACB = 72° dan ∠ADB = 72°',
    acceptableAnswers: ['72 dan 72', '72, 72', '72° dan 72°', '72', '72°'],
    unit: '°',
    hints: [
      'Perhatikan bahwa kedua titik C dan D berada pada busur besar, sehingga sudut ∠ACB dan ∠ADB sama-sama menghadap busur kecil AB.',
      'Sudut keliling = 1/2 × Sudut pusat.',
      'Hitung 1/2 × 144°.'
    ],
    solutionSteps: [
      {
        title: 'Langkah 1: Analisis Busur yang Dihadapi',
        description: 'Titik C dan D berada pada busur besar AB, menghadap busur kecil AB yang sama. Sudut pusat yang menghadap busur tersebut adalah ∠AOB = 144°.'
      },
      {
        title: 'Langkah 2: Menghitung Sudut Keliling ∠ACB',
        description: 'Terapkan rumus sudut keliling:',
        calculation: '∠ACB = 1/2 × ∠AOB = 1/2 × 144° = 72°.'
      },
      {
        title: 'Langkah 3: Menghitung Sudut Keliling ∠ADB',
        description: 'Karena ∠ADB juga menghadap busur yang sama persis:',
        calculation: '∠ADB = ∠ACB = 72°.\nJadi kedua sudut keliling tersebut besarnya sama yaitu 72°.'
      }
    ],
    finalAnswerFormatted: '∠ACB = 72° dan ∠ADB = 72°',
    baseScore: 180,
    xpReward: 220,
    crystalReward: 35
  },

  // ==========================================
  // PLANET 3: ARCADIA (Busur & Juring)
  // ==========================================
  {
    id: 'arc-01',
    planetId: 'arcadia',
    questionNumber: 1,
    title: 'Lengkungan Busur Koridor Emas',
    difficulty: 'Medium',
    topic: 'Panjang Busur Lingkaran',
    questionText: 'Lingkaran berjari-jari 14 cm memiliki sudut pusat 90°. Tentukan panjang busurnya.',
    diagramConfig: {
      type: 'arc_sector',
      title: 'Busur Lingkaran (r = 14 cm, θ = 90°)',
      params: {
        radius: 14,
        centralAngle: 90,
        arcLength: 22,
        labels: { center: 'O', radius: 'r = 14 cm', angle: '90°', arc: 's = 22 cm' }
      }
    },
    type: 'multiple_choice',
    choices: [
      { id: 'a', label: '11 cm', isCorrect: false, explanation: 'Salah mengalikan keliling.' },
      { id: 'b', label: '22 cm', isCorrect: true, explanation: 'Tepat! s = (90/360) × 2 × (22/7) × 14 = 1/4 × 88 = 22 cm.' },
      { id: 'c', label: '44 cm', isCorrect: false, explanation: '44 cm adalah setengah keliling lingkaran.' },
      { id: 'd', label: '88 cm', isCorrect: false, explanation: '88 cm adalah keliling total lingkaran.' }
    ],
    expectedAnswer: '22',
    acceptableAnswers: ['22', '22 cm', '22cm'],
    unit: 'cm',
    hints: [
      'Gunakan konsep panjang busur lingkaran: perbandingan sudut pusat terhadap satu putaran penuh 360°.',
      'Sederhanakan rasio sudut pusat terlebih dahulu: 90°/360°.',
      'Kalikan rasio sudut tersebut dengan keliling lingkaran penuh berdasarkan nilai jari-jari yang diketahui.'
    ],
    solutionSteps: [
      {
        title: 'Langkah 1: Identifikasi Data',
        description: 'r = 14 cm, θ = 90°.'
      },
      {
        title: 'Langkah 2: Rumus Panjang Busur',
        description: 'Gunakan perbandingan sudut dengan satu putaran penuh:',
        formula: 's = (θ / 360°) × 2πr'
      },
      {
        title: 'Langkah 3: Perhitungan',
        description: 'Substitusi nilai:',
        calculation: 's = (90° / 360°) × 2 × (22 / 7) × 14\ns = (1 / 4) × 88\ns = 22 cm.'
      }
    ],
    finalAnswerFormatted: '22 cm',
    baseScore: 100,
    xpReward: 120,
    crystalReward: 15
  },
  {
    id: 'arc-02',
    planetId: 'arcadia',
    questionNumber: 2,
    title: 'Sektor Kolektor Surya Arcadia',
    difficulty: 'Medium',
    topic: 'Luas Juring Lingkaran',
    questionText: 'Lingkaran berjari-jari 21 cm memiliki sudut pusat 120°. Tentukan luas juringnya.',
    diagramConfig: {
      type: 'arc_sector',
      title: 'Juring Lingkaran (r = 21 cm, θ = 120°)',
      params: {
        radius: 21,
        centralAngle: 120,
        sectorArea: 462,
        labels: { center: 'O', radius: 'r = 21 cm', angle: '120°', area: 'A = 462 cm²' }
      }
    },
    type: 'multiple_choice',
    choices: [
      { id: 'a', label: '308 cm²', isCorrect: false, explanation: 'Salah menyederhanakan rasio sudut atau luas lingkaran.' },
      { id: 'b', label: '462 cm²', isCorrect: true, explanation: 'Tepat! Luas juring = (120/360) × (22/7) × 21² = 1/3 × 1386 = 462 cm².' },
      { id: 'c', label: '693 cm²', isCorrect: false, explanation: '693 cm² adalah setengah dari luas total.' },
      { id: 'd', label: '1.386 cm²', isCorrect: false, explanation: '1386 cm² adalah luas total lingkaran.' }
    ],
    expectedAnswer: '462',
    acceptableAnswers: ['462', '462 cm2', '462 cm²', '462cm2'],
    unit: 'cm²',
    hints: [
      'Gunakan konsep luas juring lingkaran yang sebanding dengan sudut pusat terhadap 360°.',
      'Sederhanakan rasio sudut pusat: 120°/360°.',
      'Hitung luas lingkaran penuh terlebih dahulu, kemudian kalikan dengan rasio sudut tersebut.'
    ],
    solutionSteps: [
      {
        title: 'Langkah 1: Identifikasi Data',
        description: 'r = 21 cm, θ = 120°.'
      },
      {
        title: 'Langkah 2: Rumus Luas Juring',
        description: 'Terapkan perbandingan sudut lingkaran:',
        formula: 'A = (θ / 360°) × πr²'
      },
      {
        title: 'Langkah 3: Perhitungan',
        description: 'Substitusi ke dalam persamaan:',
        calculation: 'A = (120° / 360°) × (22 / 7) × 21²\nA = (1 / 3) × (22 / 7) × 441\nA = (1 / 3) × 1386 = 462 cm².'
      }
    ],
    finalAnswerFormatted: '462 cm²',
    baseScore: 100,
    xpReward: 120,
    crystalReward: 15
  },
  {
    id: 'arc-03',
    planetId: 'arcadia',
    questionNumber: 3,
    title: 'Rekonstruksi Sudut dari Luas Juring',
    difficulty: 'Hard',
    topic: 'Mencari Sudut Pusat dari Luas Juring',
    questionText: 'Luas juring adalah 154 cm² dan jari-jari lingkaran 14 cm. Tentukan besar sudut pusatnya.',
    diagramConfig: {
      type: 'arc_sector',
      title: 'Mencari Sudut Pusat θ (A = 154 cm², r = 14 cm)',
      params: {
        radius: 14,
        sectorArea: 154,
        centralAngle: 90,
        labels: { center: 'O', radius: 'r = 14 cm', area: '154 cm²', angle: 'θ = ?' }
      }
    },
    type: 'multiple_choice',
    choices: [
      { id: 'a', label: '60°', isCorrect: false, explanation: '60° akan menghasilkan luas juring ≈ 102.67 cm².' },
      { id: 'b', label: '75°', isCorrect: false, explanation: 'Bukan 75°.' },
      { id: 'c', label: '90°', isCorrect: true, explanation: 'Tepat! Luas lingkaran = 616 cm². Rasio = 154/616 = 1/4. Sudut = 1/4 × 360° = 90°.' },
      { id: 'd', label: '120°', isCorrect: false, explanation: '120° menghasilkan sepertiga luas lingkaran (205.33 cm²).' }
    ],
    expectedAnswer: '90',
    acceptableAnswers: ['90', '90°', '90 derajat'],
    unit: '°',
    hints: [
      'Hitung luas lingkaran penuh terlebih dahulu menggunakan jari-jari yang diketahui.',
      'Gunakan perbandingan luas: θ / 360° = Luas Juring / Luas Lingkaran Penuh.',
      'Tentukan besar sudut pusat θ dari perbandingan rasio yang didapatkan.'
    ],
    solutionSteps: [
      {
        title: 'Langkah 1: Menghitung Luas Total Lingkaran',
        description: 'Gunakan jari-jari r = 14 cm:',
        calculation: 'L_lingkaran = πr² = (22 / 7) × 14² = (22 / 7) × 196 = 616 cm².'
      },
      {
        title: 'Langkah 2: Hubungan Luas Juring dan Sudut Pusat',
        description: 'Terapkan perbandingan sudut:',
        formula: 'θ = (Luas Juring / L_lingkaran) × 360°'
      },
      {
        title: 'Langkah 3: Perhitungan Sudut Pusat',
        description: 'Substitusi nilai luas juring 154 cm²:',
        calculation: 'θ = (154 / 616) × 360° = (1 / 4) × 360° = 90°.'
      }
    ],
    finalAnswerFormatted: '90°',
    baseScore: 150,
    xpReward: 180,
    crystalReward: 25
  },
  {
    id: 'arc-04',
    planetId: 'arcadia',
    questionNumber: 4,
    title: 'Sensor Kalibrasi Busur Melingkar',
    difficulty: 'Hard',
    topic: 'Mencari Sudut Pusat dari Panjang Busur',
    questionText: 'Sebuah lingkaran berjari-jari 28 cm memiliki panjang busur 44 cm. Tentukan besar sudut pusatnya.',
    diagramConfig: {
      type: 'arc_sector',
      title: 'Mencari Sudut Pusat θ (r = 28 cm, s = 44 cm)',
      params: {
        radius: 28,
        arcLength: 44,
        centralAngle: 90,
        labels: { center: 'O', radius: 'r = 28 cm', arc: 's = 44 cm', angle: 'θ = ?' }
      }
    },
    type: 'multiple_choice',
    choices: [
      { id: 'a', label: '45°', isCorrect: false, explanation: '45° menghasilkan panjang busur 22 cm.' },
      { id: 'b', label: '60°', isCorrect: false, explanation: '60° menghasilkan panjang busur ≈ 29.33 cm.' },
      { id: 'c', label: '90°', isCorrect: true, explanation: 'Tepat! Keliling = 2 × (22/7) × 28 = 176 cm. Sudut = (44/176) × 360° = 1/4 × 360° = 90°.' },
      { id: 'd', label: '120°', isCorrect: false, explanation: '120° menghasilkan panjang busur ≈ 58.67 cm.' }
    ],
    expectedAnswer: '90',
    acceptableAnswers: ['90', '90°', '90 derajat'],
    unit: '°',
    hints: [
      'Hitung keliling lingkaran penuh terlebih dahulu menggunakan jari-jari yang diketahui.',
      'Gunakan perbandingan panjang busur terhadap keliling lingkaran: θ / 360° = s / K.',
      'Tentukan besar sudut pusat θ dengan mengalikan perbandingan tersebut dengan 360°.'
    ],
    solutionSteps: [
      {
        title: 'Langkah 1: Menghitung Keliling Lingkaran Penuh',
        description: 'Dengan r = 28 cm:',
        calculation: 'Keliling = 2πr = 2 × (22 / 7) × 28 = 176 cm.'
      },
      {
        title: 'Langkah 2: Menghubungkan Panjang Busur dengan Sudut',
        description: 'Rumus perbandingan busur dan keliling:',
        formula: 'θ = (Panjang Busur / Keliling) × 360°'
      },
      {
        title: 'Langkah 3: Perhitungan Numerik',
        description: 'Substitusi panjang busur 44 cm:',
        calculation: 'θ = (44 / 176) × 360° = (1 / 4) × 360° = 90°.'
      }
    ],
    finalAnswerFormatted: '90°',
    baseScore: 150,
    xpReward: 180,
    crystalReward: 25
  },
  {
    id: 'arc-05',
    planetId: 'arcadia',
    questionNumber: 5,
    title: 'Misi Orbit Eksplorasi Arcadia Prime',
    difficulty: 'Challenging',
    topic: 'Kombinasi Busur & Juring Skala Astronomis',
    questionText: 'Sebuah wahana antariksa mengorbit planet Arcadia dengan jari-jari lintasan 42 km dan sudut pusat 120°. Tentukan panjang busur lintasan dan luas juring sektor orbit tersebut.',
    diagramConfig: {
      type: 'arc_sector',
      title: 'Orbit Wahana Antariksa (r = 42 km, θ = 120°)',
      params: {
        radius: 42,
        centralAngle: 120,
        arcLength: 88,
        sectorArea: 1848,
        labels: { center: 'Arcadia Prime', radius: 'r = 42 km', angle: '120°', arc: 's = 88 km', area: 'A = 1.848 km²' }
      }
    },
    type: 'multi_part',
    multiParts: [
      {
        partId: 'a',
        label: 'a. Panjang Busur Lintasan',
        prompt: 'Panjang busur lintasan wahana (km):',
        expectedAnswer: '88',
        acceptableAnswers: ['88', '88 km', '88km'],
        unit: 'km'
      },
      {
        partId: 'b',
        label: 'b. Luas Juring Sektor Orbit',
        prompt: 'Luas juring sektor orbit (km²):',
        expectedAnswer: '1848',
        acceptableAnswers: ['1848', '1.848', '1,848', '1848 km2', '1848 km²', '1.848 km²'],
        unit: 'km²'
      }
    ],
    expectedAnswer: 'Panjang busur = 88 km, Luas juring = 1.848 km²',
    acceptableAnswers: ['88 dan 1848', '88, 1848', '88, 1.848', '88 km dan 1848 km²'],
    hints: [
      'Gunakan sudut pusat θ = 120°, sehingga perbandingannya adalah 120°/360°.',
      'Panjang busur diperoleh dari perbandingan sudut dikalikan keliling lingkaran penuh.',
      'Luas juring diperoleh dari perbandingan sudut dikalikan luas lingkaran penuh.'
    ],
    solutionSteps: [
      {
        title: 'Langkah 1: Menghitung Panjang Busur Lintasan',
        description: 'Terapkan rumus panjang busur dengan r = 42 km dan θ = 120°:',
        formula: 's = (θ / 360°) × 2πr',
        calculation: 's = (120° / 360°) × 2 × (22 / 7) × 42\ns = (1 / 3) × 264 = 88 km.'
      },
      {
        title: 'Langkah 2: Menghitung Luas Juring Sektor Orbit',
        description: 'Terapkan rumus luas juring:',
        formula: 'A = (θ / 360°) × πr²',
        calculation: 'A = (120° / 360°) × (22 / 7) × 42²\nA = (1 / 3) × (22 / 7) × 1764\nA = (1 / 3) × 5544 = 1.848 km².'
      }
    ],
    finalAnswerFormatted: 'a. s = 88 km, b. A = 1.848 km²',
    baseScore: 200,
    xpReward: 250,
    crystalReward: 40
  },

  // ==========================================
  // PLANET 4: NEXUS (Sintesis & Gabungan)
  // ==========================================
  {
    id: 'nex-01',
    planetId: 'nexus',
    questionNumber: 1,
    title: 'Konvergensi GSPL Anomali Nexus',
    difficulty: 'Medium',
    topic: 'GSPL Gabungan Lingkaran Nexus',
    questionText: 'Dua stasiun lingkaran di Nexus berjari-jari 5 cm dan 3 cm memiliki jarak antarpusat 10 cm. Tentukan panjang GSPL kedua lingkaran tersebut.',
    diagramConfig: {
      type: 'gspl',
      title: 'GSPL Nexus (R = 5 cm, r = 3 cm, d = 10 cm)',
      params: {
        R: 5,
        r: 3,
        d: 10,
        showGSPL: true,
        labels: { center1: 'Stasiun A (5 cm)', center2: 'Stasiun B (3 cm)', tangent: 'GSPL = 4√6 cm' }
      }
    },
    type: 'multiple_choice',
    choices: [
      { id: 'a', label: '4√6 cm', isCorrect: true, explanation: 'Tepat! L = √(10² - (5 - 3)²) = √(100 - 4) = √96 = 4√6 cm.' },
      { id: 'b', label: '8 cm', isCorrect: false, explanation: '8 cm = √64, bukan √96.' },
      { id: 'c', label: '2√24 cm', isCorrect: false, explanation: 'Bentuk belum sederhana (2√24 = 4√6, namun pilihan a adalah bentuk paling sederhana).' },
      { id: 'd', label: '6√2 cm', isCorrect: false, explanation: '6√2 = √72.' }
    ],
    expectedAnswer: '4√6',
    acceptableAnswers: ['4√6', '4 akar 6', '4sqrt(6)', '4sqrt6', '9.8', '9.798'],
    unit: 'cm',
    hints: [
      'Gunakan rumus GSPL: L = √(d² − (R − r)²).',
      'Hitung R − r = 5 − 3 = 2 cm.',
      'L = √(10² − 2²) = √(100 − 4) = √96. Faktorkan 96 = 16 × 6.'
    ],
    solutionSteps: [
      {
        title: 'Langkah 1: Identifikasi Data',
        description: 'R = 5 cm, r = 3 cm, d = 10 cm.'
      },
      {
        title: 'Langkah 2: Terapkan Rumus GSPL',
        description: 'Gunakan rumus garis singgung persekutuan luar:',
        formula: 'L = √(d² − (R − r)²)'
      },
      {
        title: 'Langkah 3: Kalkulasi & Penyederhanaan',
        description: 'Substitusi nilai R, r, dan d ke dalam rumus:',
        calculation: 'L = √(10² − (5 − 3)²) = √(100 − 4) = √96\n√96 = √(16 × 6) = 4√6 cm.'
      }
    ],
    finalAnswerFormatted: '4√6 cm',
    baseScore: 100,
    xpReward: 120,
    crystalReward: 15
  },
  {
    id: 'nex-02',
    planetId: 'nexus',
    questionNumber: 2,
    title: 'Harmonisasi Sudut Transmisi AB',
    difficulty: 'Medium',
    topic: 'Relasi Sudut Pusat & Keliling',
    questionText: 'Sudut pusat yang menghadap busur AB pada inti Nexus adalah 126°. Tentukan besar sudut keliling yang menghadap busur yang sama.',
    diagramConfig: {
      type: 'central_inscribed',
      title: 'Sudut Pusat 126° & Sudut Keliling',
      params: {
        centralAngle: 126,
        inscribedAngle: 63,
        labels: { center: 'O (126°)', inscribed: 'Sudut Keliling = ?', arc: 'Busur AB' }
      }
    },
    type: 'multiple_choice',
    choices: [
      { id: 'a', label: '54°', isCorrect: false, explanation: '54° adalah sudut komplemen, bukan sudut keliling.' },
      { id: 'b', label: '63°', isCorrect: true, explanation: 'Tepat! Sudut keliling = 1/2 × Sudut pusat = 1/2 × 126° = 63°.' },
      { id: 'c', label: '72°', isCorrect: false, explanation: 'Salah hitung pembagian.' },
      { id: 'd', label: '252°', isCorrect: false, explanation: 'Sudut keliling lebih kecil dari sudut pusat.' }
    ],
    expectedAnswer: '63',
    acceptableAnswers: ['63', '63°', '63 derajat'],
    unit: '°',
    hints: [
      'Ingat rumus: Sudut keliling = 1/2 × Sudut pusat.',
      'Kedua sudut menghadap busur AB yang sama.',
      'Hitung 126° / 2.'
    ],
    solutionSteps: [
      {
        title: 'Langkah 1: Konsep Sudut Lingkaran',
        description: 'Jika menghadap busur sama, sudut keliling sama dengan setengah sudut pusat:',
        formula: 'Sudut Keliling = 1/2 × Sudut Pusat'
      },
      {
        title: 'Langkah 2: Perhitungan',
        description: 'Substitusi sudut pusat 126° ke dalam rumus:',
        calculation: 'Sudut Keliling = 1/2 × 126° = 63°.'
      }
    ],
    finalAnswerFormatted: '63°',
    baseScore: 100,
    xpReward: 120,
    crystalReward: 15
  },
  {
    id: 'nex-03',
    planetId: 'nexus',
    questionNumber: 3,
    title: 'Dual Laser Garis Singgung Nexus',
    difficulty: 'Hard',
    topic: 'Kombinasi GSPL & GSPD Bersama',
    questionText: 'Dua lingkaran memiliki jari-jari 7 cm dan 14 cm dengan jarak antarpusat 25 cm. Tentukan panjang GSPL dan panjang GSPD kedua lingkaran tersebut.',
    diagramConfig: {
      type: 'gspl',
      title: 'GSPL & GSPD (R = 14 cm, r = 7 cm, d = 25 cm)',
      params: {
        R: 14,
        r: 7,
        d: 25,
        showGSPL: true,
        showGSPD: true,
        labels: { center1: 'P (14 cm)', center2: 'Q (7 cm)', tangent: 'GSPL = 24 cm, GSPD = 2√46 cm' }
      }
    },
    type: 'multi_part',
    multiParts: [
      {
        partId: 'a',
        label: 'a. Panjang GSPL',
        prompt: 'Panjang Garis Singgung Persekutuan Luar (GSPL):',
        expectedAnswer: '24',
        acceptableAnswers: ['24', '24 cm', '24cm'],
        unit: 'cm'
      },
      {
        partId: 'b',
        label: 'b. Panjang GSPD',
        prompt: 'Panjang Garis Singgung Persekutuan Dalam (GSPD):',
        expectedAnswer: '2√46',
        acceptableAnswers: ['2√46', '2 akar 46', '2sqrt(46)', '2sqrt46', '13.56', '13.564'],
        unit: 'cm'
      }
    ],
    expectedAnswer: 'GSPL = 24 cm, GSPD = 2√46 cm',
    acceptableAnswers: ['24 dan 2√46', '24, 2√46', '24 cm dan 2√46 cm'],
    hints: [
      'Lingkaran besar R = 14 cm, lingkaran kecil r = 7 cm, d = 25 cm.',
      'Untuk GSPL: L = √(d² − (R − r)²) = √(25² − (14 − 7)²) = √(625 − 49) = √576.',
      'Untuk GSPD: L = √(d² − (R + r)²) = √(25² − (14 + 7)²) = √(625 − 21²) = √(625 − 441) = √184 = √(4 × 46).'
    ],
    solutionSteps: [
      {
        title: 'Langkah 1: Menentukan Panjang GSPL',
        description: 'Gunakan selisih jari-jari: R − r = 14 − 7 = 7 cm:',
        formula: 'GSPL = √(d² − (R − r)²) = √(25² − 7²) = √(625 − 49) = √576 = 24 cm.'
      },
      {
        title: 'Langkah 2: Menentukan Panjang GSPD',
        description: 'Gunakan jumlah jari-jari: R + r = 14 + 7 = 21 cm:',
        formula: 'GSPD = √(d² − (R + r)²) = √(25² − 21²) = √(625 − 441) = √184 cm.'
      },
      {
        title: 'Langkah 3: Sederhanakan Bentuk Akar GSPD',
        description: 'Faktorkan bilangan kuadrat terbesar dari 184:',
        calculation: '√184 = √(4 × 46) = 2√46 cm.'
      }
    ],
    finalAnswerFormatted: 'a. GSPL = 24 cm, b. GSPD = 2√46 cm',
    baseScore: 160,
    xpReward: 200,
    crystalReward: 30
  },
  {
    id: 'nex-04',
    planetId: 'nexus',
    questionNumber: 4,
    title: 'Dekripsi Sektor Energi Juring Nexus',
    difficulty: 'Hard',
    topic: 'Kombinasi Sudut Pusat & Panjang Busur dari Luas Juring',
    questionText: 'Luas juring adalah 231 cm² dan jari-jari lingkaran 21 cm. Tentukan besar sudut pusat dan panjang busurnya.',
    diagramConfig: {
      type: 'arc_sector',
      title: 'Juring & Busur (A = 231 cm², r = 21 cm)',
      params: {
        radius: 21,
        sectorArea: 231,
        centralAngle: 60,
        arcLength: 22,
        labels: { center: 'O', radius: 'r = 21 cm', area: '231 cm²', angle: 'θ = 60°', arc: 's = 22 cm' }
      }
    },
    type: 'multi_part',
    multiParts: [
      {
        partId: 'a',
        label: 'a. Besar Sudut Pusat',
        prompt: 'Besar sudut pusat (°):',
        expectedAnswer: '60',
        acceptableAnswers: ['60', '60°', '60 derajat'],
        unit: '°'
      },
      {
        partId: 'b',
        label: 'b. Panjang Busur',
        prompt: 'Panjang busur lingkaran (cm):',
        expectedAnswer: '22',
        acceptableAnswers: ['22', '22 cm', '22cm'],
        unit: 'cm'
      }
    ],
    expectedAnswer: 'Sudut pusat = 60°, Panjang busur = 22 cm',
    acceptableAnswers: ['60 dan 22', '60, 22', '60°, 22 cm'],
    hints: [
      'Hitung luas lingkaran penuh terlebih dahulu untuk menentukan rasio luas juring terhadap luas lingkaran.',
      'Tentukan sudut pusat θ dari rasio luas tersebut dikalikan 360°.',
      'Gunakan sudut pusat yang diperoleh untuk menghitung panjang busur lingkaran.'
    ],
    solutionSteps: [
      {
        title: 'Langkah 1: Menghitung Luas Total Lingkaran',
        description: 'Dengan r = 21 cm:',
        calculation: 'L = πr² = (22 / 7) × 21 × 21 = 22 × 3 × 21 = 1386 cm².'
      },
      {
        title: 'Langkah 2: Menentukan Sudut Pusat',
        description: 'Bandingkan luas juring dengan luas total:',
        calculation: 'θ = (231 / 1386) × 360° = (1 / 6) × 360° = 60°.'
      },
      {
        title: 'Langkah 3: Menentukan Panjang Busur',
        description: 'Terapkan sudut pusat 60° ke rumus panjang busur:',
        calculation: 's = (60° / 360°) × 2 × (22 / 7) × 21 = (1 / 6) × 132 = 22 cm.'
      }
    ],
    finalAnswerFormatted: 'Sudut pusat = 60°, Panjang busur = 22 cm',
    baseScore: 160,
    xpReward: 200,
    crystalReward: 30
  },
  {
    id: 'nex-05',
    planetId: 'nexus',
    questionNumber: 5,
    title: 'Klimaks Nexus: Sintesis Multi-Sistem',
    difficulty: 'Challenging',
    topic: 'Sintesis Lengkap Busur, Juring & GSPL Riset Galaksi',
    questionText: 'Sebuah wahana mengorbit planet dengan jari-jari lintasan 42 km dan sudut pusat 120°. Di area penelitian terdapat dua lingkaran berjari-jari 10 km dan 6 km dengan jarak antarpusat 26 km. Tentukan: (a) panjang busur lintasan wahana, (b) luas juring wahana, dan (c) panjang GSPL kedua lingkaran riset.',
    diagramConfig: {
      type: 'orbit_complex',
      title: 'Sintesis Galaksi: Orbit Wahana (r = 42 km) & Dua Lingkaran Riset (10 km & 6 km)',
      params: {
        radius: 42,
        centralAngle: 120,
        arcLength: 88,
        sectorArea: 1848,
        R: 10,
        r: 6,
        d: 26,
        showGSPL: true,
        labels: { arc: 's = 88 km', area: '1.848 km²', tangent: 'GSPL = 2√165 km' }
      }
    },
    type: 'multi_part',
    multiParts: [
      {
        partId: 'a',
        label: 'a. Panjang Busur Orbit',
        prompt: 'Panjang busur lintasan wahana (km):',
        expectedAnswer: '88',
        acceptableAnswers: ['88', '88 km', '88km'],
        unit: 'km'
      },
      {
        partId: 'b',
        label: 'b. Luas Juring Orbit',
        prompt: 'Luas juring lintasan wahana (km²):',
        expectedAnswer: '1848',
        acceptableAnswers: ['1848', '1.848', '1,848', '1848 km2', '1848 km²', '1.848 km²'],
        unit: 'km²'
      },
      {
        partId: 'c',
        label: 'c. Panjang GSPL Dua Lingkaran',
        prompt: 'Panjang GSPL stasiun riset (km):',
        expectedAnswer: '2√165',
        acceptableAnswers: ['2√165', '2 akar 165', '2sqrt(165)', '2sqrt165', '25.69', '25.690'],
        unit: 'km'
      }
    ],
    expectedAnswer: 'a. Panjang busur = 88 km, b. Luas juring = 1.848 km², c. GSPL = 2√165 km',
    acceptableAnswers: ['88, 1848, 2√165', '88, 1.848, 2√165', '88 km, 1848 km2, 2√165 km'],
    hints: [
      'Bagian (a): Gunakan perbandingan sudut pusat 120°/360° dikalikan keliling lingkaran wahana.',
      'Bagian (b): Gunakan perbandingan sudut pusat 120°/360° dikalikan luas lingkaran wahana.',
      'Bagian (c): Hitung panjang garis singgung persekutuan luar (GSPL) menggunakan selisih jari-jari dan jarak antar-pusat wahana.'
    ],
    solutionSteps: [
      {
        title: 'Langkah 1: Menghitung Panjang Busur Wahana',
        description: 'Dengan r = 42 km dan θ = 120°:',
        calculation: 's = (120° / 360°) × 2 × (22 / 7) × 42 = (1 / 3) × 264 = 88 km.'
      },
      {
        title: 'Langkah 2: Menghitung Luas Juring Wahana',
        description: 'Terapkan rumus luas juring:',
        calculation: 'A = (120° / 360°) × (22 / 7) × 42² = (1 / 3) × 5544 = 1.848 km².'
      },
      {
        title: 'Langkah 3: Menghitung GSPL Lingkaran Riset',
        description: 'Dengan R = 10 km, r = 6 km, dan d = 26 km:',
        formula: 'GSPL = √(d² − (R − r)²)',
        calculation: 'GSPL = √(26² − (10 − 6)²) = √(676 − 4²) = √(676 − 16) = √660 km.\n√660 = √(4 × 165) = 2√165 km.'
      }
    ],
    finalAnswerFormatted: 'a. s = 88 km, b. A = 1.848 km², c. GSPL = 2√165 km',
    baseScore: 250,
    xpReward: 300,
    crystalReward: 50
  }
];
