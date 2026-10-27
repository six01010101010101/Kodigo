export interface ChatMessage {
  id: string;
  sender: 'user' | 'pytho';
  text: string;
  createdAt: number;
  codeSnippet?: string;
}

export interface ChatSession {
  messages: ChatMessage[];
  isTyping: boolean;
}
