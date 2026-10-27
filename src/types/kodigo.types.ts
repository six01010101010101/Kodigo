export type TrackLanguage = 'html_css' | 'javascript' | 'typescript' | 'python' | 'cpp';

export interface CodeTrack {
  id: string;
  name: string;
  language: TrackLanguage;
  icon: string;
  description: string;
  totalUnits: number;
  completedUnits: number;
  badgeColor: string;
}

export type ChallengeType = 
  | 'multiple_choice' 
  | 'reorder_blocks' 
  | 'fill_blank' 
  | 'bug_hunt' 
  | 'code_prediction';

export interface Challenge {
  id: string;
  type: ChallengeType;
  prompt: string;
  codeSnippet?: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  hint: string;
}

export interface Lesson {
  id: string;
  title: string;
  xpReward: number;
  challenges: Challenge[];
  completed: boolean;
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  isLocked: boolean;
}

export type MascotEmotion = 'idle' | 'happy' | 'thinking' | 'cheering' | 'sad';

export interface UserGamificationState {
  hearts: number;
  maxHearts: number;
  xp: number;
  gems: number;
  streak: number;
  activeTrackId: string;
  isPro: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  monthlyPrice: number;
  features: string[];
  isPopular?: boolean;
}
