import { ChatMessageTurn, ChatMemoryContext, ConversationTurn } from '../types/chat-session.types';
import { geminiProService } from './gemini-pro.service';
import { aiConversationalService } from './ai-conversational.service';
import { aiKnowledgeService } from './ai-knowledge.service';
import { agentToolsService } from './agent-tools.service';
import { agentPromptsService } from './agent-prompts.service';
import { AgentContext } from '../types/agent.types';

const generateUuid = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return '00000000-0000-4000-8000-' + Date.now().toString(16).padStart(12, '0');
};

class ChatOrchestratorService {
  private memoryContext: ChatMemoryContext = {
    recentTurns: []
  };

  async processUserMessage(prompt: string): Promise<ChatMessageTurn> {
    const raw = prompt.trim();
    const lower = raw.toLowerCase();

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo';
    const localTime = new Date().toLocaleTimeString('pt-BR', { timeZone, hour: '2-digit', minute: '2-digit' });
    const localDate = new Date().toLocaleDateString('pt-BR', { timeZone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const agentCtx: AgentContext = { localTime, localDate, timeZone };

    // 1. Base dos Dados Pattern: Deterministic Agent Tools (Code, Math, Comparison)
    const toolResult = agentToolsService.executeTool(raw, agentCtx);
    if (toolResult) {
      this.recordTurn(raw, toolResult.text);
      return {
        id: generateUuid(),
        sender: 'pytho',
        text: toolResult.text,
        codeSnippet: toolResult.codeSnippet,
        followUpPrompts: toolResult.followUpPrompts,
        createdAt: Date.now()
      };
    }

    // 2. Query Live Gemini Pro Model
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

    if (geminiResponse?.reply && !geminiResponse.isFallback) {
      const followUps = geminiResponse.followUpPrompts && geminiResponse.followUpPrompts.length > 0
        ? geminiResponse.followUpPrompts
        : agentPromptsService.generateContextualFollowUps(raw, geminiResponse.reply);

      this.recordTurn(raw, geminiResponse.reply);
      return {
        id: generateUuid(),
        sender: 'pytho',
        text: geminiResponse.reply,
        codeSnippet: geminiResponse.codeSnippet,
        followUpPrompts: followUps,
        createdAt: Date.now()
      };
    }

    // 3. Empathetic Conversational Engine
    const lastTurn = this.memoryContext.recentTurns[this.memoryContext.recentTurns.length - 1];
    const prevPytho = lastTurn?.pythoResponse || '';

    const convResult = aiConversationalService.checkConversationalQuery(lower, prevPytho);
    if (convResult) {
      const followUps = agentPromptsService.generateContextualFollowUps(raw, convResult.text);
      this.recordTurn(raw, convResult.text);
      return {
        id: generateUuid(),
        sender: 'pytho',
        text: convResult.text,
        codeSnippet: convResult.codeSnippet,
        followUpPrompts: followUps,
        createdAt: Date.now()
      };
    }

    // 4. Knowledge Engine Fallback
    const knowledgeResult = aiKnowledgeService.findKnowledgeAnswer(raw);
    const textToUse = knowledgeResult?.text || geminiResponse?.reply ||
      `Nossa, concordo plenamente com você! É tão bom bater um papo leve e trocar ideias sobre isso. O que mais você tem feito de bom ultimamente?`;
    const snippetToUse = knowledgeResult?.codeSnippet || geminiResponse?.codeSnippet;
    const followUps = agentPromptsService.generateContextualFollowUps(raw, textToUse);

    this.recordTurn(raw, textToUse);
    return {
      id: generateUuid(),
      sender: 'pytho',
      text: textToUse,
      codeSnippet: snippetToUse,
      followUpPrompts: followUps,
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
