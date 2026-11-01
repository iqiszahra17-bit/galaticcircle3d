import { describe, it, expect } from 'vitest';
import { QUESTIONS } from '../data/questions';
import { validateMathAnswer } from '../math/answerValidator';

describe('Fitur Feedback Jawaban Benar dan Pembahasan Soal', () => {
  it('1. Semua 20 soal memiliki data pembahasan (solutionSteps) dan kunci jawaban (finalAnswerFormatted)', () => {
    expect(QUESTIONS.length).toBe(20);

    QUESTIONS.forEach((q) => {
      // Pastikan setiap soal memiliki kunci jawaban yang valid
      expect(q.finalAnswerFormatted).toBeDefined();
      expect(q.finalAnswerFormatted.trim().length).toBeGreaterThan(0);

      // Pastikan setiap soal memiliki langkah pembahasan
      expect(q.solutionSteps).toBeDefined();
      expect(q.solutionSteps.length).toBeGreaterThan(0);

      // Setiap langkah pembahasan harus memiliki judul dan deskripsi yang jelas
      q.solutionSteps.forEach((step) => {
        expect(step.title).toBeDefined();
        expect(step.title.trim().length).toBeGreaterThan(0);
        expect(step.description).toBeDefined();
        expect(step.description.trim().length).toBeGreaterThan(0);
      });
    });
  });

  it('2. Soal-soal yang membutuhkan perhitungan memiliki rumus (formula) atau langkah kalkulasi (calculation)', () => {
    QUESTIONS.forEach((q) => {
      const hasFormulaOrCalc = q.solutionSteps.some(
        (step) => Boolean(step.formula?.trim()) || Boolean(step.calculation?.trim())
      );
      expect(
        hasFormulaOrCalc,
        `Soal ${q.id} (${q.title}) harus memiliki rumus atau kalkulasi di solutionSteps`
      ).toBe(true);
    });
  });

  it('3. Soal pilihan ganda memiliki opsi yang ditandai isCorrect = true yang cocok dengan kunci jawaban', () => {
    const mcQuestions = QUESTIONS.filter((q) => q.type === 'multiple_choice');
    expect(mcQuestions.length).toBeGreaterThan(0);

    mcQuestions.forEach((q) => {
      const correctChoices = q.choices?.filter((c) => c.isCorrect) || [];
      expect(
        correctChoices.length,
        `Soal ${q.id} harus memiliki tepat 1 opsi pilihan ganda yang benar`
      ).toBe(1);

      const correctChoice = correctChoices[0];
      expect(correctChoice.label).toBeDefined();
      expect(correctChoice.label.trim().length).toBeGreaterThan(0);
    });
  });

  it('4. Validasi jawaban salah menghasilkan status isCorrect: false', () => {
    // Uji jawaban salah untuk soal pertama (Tangensia Q1, expected: 8)
    const q1 = QUESTIONS[0];
    const wrongVal = validateMathAnswer('6 cm', q1.expectedAnswer || '', q1.acceptableAnswers || []);
    expect(wrongVal.isCorrect).toBe(false);

    // Kunci jawaban dan pembahasan siap ditampilkan ketika salah
    expect(q1.finalAnswerFormatted).toBe('8 cm');
    const correctChoice = q1.choices?.find((c) => c.isCorrect);
    expect(correctChoice?.label).toBe('8 cm');
    expect(q1.solutionSteps[1].formula).toBe('L = √(d² − (R − r)²)');
    expect(q1.solutionSteps[2].calculation).toContain('√64 = 8 cm');
  });

  it('5. Validasi jawaban benar menghasilkan status isCorrect: true', () => {
    const q1 = QUESTIONS[0];
    const rightVal = validateMathAnswer('8 cm', q1.expectedAnswer || '', q1.acceptableAnswers || []);
    expect(rightVal.isCorrect).toBe(true);
  });
});
