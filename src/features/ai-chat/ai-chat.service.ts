import { ChatMessage } from './ai-chat.types';
import { chatOrchestratorService } from './services/chat-orchestrator.service';
import { chatHistoryRepository } from './repositories/chat-history.repository';

class AIChatService {
  async askPytho(prompt: string): Promise<ChatMessage> {
    const result = await chatOrchestratorService.processUserMessage(prompt);
    await chatHistoryRepository.saveMessage(result);
    return {
      id: result.id,
      sender: result.sender,
      text: result.text,
      codeSnippet: result.codeSnippet,
      createdAt: result.createdAt
    };
  }

  getHistory(): ChatMessage[] {
    return chatHistoryRepository.getMessages().map((m) => ({
      id: m.id,
      sender: m.sender,
      text: m.text,
      codeSnippet: m.codeSnippet,
      createdAt: m.createdAt
    }));
  }

  checkAndResetExpiredSession(): boolean {
    return chatHistoryRepository.checkAndResetIfExpired();
  }

  touchActivity(): void {
    chatHistoryRepository.touchActivity();
  }

  clearHistory(): void {
    chatHistoryRepository.clearHistory();
  }

  subscribeRealtime(onNewMessage: (msg: ChatMessage) => void): () => void {
    return chatHistoryRepository.subscribeToRealtime((turn) => {
      onNewMessage({
        id: turn.id,
        sender: turn.sender,
        text: turn.text,
        codeSnippet: turn.codeSnippet,
        createdAt: turn.createdAt
      });
    });
  }
}

export const aiChatService = new AIChatService();
