export type MessageSender = 'user' | 'pytho';

export interface ChatMessageTurn {
  id: string;
  sender: MessageSender;
  text: string;
  codeSnippet?: string;
  followUpPrompts?: string[];
  createdAt: number;
}

export interface ConversationTurn {
  userPrompt: string;
  pythoResponse: string;
  timestamp: number;
}

export interface ChatMemoryContext {
  lastTopic?: string;
  lastEmotionalState?: 'well' | 'happy' | 'sad' | 'sick' | 'hungry' | 'neutral';
  recentTurns: ConversationTurn[];
}

export interface GeminiProPayload {
  prompt: string;
  userEmail: string;
  conversationHistory: { role: 'user' | 'model'; text: string }[];
  context: ChatMemoryContext;
}

export interface GeminiProResult {
  reply: string;
  codeSnippet?: string;
  followUpPrompts?: string[];
  isFallback?: boolean;
}
