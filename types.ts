
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  LESSON = 'LESSON',
  CHAT = 'CHAT',
  PROFILE = 'PROFILE',
  REVIEW = 'REVIEW',
  VOCAB_PRACTICE = 'VOCAB_PRACTICE'
}

export type Language = {
  id: string;
  name: string;
  flag: string;
  nativeName: string;
};

export type Lesson = {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  icon: string;
  color: string;
  grammarNotes?: string;
  vocabulary?: string[];
  needsReview?: boolean;
  lastScore?: number;
};

export type QuestionType = 'MATCH' | 'MULTIPLE_CHOICE' | 'TRANSLATE' | 'ARRANGE';

export type Question = {
  id: string;
  type: QuestionType;
  prompt: string;
  correctAnswer: string | string[];
  options?: string[];
  pairs?: { key: string; value: string }[];
};

export type ChatMessage = {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requirement: string;
};

export type DailyGoal = {
  id: string;
  title: string;
  completed: boolean;
  target: number;
  current: number;
  icon: string;
};
