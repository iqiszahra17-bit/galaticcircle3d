import { describe, it, expect } from 'vitest';
import {
  calculateGSPL,
  calculateGSPD,
  calculateCenterDistanceFromGSPL,
  calculateCenterDistanceFromGSPD,
  calculateInscribedAngle,
  calculateCentralAngle,
  calculateArcLength,
  calculateSectorArea,
} from '../math/circleMath';
import { validateMathAnswer, normalizeAnswerString, evaluateRadicalOrNumber } from '../math/answerValidator';
import { sanitizeCSVCell } from '../services/csvExporter';
import { QUESTIONS } from '../data/questions';
import { PLANETS } from '../data/planets';

describe('1. Validasi Matematika 4 Planet (20 Soal)', () => {
  it('Harus memiliki tepat 4 planet', () => {
    expect(PLANETS.length).toBe(4);
    expect(PLANETS.map((p) => p.id)).toEqual(['tangensia', 'angularis', 'arcadia', 'nexus']);
  });

  it('Harus memiliki tepat 20 soal utama (5 soal per planet)', () => {
    expect(QUESTIONS.length).toBe(20);
    const countByPlanet = QUESTIONS.reduce((acc, q) => {
      acc[q.planetId] = (acc[q.planetId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    expect(countByPlanet['tangensia']).toBe(5);
    expect(countByPlanet['angularis']).toBe(5);
    expect(countByPlanet['arcadia']).toBe(5);
    expect(countByPlanet['nexus']).toBe(5);
  });

  describe('Planet 1: Tangensia (GSPL & GSPD)', () => {
    it('Soal 1: R=10, r=4, d=10 => GSPL = 8 cm', () => {
      const gspl = calculateGSPL(10, 10, 4);
      expect(gspl).toBe(8);
      const val = validateMathAnswer('8 cm', '8');
      expect(val.isCorrect).toBe(true);
    });

    it('Soal 2: R=8, r=3, d=13 => GSPD = 4√3 cm (√48)', () => {
      const gspd = calculateGSPD(13, 8, 3);
      expect(Math.round(gspd * 1000) / 1000).toBe(Math.round(4 * Math.sqrt(3) * 1000) / 1000);
      const val = validateMathAnswer('4√3', '4√3', ['4 akar 3', '6.93']);
      expect(val.isCorrect).toBe(true);
    });

    it('Soal 3: R=13, r=5, d=17 => GSPL = 15 cm', () => {
      const gspl = calculateGSPL(17, 13, 5);
      expect(gspl).toBe(15);
    });

    it('Soal 4: R=10, r=6, GSPL=24 => d = 4√37 cm (√592)', () => {
      const d = calculateCenterDistanceFromGSPL(24, 10, 6);
      expect(Math.round(d * 1000) / 1000).toBe(Math.round(4 * Math.sqrt(37) * 1000) / 1000);
    });

    it('Soal 5: R=15, r=7, GSPD=24 => d = 2√265, GSPL = 2√249', () => {
      const d = calculateCenterDistanceFromGSPD(24, 15, 7);
      expect(Math.round(d * 1000) / 1000).toBe(Math.round(2 * Math.sqrt(265) * 1000) / 1000);
      const gspl = calculateGSPL(d, 15, 7);
      expect(Math.round(gspl * 1000) / 1000).toBe(Math.round(2 * Math.sqrt(249) * 1000) / 1000);
    });
  });

  describe('Planet 2: Angularis (Sudut & Segiempat)', () => {
    it('Soal 1: Sudut pusat 100° => Sudut keliling = 50°', () => {
      expect(calculateInscribedAngle(100)).toBe(50);
    });

    it('Soal 2: Sudut pertama 38° => Sudut kedua menghadap busur sama = 38°', () => {
      expect(calculateInscribedAngle(calculateCentralAngle(38))).toBe(38);
    });

    it('Soal 3: (8x - 10) = 2(3x + 5) => x = 10, Keliling = 35°, Pusat = 70°', () => {
      const x = (10 + 10) / (8 - 6);
      expect(x).toBe(10);
      const keliling = 3 * x + 5;
      const pusat = 8 * x - 10;
      expect(keliling).toBe(35);
      expect(pusat).toBe(70);
      expect(pusat).toBe(2 * keliling);
    });

    it('Soal 4: (2x + 15) + (3x + 5) = 180 => x = 32, ∠A = 79°, ∠C = 101°', () => {
      const x = (180 - 20) / 5;
      expect(x).toBe(32);
      const angleA = 2 * x + 15;
      const angleC = 3 * x + 5;
      expect(angleA).toBe(79);
      expect(angleC).toBe(101);
      expect(angleA + angleC).toBe(180);
    });

    it('Soal 5: Sudut pusat 144° => Sudut ACB = 72°, ADB = 72°', () => {
      expect(calculateInscribedAngle(144)).toBe(72);
    });
  });

  describe('Planet 3: Arcadia (Panjang Busur & Luas Juring)', () => {
    it('Soal 1: r=14, θ=90°, π=22/7 => s = 22 cm', () => {
      const s = calculateArcLength(14, 90, true);
      expect(Math.round(s)).toBe(22);
    });

    it('Soal 2: r=21, θ=120°, π=22/7 => A = 462 cm²', () => {
      const A = calculateSectorArea(21, 120, true);
      expect(Math.round(A)).toBe(462);
    });

    it('Soal 3: A=154 cm², r=14 => θ = 90°', () => {
      const totalArea = (22 / 7) * Math.pow(14, 2);
      const theta = (154 / totalArea) * 360;
      expect(Math.round(theta)).toBe(90);
    });

    it('Soal 4: s=44 cm, r=28 => θ = 90°', () => {
      const keliling = 2 * (22 / 7) * 28;
      const theta = (44 / keliling) * 360;
      expect(Math.round(theta)).toBe(90);
    });

    it('Soal 5: r=42 km, θ=120° => s = 88 km, A = 1848 km²', () => {
      const s = calculateArcLength(42, 120, true);
      const A = calculateSectorArea(42, 120, true);
      expect(Math.round(s)).toBe(88);
      expect(Math.round(A)).toBe(1848);
    });
  });

  describe('Planet 4: Nexus (Sintesis Gabungan)', () => {
    it('Soal 1: R=5, r=3, d=10 => GSPL = 4√6 cm', () => {
      const gspl = calculateGSPL(10, 5, 3);
      expect(Math.round(gspl * 1000) / 1000).toBe(Math.round(4 * Math.sqrt(6) * 1000) / 1000);
    });

    it('Soal 2: Sudut pusat 126° => Sudut keliling = 63°', () => {
      expect(calculateInscribedAngle(126)).toBe(63);
    });

    it('Soal 3: R=14, r=7, d=25 => GSPL = 24 cm, GSPD = 2√46 cm', () => {
      const gspl = calculateGSPL(25, 14, 7);
      const gspd = calculateGSPD(25, 14, 7);
      expect(gspl).toBe(24);
      expect(Math.round(gspd * 1000) / 1000).toBe(Math.round(2 * Math.sqrt(46) * 1000) / 1000);
    });

    it('Soal 4: A=231 cm², r=21 cm => θ = 60°, s = 22 cm', () => {
      const totalArea = (22 / 7) * Math.pow(21, 2);
      const theta = Math.round((231 / totalArea) * 360);
      expect(theta).toBe(60);
      const s = calculateArcLength(21, theta, true);
      expect(Math.round(s)).toBe(22);
    });

    it('Soal 5: Wahana r=42, θ=120° => s=88, A=1848. Riset R=10, r=6, d=26 => GSPL = 2√165', () => {
      const s = calculateArcLength(42, 120, true);
      const A = calculateSectorArea(42, 120, true);
      const gspl = calculateGSPL(26, 10, 6);
      expect(Math.round(s)).toBe(88);
      expect(Math.round(A)).toBe(1848);
      expect(Math.round(gspl * 1000) / 1000).toBe(Math.round(2 * Math.sqrt(165) * 1000) / 1000);
    });
  });
});

describe('2. Keamanan & Sanitasi Ekspor CSV', () => {
  it('Harus menetralisasi formula spreadsheet yang dimulai dengan =, +, -, @', () => {
    expect(sanitizeCSVCell('=SUM(A1:A10)')).toBe("\"'=SUM(A1:A10)\"");
    expect(sanitizeCSVCell('+12345')).toBe("\"'+12345\"");
    expect(sanitizeCSVCell('-20')).toBe("\"'-20\"");
    expect(sanitizeCSVCell('@cmd')).toBe("\"'@cmd\"");
  });

  it('Harus melakukan escape pada karakter kutip ganda internal', () => {
    expect(sanitizeCSVCell('Kadet "Alpha" Nova')).toBe('"Kadet ""Alpha"" Nova"');
  });
});

describe('3. Normalisasi Jawaban Matematika & Radikal', () => {
  it('Harus mengenali penulisan akar eksak dengan berbagai variasi', () => {
    expect(evaluateRadicalOrNumber('4√3')).toBeCloseTo(4 * Math.sqrt(3));
    expect(evaluateRadicalOrNumber('4 akar 3')).toBeCloseTo(4 * Math.sqrt(3));
    expect(evaluateRadicalOrNumber('4sqrt(3)')).toBeCloseTo(4 * Math.sqrt(3));
    expect(evaluateRadicalOrNumber('2√265')).toBeCloseTo(2 * Math.sqrt(265));
  });

  it('Harus menerima format angka Indonesia dengan pemisah ribuan', () => {
    expect(normalizeAnswerString('1.848')).toBe('1848');
    expect(normalizeAnswerString('1,848')).toBe('1848');
  });
});
