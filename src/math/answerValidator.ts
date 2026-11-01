/**
 * Answer normalization & validation engine for high school math
 * Supports exact radicals (e.g., "4√3", "4 akar 3", "4sqrt3"),
 * Indonesian/international decimals ("1.848", "1848", "1,848"),
 * and unit stripping.
 */

export interface ValidationResult {
  isCorrect: boolean;
  normalizedUserAnswer: string;
  feedback: string;
}

/**
 * Normalizes user input string:
 * - strips surrounding spaces, lowercase
 * - cleans units like cm, cm2, km, derajat, °, etc.
 * - standardizes radical notation to e.g. "a√b"
 */
export const normalizeAnswerString = (input: string): string => {
  if (!input) return '';
  let str = input.trim().toLowerCase();

  // Remove common units and symbols
  str = str.replace(/\b(cm2|cm\^2|cm²|cm|km2|km\^2|km²|km|derajat|deg)\b/gi, '');
  str = str.replace(/[°]/g, '');

  // Normalize Indonesian/international number format "1.848" or "1,848" to "1848" when it's thousands separator
  if (/^\d{1,3}[.,]\d{3}$/.test(str)) {
    str = str.replace(/[.,]/g, '');
  } else {
    // Replace comma with dot for standard decimal notation
    str = str.replace(',', '.');
  }

  // Normalize radical representations
  // e.g. "4 akar 3", "4sqrt(3)", "4*sqrt(3)", "4√3"
  str = str.replace(/\s*akar\s*/g, '√');
  str = str.replace(/sqrt\s*\(/g, '√');
  str = str.replace(/sqrt\s*/g, '√');
  str = str.replace(/\)/g, '');
  str = str.replace(/\*/g, '');
  str = str.replace(/\s+/g, '');

  return str;
};

/**
 * Evaluates numeric value of radical expressions like "4√3" -> 4 * sqrt(3)
 */
export const evaluateRadicalOrNumber = (valStr: string): number | null => {
  const norm = normalizeAnswerString(valStr);
  if (!norm) return null;

  // Pattern: "a√b" or "√b"
  const radicalMatch = norm.match(/^(\d+(?:\.\d+)?)?√(\d+(?:\.\d+)?)$/);
  if (radicalMatch) {
    const coeff = radicalMatch[1] ? parseFloat(radicalMatch[1]) : 1;
    const inside = parseFloat(radicalMatch[2]);
    if (inside < 0) return null;
    return coeff * Math.sqrt(inside);
  }

  // Plain number
  const num = parseFloat(norm);
  if (!isNaN(num)) return num;

  return null;
};

/**
 * Validates a single answer against expected and accepted answers.
 */
export const validateMathAnswer = (
  userAnswer: string,
  expectedAnswer: string,
  acceptableAnswers: string[] = [],
  tolerance = 0.05
): ValidationResult => {
  if (!userAnswer || userAnswer.trim() === '') {
    return {
      isCorrect: false,
      normalizedUserAnswer: '',
      feedback: 'Harap masukkan jawaban Anda sebelum memeriksa.',
    };
  }

  const normUser = normalizeAnswerString(userAnswer);
  const normExpected = normalizeAnswerString(expectedAnswer);
  const allAcceptable = [normExpected, ...acceptableAnswers.map(normalizeAnswerString)];

  // 1. Direct exact string match (case & unit normalized)
  if (allAcceptable.includes(normUser)) {
    return {
      isCorrect: true,
      normalizedUserAnswer: normUser,
      feedback: 'Tepat sekali! Perhitungan Anda akurat.',
    };
  }

  // 2. Numeric / Radical value equivalence check
  const userNum = evaluateRadicalOrNumber(userAnswer);
  const expectedNum = evaluateRadicalOrNumber(expectedAnswer);

  if (userNum !== null && expectedNum !== null) {
    const diff = Math.abs(userNum - expectedNum);
    const relDiff = expectedNum !== 0 ? diff / Math.abs(expectedNum) : diff;

    if (diff < tolerance || relDiff < tolerance) {
      return {
        isCorrect: true,
        normalizedUserAnswer: normUser,
        feedback: 'Jawaban benar! Nilai numerik Anda sesuai dengan perhitungan.',
      };
    }
  }

  // Check acceptable alternatives numeric values
  for (const alt of acceptableAnswers) {
    const altNum = evaluateRadicalOrNumber(alt);
    if (userNum !== null && altNum !== null) {
      if (Math.abs(userNum - altNum) < tolerance) {
        return {
          isCorrect: true,
          normalizedUserAnswer: normUser,
          feedback: 'Jawaban benar!',
        };
      }
    }
  }

  return {
    isCorrect: false,
    normalizedUserAnswer: normUser,
    feedback: 'Jawaban belum tepat. Coba periksa kembali langkah perhitungan atau gunakan petunjuk.',
  };
};
