export interface ChatMessage {
  id: string;
  sender: 'user' | 'pytho';
  text: string;
  timestamp: string;
  codeSnippet?: string;
}

export interface ChatSession {
  messages: ChatMessage[];
  isTyping: boolean;
}
