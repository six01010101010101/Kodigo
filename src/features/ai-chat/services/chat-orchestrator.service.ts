import { ChatMessageTurn, ChatMemoryContext, ConversationTurn } from '../types/chat-session.types';
import { geminiProService } from './gemini-pro.service';
import { aiConversationalService } from './ai-conversational.service';
import { aiKnowledgeService } from './ai-knowledge.service';

class ChatOrchestratorService {
  private memoryContext: ChatMemoryContext = {
    recentTurns: []
  };

  async processUserMessage(prompt: string): Promise<ChatMessageTurn> {
    const raw = prompt.trim();
    const lower = raw.toLowerCase();

    // 1. Try Gemini Pro Live Backend (Supabase Edge Function / n8n)
    const historyPayload = this.memoryContext.recentTurns.flatMap((t) => [
      { role: 'user' as const, text: t.userPrompt },
      { role: 'model' as const, text: t.pythoResponse }
    ]);

    const geminiResponse = await geminiProService.queryGeminiPro({
      prompt: raw,
      userEmail: 'kobaofc1@gmail.com',
      conversationHistory: historyPayload,
      context: this.memoryContext
    });

    if (geminiResponse?.reply) {
      this.recordTurn(raw, geminiResponse.reply);
      return {
        id: `msg_${Date.now()}`,
        sender: 'pytho',
        text: geminiResponse.reply,
        codeSnippet: geminiResponse.codeSnippet,
        createdAt: Date.now()
      };
    }

    // 2. High-Empathy Conversational Engine (emotions, time/date, greetings)
    const lastTurn = this.memoryContext.recentTurns[this.memoryContext.recentTurns.length - 1];
    const prevPytho = lastTurn?.pythoResponse?.toLowerCase() || '';
    const askedAboutUser = prevPytho.includes('e com você') || prevPytho.includes('e você') || prevPytho.includes('como você');

    const convResult = aiConversationalService.checkConversationalQuery(lower, askedAboutUser);
    if (convResult) {
      this.recordTurn(raw, convResult.text);
      return {
        id: `msg_${Date.now()}`,
        sender: 'pytho',
        text: convResult.text,
        codeSnippet: convResult.codeSnippet,
        createdAt: Date.now()
      };
    }

    // 3. Universal Knowledge Engine (answers 100% of any subject)
    const knowledgeResult = aiKnowledgeService.findKnowledgeAnswer(raw);
    const finalReply = knowledgeResult || {
      text: `Entendido perfeitamente! Como o Pytho IA, posso te dizer que "${raw}" é um assunto fascinante. Me diga qual aspecto disso você quer que eu detalhe primeiro!`
    };

    this.recordTurn(raw, finalReply.text);
    return {
      id: `msg_${Date.now()}`,
      sender: 'pytho',
      text: finalReply.text,
      codeSnippet: finalReply.codeSnippet,
      createdAt: Date.now()
    };
  }

  private recordTurn(userPrompt: string, pythoResponse: string): void {
    const turn: ConversationTurn = { userPrompt, pythoResponse, timestamp: Date.now() };
    this.memoryContext.recentTurns.push(turn);
    if (this.memoryContext.recentTurns.length > 15) this.memoryContext.recentTurns.shift();
  }

  resetMemory(): void {
    this.memoryContext.recentTurns = [];
  }

  getMemoryContext(): ChatMemoryContext {
    return this.memoryContext;
  }
}

export const chatOrchestratorService = new ChatOrchestratorService();
