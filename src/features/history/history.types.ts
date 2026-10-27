export interface ChallengeHistoryItem {
  id: string;
  challengeTitle: string;
  trackName: string;
  isCorrect: boolean;
  selectedAnswer: string;
  correctAnswer: string;
  date: string;
}

export interface DailyMission {
  id: string;
  title: string;
  rewardXp: number;
  current: number;
  target: number;
  completed: boolean;
}

export interface Trophy {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}
