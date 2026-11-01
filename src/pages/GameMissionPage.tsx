import React, { useState, useEffect, useRef } from 'react';
import { Planet, Question } from '../types/math';
import { QUESTIONS } from '../data/questions';
import { CircleDiagram } from '../components/diagrams/CircleDiagram';
import { validateMathAnswer } from '../math/answerValidator';
import { soundEffects } from '../utils/soundEffects';
import { 
  Heart, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Gem, 
  RotateCcw,
  BookOpen,
  AlertTriangle,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface Props {
  planet: Planet;
  isChallengeMode: boolean;
  onCompleteMission: (results: {
    planetId: string;
    totalScore: number;
    correctCount: number;
    timeSpentSeconds: number;
    questionHistory: {
      questionId: string;
      isCorrect: boolean;
      userAnswer: string;
      scoreEarned: number;
    }[];
  }) => void;
  onExitMission: () => void;
}

export const GameMissionPage: React.FC<Props> = ({
  planet,
  isChallengeMode,
  onCompleteMission,
  onExitMission,
}) => {
  const planetQuestions = QUESTIONS.filter((q) => q.planetId === planet.id).sort(
    (a, b) => a.questionNumber - b.questionNumber
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion: Question = planetQuestions[currentIndex] || planetQuestions[0];

  // User input state
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState<string>('');
  const [multiPartAnswers, setMultiPartAnswers] = useState<Record<string, string>>({});

  // Question & Attempt state (Maximum 1 retry allowed = 2 attempts total)
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0); // 0 = not tried, 1 = first try, 2 = retry used
  const [canRetry, setCanRetry] = useState(true);

  const [lives, setLives] = useState(3); // 3 Hearts ❤️❤️❤️
  const [totalScore, setTotalScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [earnedCrystals, setEarnedCrystals] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  // Popups
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showFailPopup, setShowFailPopup] = useState(false);

  // History tracking
  const [questionHistory, setQuestionHistory] = useState<
    { questionId: string; isCorrect: boolean; userAnswer: string; scoreEarned: number }[]
  >([]);

  // Timer
  const [timerSeconds, setTimerSeconds] = useState(isChallengeMode ? 120 : 0);
  const [totalElapsedSeconds, setTotalElapsedSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetForNext = () => {
    setSelectedChoiceId(null);
    setTypedAnswer('');
    setMultiPartAnswers({});
    setHasChecked(false);
    setIsCorrect(false);
    setAttemptCount(0);
    setCanRetry(true);
    setShowSolution(false);
    setShowSuccessPopup(false);
    setShowFailPopup(false);
    if (isChallengeMode) setTimerSeconds(120);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTotalElapsedSeconds((prev) => prev + 1);
      if (isChallengeMode) {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isChallengeMode]);

  const handleTimeOut = () => {
    if (hasChecked) return;
    soundEffects.playWrong();
    setHasChecked(true);
    setIsCorrect(false);
    setAttemptCount(2); // lock retries on timeout
    setCanRetry(false);
    setLives((prev) => Math.max(0, prev - 1));
    setShowFailPopup(true);
  };

  const handleCheckAnswer = () => {
    if (hasChecked && !canRetry) return;
    soundEffects.playClick();

    const currentAttempt = attemptCount + 1;
    setAttemptCount(currentAttempt);

    let questionCorrect = false;
    let finalUserAnsText = '';

    if (currentQuestion.type === 'multiple_choice') {
      if (!selectedChoiceId) return;
      const choice = currentQuestion.choices?.find((c) => c.id === selectedChoiceId);
      questionCorrect = Boolean(choice?.isCorrect);
      finalUserAnsText = choice?.label || '';
    } else if (currentQuestion.type === 'multi_part') {
      let allPartsCorrect = true;
      const partResults: string[] = [];

      currentQuestion.multiParts?.forEach((part) => {
        const userPartVal = multiPartAnswers[part.partId] || '';
        const partVal = validateMathAnswer(userPartVal, part.expectedAnswer, part.acceptableAnswers);
        if (!partVal.isCorrect) allPartsCorrect = false;
        partResults.push(`${part.label}: ${userPartVal || '(kosong)'}`);
      });

      questionCorrect = allPartsCorrect;
      finalUserAnsText = partResults.join(', ');
    } else {
      if (!typedAnswer.trim()) return;
      const res = validateMathAnswer(
        typedAnswer,
        currentQuestion.expectedAnswer || '',
        currentQuestion.acceptableAnswers || []
      );
      questionCorrect = res.isCorrect;
      finalUserAnsText = typedAnswer;
    }

    setIsCorrect(questionCorrect);
    setHasChecked(true);

    if (questionCorrect) {
      soundEffects.playCorrect();
      // If answered correctly on first try, give full score; if on retry, give 75% score
      const earnedPts = currentAttempt === 1 ? currentQuestion.baseScore : Math.round(currentQuestion.baseScore * 0.75);
      const earnedCry = currentAttempt === 1 ? 5 : 3;

      setTotalScore((prev) => prev + earnedPts);
      setCorrectCount((prev) => prev + 1);
      setEarnedCrystals((prev) => prev + earnedCry);
      setShowSuccessPopup(true);

      setQuestionHistory((prev) => [
        ...prev,
        {
          questionId: currentQuestion.id,
          isCorrect: true,
          userAnswer: finalUserAnsText,
          scoreEarned: earnedPts,
        },
      ]);
    } else {
      soundEffects.playWrong();
      setLives((prev) => Math.max(0, prev - 1));

      // Rule: "maksimal ngulang 1 kali jawaban aja"
      // If currentAttempt >= 2, no more retries!
      if (currentAttempt >= 2) {
        setCanRetry(false);
        setShowSolution(true); // Automatically show step-by-step solution so they learn!
        setQuestionHistory((prev) => [
          ...prev,
          {
            questionId: currentQuestion.id,
            isCorrect: false,
            userAnswer: finalUserAnsText,
            scoreEarned: 0,
          },
        ]);
      } else {
        setCanRetry(true);
      }

      setShowFailPopup(true);
    }
  };

  const handleRetryQuestion = () => {
    soundEffects.playClick();
    setShowFailPopup(false);
    // Allow 1 retry: reset selected answer and checked state
    setHasChecked(false);
    setSelectedChoiceId(null);
  };

  const handleSkipOrProceed = () => {
    soundEffects.playClick();
    setShowSuccessPopup(false);
    setShowFailPopup(false);

    let nextHistory = questionHistory;
    const alreadyRecorded = questionHistory.some((h) => h.questionId === currentQuestion.id);
    if (!alreadyRecorded) {
      const defaultAnswer = typedAnswer || (selectedChoiceId ? currentQuestion.choices?.find((c) => c.id === selectedChoiceId)?.label || '' : '(Dilewati)');
      const skippedItem = {
        questionId: currentQuestion.id,
        isCorrect: false,
        userAnswer: defaultAnswer,
        scoreEarned: 0,
      };
      nextHistory = [...questionHistory, skippedItem];
      setQuestionHistory(nextHistory);
    }

    if (currentIndex < planetQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      resetForNext();
    } else {
      finishMission(nextHistory);
    }
  };

  const finishMission = (historyToUse = questionHistory) => {
    soundEffects.playVictory();
    onCompleteMission({
      planetId: planet.id,
      totalScore,
      correctCount,
      timeSpentSeconds: totalElapsedSeconds,
      questionHistory: historyToUse,
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 sm:py-8 flex flex-col items-center">
      {/* Top Gameplay HUD (Responsive width for mobile & laptop) */}
      <div className="w-full flex items-center justify-between pb-3 mb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundEffects.playClick();
              onExitMission();
            }}
            className="p-2 rounded-xl bg-space-surface hover:bg-space-deep border border-white/10 text-xs text-neon-white/70 hover:text-neon-cyan transition-colors"
          >
            ← Peta Galaksi
          </button>
          <div className="hidden sm:block">
            <span className="font-orbitron font-bold text-sm text-neon-white">
              {planet.name} • <span className="text-neon-cyan font-rajdhani">{currentQuestion.topic}</span>
            </span>
          </div>
        </div>

        {/* Question Counter Progress Bar */}
        <div className="flex-1 max-w-[180px] sm:max-w-xs mx-4">
          <div className="flex items-center justify-between text-[11px] font-mono text-neon-white/70 mb-1">
            <span>Progress Soal</span>
            <span className="font-bold text-neon-cyan">
              {currentIndex + 1} / {planetQuestions.length}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-space-deep overflow-hidden border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / planetQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* 3 Heart Lives (❤️❤️❤️) */}
        <div className="flex items-center gap-1.5 bg-space-surface px-3 py-1.5 rounded-xl border border-white/10">
          {[1, 2, 3].map((heart) => (
            <Heart
              key={heart}
              className={`w-4 h-4 transition-transform ${
                heart <= lives
                  ? 'text-rose-500 fill-rose-500 drop-shadow-[0_0_6px_rgba(244,63,94,0.8)] scale-100'
                  : 'text-white/20 fill-white/10 scale-90'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Question Arena: Responsive Grid on Laptop, Stacked on Mobile */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Diagram & Question Details) */}
        <div className="lg:col-span-7 rounded-3xl bg-space-surface/90 border border-space-border/80 backdrop-blur-xl p-5 sm:p-7 shadow-2xl hud-corner">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] text-neon-cyan font-mono tracking-widest uppercase font-bold">
              TANTANGAN #{currentIndex + 1} • {currentQuestion.difficulty.toUpperCase()}
            </span>
            <span className="text-xs font-mono text-neon-gold font-bold">
              +{currentQuestion.baseScore} Poin
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-semibold text-neon-white mb-4 leading-relaxed">
            {currentQuestion.questionText}
          </h2>

          {/* Dynamic SVG Geometric Diagram */}
          {currentQuestion.diagramConfig && (
            <div className="bg-space-deep/90 rounded-2xl p-3 border border-white/5 mb-4">
              <CircleDiagram config={currentQuestion.diagramConfig} />
            </div>
          )}

          {/* Step-by-Step Solution (Shown after checking or when attempts are exhausted) */}
          {(showSolution || (hasChecked && !isCorrect)) && (
            <div className="p-4 rounded-2xl bg-space-deep border border-neon-cyan/20 space-y-2 mt-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-neon-gold text-xs font-bold font-orbitron">
                <BookOpen className="w-4 h-4" />
                <span>PEMBAHASAN RESMI</span>
              </div>
              <div className="text-xs text-neon-white/80 space-y-1.5">
                <p className="font-semibold text-neon-cyan">Kunci Jawaban: {currentQuestion.finalAnswerFormatted}</p>
                {currentQuestion.type === 'multiple_choice' && (() => {
                  const correctChoice = currentQuestion.choices?.find((c) => c.isCorrect);
                  return correctChoice ? (
                    <p className="text-[11px] text-neon-white/80">
                      Pilihan [{correctChoice.id.toUpperCase()}]: {correctChoice.label}
                    </p>
                  ) : null;
                })()}
                {currentQuestion.solutionSteps.map((s, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-space-surface/80 border border-white/5 space-y-1">
                    <span className="font-bold text-neon-white block">{s.title}</span>
                    <p className="text-neon-white/70 text-[11px] mt-0.5 leading-relaxed">{s.description}</p>
                    {s.formula && (
                      <div className="p-1.5 rounded bg-space-deep border border-neon-cyan/20 text-[10px] text-neon-cyan font-mono">
                        <span className="text-neon-white/40 mr-1.5">Rumus:</span>
                        <span>{s.formula}</span>
                      </div>
                    )}
                    {s.calculation && (
                      <pre className="text-[10px] text-neon-gold font-mono whitespace-pre-wrap mt-1 p-2 rounded bg-space-deep border border-white/5">
                        {s.calculation}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Answer Options & Control Deck) */}
        <div className="lg:col-span-5 rounded-3xl bg-space-surface/90 border border-space-border/80 backdrop-blur-xl p-5 sm:p-7 shadow-2xl hud-corner flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
              <h3 className="font-orbitron font-bold text-xs sm:text-sm text-neon-white">
                PILIH / MASUKKAN JAWABAN
              </h3>
              {attemptCount > 0 && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  canRetry ? 'bg-amber-950/40 text-neon-gold border border-amber-500/30' : 'bg-red-950/40 text-red-400 border border-red-500/30'
                }`}>
                  Percobaan {attemptCount}/2 {canRetry ? '(1x Sisa)' : '(Habis)'}
                </span>
              )}
            </div>

            {/* Multiple Choice Options */}
            {currentQuestion.type === 'multiple_choice' && (
              <div className="space-y-3">
                {currentQuestion.choices?.map((choice) => {
                  const isSelected = selectedChoiceId === choice.id;
                  return (
                    <button
                      key={choice.id}
                      disabled={hasChecked && !canRetry}
                      onClick={() => {
                        soundEffects.playClick();
                        setSelectedChoiceId(choice.id);
                      }}
                      className={`w-full p-4 rounded-2xl border text-left font-medium text-xs sm:text-sm transition-all flex items-center gap-3.5 ${
                        isSelected
                          ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border-neon-cyan text-neon-white shadow-neon-cyan/30 shadow-md ring-1 ring-neon-cyan scale-[1.01]'
                          : 'bg-space-deep/80 border-white/10 hover:border-neon-cyan/40 text-neon-white/80'
                      } ${hasChecked && !canRetry ? 'cursor-not-allowed opacity-80' : ''}`}
                    >
                      <span
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold font-orbitron text-xs ${
                          isSelected
                            ? 'bg-neon-cyan text-space-deep font-extrabold shadow-sm'
                            : 'bg-space-surface border border-white/10 text-neon-white/60'
                        }`}
                      >
                        {choice.id.toUpperCase()}
                      </span>
                      <span className="font-rajdhani font-semibold text-sm sm:text-base">{choice.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Multi-part Input */}
            {currentQuestion.type === 'multi_part' && (
              <div className="space-y-3">
                {currentQuestion.multiParts?.map((part) => (
                  <div key={part.partId} className="p-3.5 rounded-2xl bg-space-deep/90 border border-white/10">
                    <label className="block text-xs font-bold text-neon-cyan mb-1.5 font-rajdhani">
                      {part.label}: <span className="text-neon-white font-normal">{part.prompt}</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        disabled={hasChecked && !canRetry}
                        value={multiPartAnswers[part.partId] || ''}
                        onChange={(e) =>
                          setMultiPartAnswers({
                            ...multiPartAnswers,
                            [part.partId]: e.target.value,
                          })
                        }
                        placeholder="Masukkan jawaban..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-space-surface border border-white/10 focus:border-neon-cyan focus:outline-none text-xs sm:text-sm text-neon-white font-mono"
                      />
                      {part.unit && (
                        <span className="absolute right-3 top-2.5 text-xs text-neon-white/40 font-mono">
                          {part.unit}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Numeric or Radical Input */}
            {currentQuestion.type === 'numeric_or_radical' && (
              <div className="space-y-2">
                <label className="block text-xs text-neon-white/70">
                  Ketik jawaban eksak:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    disabled={hasChecked && !canRetry}
                    value={typedAnswer}
                    onChange={(e) => setTypedAnswer(e.target.value)}
                    placeholder="Masukkan jawaban eksak..."
                    className="w-full px-4 py-3 rounded-xl bg-space-deep border border-white/10 focus:border-neon-cyan focus:outline-none text-sm text-neon-white font-mono"
                  />
                  {currentQuestion.unit && (
                    <span className="absolute right-3 top-3 text-xs text-neon-white/40 font-mono">
                      {currentQuestion.unit}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Control Bar: Skip button + Check button */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
            <button
              onClick={handleSkipOrProceed}
              className="px-4 py-3 rounded-2xl bg-space-deep border border-white/10 hover:border-white/30 text-neon-white/60 hover:text-neon-white text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Lewati</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {!hasChecked || (hasChecked && canRetry && !isCorrect) ? (
              <button
                onClick={handleCheckAnswer}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-neon-cyan to-blue-500 hover:opacity-95 text-space-deep font-extrabold font-orbitron text-xs sm:text-sm tracking-wider shadow-neon-cyan transition-all"
              >
                {attemptCount === 1 ? 'PERIKSA ULANG (1x SISA)' : 'PERIKSA JAWABAN'}
              </button>
            ) : (
              <button
                onClick={handleSkipOrProceed}
                className="flex-1 py-3.5 rounded-2xl bg-neon-emerald hover:opacity-90 text-space-deep font-extrabold font-orbitron text-xs sm:text-sm tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>LANJUT KE SOAL BERIKUTNYA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================
          POP-UP SUKSES (Benar)
          ========================================================= */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-deep/80 backdrop-blur-xl animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-3xl bg-space-surface border border-neon-cyan/50 p-6 shadow-2xl text-center hud-corner">
            <div className="w-14 h-14 rounded-full bg-neon-gold/20 border-2 border-neon-gold flex items-center justify-center text-neon-gold mx-auto mb-3 shadow-neon-gold/30">
              <Star className="w-8 h-8 fill-neon-gold" />
            </div>

            <h3 className="font-orbitron font-extrabold text-xl text-neon-white mb-1">
              Selamat!
            </h3>
            <p className="text-xs text-neon-white/70 max-w-xs mx-auto mb-4">
              Kamu berhasil menyelesaikan tantangan soal {planet.name}!
            </p>

            <div className="flex items-center justify-center gap-3 py-2 px-4 rounded-xl bg-space-deep border border-white/10 mb-5">
              <span className="text-xs font-bold text-neon-cyan flex items-center gap-1 font-mono">
                <Gem className="w-3.5 h-3.5 text-neon-cyan" /> +5 Kristal
              </span>
              <span className="text-xs font-bold text-neon-gold flex items-center gap-1 font-mono">
                <Star className="w-3.5 h-3.5 fill-neon-gold text-neon-gold" /> +{currentQuestion.baseScore} Skor
              </span>
            </div>

            <button
              onClick={handleSkipOrProceed}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-neon-cyan to-blue-500 text-space-deep font-extrabold font-orbitron text-xs sm:text-sm tracking-wider shadow-neon-cyan hover:opacity-90 transition-all"
            >
              Lanjut
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          POP-UP GAGAL (Salah - Maksimal 1x Kesempatan Mengulang)
          ========================================================= */}
      {/* =========================================================
          POP-UP GAGAL (Salah - Maksimal 1x Kesempatan Mengulang)
          ========================================================= */}
      {showFailPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-deep/80 backdrop-blur-xl animate-fadeIn">
          <div className="relative w-full max-w-lg max-h-[90vh] rounded-3xl bg-space-surface border border-rose-500/50 p-5 sm:p-6 shadow-2xl flex flex-col hud-corner">
            <div className="w-14 h-14 rounded-full bg-rose-950/60 border-2 border-rose-500 flex items-center justify-center text-rose-400 mx-auto mb-3 shadow-rose-500/30 shrink-0">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h3 className="font-orbitron font-extrabold text-xl text-neon-white mb-1 text-center shrink-0">
              {canRetry ? 'Kamu gagal!' : 'Kesempatan Habis!'}
            </h3>

            <p className="text-xs text-neon-white/70 max-w-xs mx-auto mb-4 leading-relaxed text-center shrink-0">
              {canRetry
                ? 'Jawaban belum tepat! Kamu memiliki maksimal 1 kali kesempatan mengulang untuk soal ini.'
                : 'Kamu telah menggunakan 1x kesempatan mengulang. Pelajari pembahasan di bawah dan lanjutkan ke soal berikutnya.'}
            </p>

            {/* Informasi Jawaban yang Benar & Pembahasan Lengkap */}
            <div className="w-full text-left p-4 rounded-2xl bg-space-deep/90 border border-neon-cyan/20 space-y-3 mb-4 overflow-y-auto max-h-[42vh] pr-2">
              <div className="flex items-center gap-2 text-neon-gold text-xs font-bold font-orbitron">
                <BookOpen className="w-4 h-4 text-neon-gold shrink-0" />
                <span>PEMBAHASAN & KUNCI JAWABAN</span>
              </div>

              {/* Kunci Jawaban yang Benar */}
              <div className="p-3 rounded-xl bg-space-surface border border-neon-cyan/30">
                <span className="text-[11px] text-neon-white/60 block font-mono">Jawaban yang Benar:</span>
                <span className="font-bold text-sm sm:text-base text-neon-cyan font-mono block mt-0.5">
                  {currentQuestion.finalAnswerFormatted}
                </span>
                {currentQuestion.type === 'multiple_choice' && (() => {
                  const correctChoice = currentQuestion.choices?.find((c) => c.isCorrect);
                  return correctChoice ? (
                    <span className="text-xs text-neon-white/80 block mt-1 font-rajdhani font-semibold">
                      Pilihan [{correctChoice.id.toUpperCase()}]: {correctChoice.label}
                    </span>
                  ) : null;
                })()}
                {currentQuestion.type === 'multi_part' && (
                  <div className="mt-2 space-y-1">
                    {currentQuestion.multiParts?.map((part) => (
                      <div key={part.partId} className="text-xs text-neon-white/80 font-mono">
                        <span className="text-neon-cyan font-bold">{part.label}:</span> {part.expectedAnswer} {part.unit}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Langkah-langkah Pembahasan, Rumus, dan Perhitungan */}
              <div className="space-y-2">
                <span className="text-[11px] text-neon-white/60 uppercase font-mono block">
                  Langkah Pembahasan & Rumus:
                </span>
                {currentQuestion.solutionSteps.map((step, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-space-surface/90 border border-white/5 space-y-1">
                    <span className="font-bold text-xs text-neon-white block font-rajdhani">
                      {step.title}
                    </span>
                    <p className="text-neon-white/70 text-[11px] leading-relaxed">
                      {step.description}
                    </p>
                    {step.formula && (
                      <div className="p-1.5 rounded-lg bg-space-deep border border-neon-cyan/20 text-[11px] text-neon-cyan font-mono">
                        <span className="text-neon-white/40 mr-1.5">Rumus:</span>
                        <span>{step.formula}</span>
                      </div>
                    )}
                    {step.calculation && (
                      <pre className="p-2 rounded-lg bg-space-deep border border-white/5 text-[10px] text-neon-gold font-mono whitespace-pre-wrap mt-1">
                        {step.calculation}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {canRetry ? (
                <>
                  <button
                    onClick={handleRetryQuestion}
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-600 text-white font-extrabold font-orbitron text-xs tracking-wider shadow-lg hover:opacity-90 transition-all"
                  >
                    Coba Lagi (1x Sisa)
                  </button>
                  <button
                    onClick={handleSkipOrProceed}
                    className="px-4 py-3 rounded-2xl bg-space-deep border border-white/10 text-xs font-semibold text-neon-white/80 hover:bg-space-surface transition-colors"
                  >
                    Lewati
                  </button>
                </>
              ) : (
                <button
                  onClick={handleSkipOrProceed}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-space-deep font-extrabold font-orbitron text-xs sm:text-sm tracking-wider shadow-neon-cyan hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <span>Lanjut Soal Berikutnya</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
