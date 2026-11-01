export type Difficulty = 'Medium' | 'Hard' | 'Challenging';

export type QuestionType = 'multiple_choice' | 'numeric_or_radical' | 'multi_part';

export interface AnswerChoice {
  id: string;
  label: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface MultiPartQuestion {
  partId: string;
  label: string;
  prompt: string;
  expectedAnswer: string;
  acceptableAnswers: string[];
  unit: string;
}

export type DiagramType = 
  | 'gspl'             // Garis Singgung Persekutuan Luar
  | 'gspd'             // Garis Singgung Persekutuan Dalam
  | 'central_inscribed'// Sudut Pusat & Keliling
  | 'cyclic_quad'      // Segiempat Tali Busur
  | 'arc_sector'       // Panjang Busur & Luas Juring
  | 'orbit_complex';   // Wahana Antariksa / Multi-lingkaran

export interface DiagramConfig {
  type: DiagramType;
  title?: string;
  isIllustrationOnly?: boolean;
  params: {
    R?: number;
    r?: number;
    d?: number;
    tangentLength?: number;
    centralAngle?: number;
    inscribedAngle?: number;
    secondInscribedAngle?: number;
    angleA?: number;
    angleC?: number;
    radius?: number;
    arcLength?: number;
    sectorArea?: number;
    showGSPL?: boolean;
    showGSPD?: boolean;
    labels?: Record<string, string>;
  };
}

export interface Question {
  id: string;
  planetId: string;
  questionNumber: number; // 1 to 5
  title: string;
  difficulty: Difficulty;
  topic: string;
  questionText: string;
  contextText?: string;
  diagramConfig?: DiagramConfig;
  type: QuestionType;
  choices?: AnswerChoice[];
  multiParts?: MultiPartQuestion[];
  expectedAnswer?: string;
  acceptableAnswers?: string[];
  unit?: string;
  hints: string[];
  solutionSteps: {
    title: string;
    description: string;
    formula?: string;
    calculation?: string;
  }[];
  finalAnswerFormatted: string;
  baseScore: number;
  xpReward: number;
  crystalReward: number;
}

export interface Planet {
  id: string;
  name: string;
  codeName: string;
  order: number;
  difficultyRange: string;
  topicTitle: string;
  summary: string;
  description: string;
  coreFormulas: {
    title: string;
    formula: string;
    description: string;
  }[];
  color: {
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
    border: string;
    bgGradient: string;
  };
  unlockCondition: {
    minLevel: number;
    requiredPreviousPlanetId?: string;
    description: string;
  };
  iconName: string;
}
