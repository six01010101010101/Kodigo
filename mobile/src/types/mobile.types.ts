export type NodeType = 'theory' | 'challenge' | 'project' | 'boss';

export interface TrackNode {
  id: string;
  title: string;
  type: NodeType;
  completed: boolean;
  locked: boolean;
  xpReward: number;
}

export interface UserStats {
  hearts: number;
  maxHearts: number;
  gems: number;
  streak: number;
  xp: number;
  isPro: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'pytho';
  text: string;
  codeSnippet?: string;
  followUpPrompts?: string[];
  createdAt: number;
}
