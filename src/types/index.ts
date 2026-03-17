// Types for PostgreSQL Monitoring Tutorial

export interface Tool {
  name: string;
  desc: string;
}

export interface Metric {
  name: string;
  desc: string;
}

export interface VisualCard {
  title: string;
  body: string;
  code?: string;
  imageUrl?: string;
}

export interface PracticeItem {
  title: string;
  code: string;
  explanation: string;
}

export interface QuizOption {
  text: string;
  explanation: string;
}

export interface QuizQuestion {
  q: string;
  options: QuizOption[];
  correct: number;
}

export interface Level {
  id: number;
  title: string;
  subtitle: string;
  accent: string;
  border: string;
  theory: string;
  note?: string;
  extraNotes?: string[];
  tools: Tool[];
  metrics: Metric[];
  visualCards: VisualCard[];
  practice: PracticeItem[];
  interpretation: string[];
  quiz: QuizQuestion[];
}

export interface Tab {
  key: string;
  label: string;
}

export interface Answers {
  [levelIndex: string]: {
    [questionIndex: string]: number;
  };
}

export interface ProgressRingsProps {
  currentLevel: number;
}

export interface QuizBlockProps {
  levelIndex: number;
  level: Level;
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
}
