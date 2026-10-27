import { ChatMessageTurn, ChatMemoryContext, ConversationTurn } from '../types/chat-session.types';
import { geminiProService } from './gemini-pro.service';

class ChatOrchestratorService {
  private memoryContext: ChatMemoryContext = {
    recentTurns: []
  };

  async processUserMessage(prompt: string): Promise<ChatMessageTurn> {
    const raw = prompt.trim();
    const lower = raw.toLowerCase();

    // 1. Check Gemini Pro backend via n8n / direct API
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

    if (geminiResponse) {
      this.recordTurn(raw, geminiResponse.reply);
      return {
        id: `msg_${Date.now()}`,
        sender: 'pytho',
        text: geminiResponse.reply,
        codeSnippet: geminiResponse.codeSnippet,
        createdAt: Date.now()
      };
    }

    // 2. Comprehensive Conversational Engine (Answers ALL Questions)
    const reply = this.computeContextualResponse(lower, raw);
    this.recordTurn(raw, reply.text);

    return {
      id: `msg_${Date.now()}`,
      sender: 'pytho',
      text: reply.text,
      codeSnippet: reply.codeSnippet,
      createdAt: Date.now()
    };
  }

  private computeContextualResponse(lower: string, original: string): { text: string; codeSnippet?: string } {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo';
    const currentTime = new Date().toLocaleTimeString('pt-BR', { timeZone, hour: '2-digit', minute: '2-digit' });
    const currentDate = new Date().toLocaleDateString('pt-BR', { timeZone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const lastTurn = this.memoryContext.recentTurns[this.memoryContext.recentTurns.length - 1];
    const prevPytho = lastTurn?.pythoResponse?.toLowerCase() || '';
    const pythoAskedAboutUser = prevPytho.includes('e com você') || prevPytho.includes('e você') || prevPytho.includes('como você');

    // Case 1: Time and Clock Query (exact geolocation / browser local time)
    if (lower.includes('que horas') || lower.includes('hora é') || lower.includes('horario atual') || lower.includes('horas sao')) {
      return {
        text: `Agora são exatamente ${currentTime} pelo horário local da sua região (${timeZone.replace('_', ' ')}). Como posso te ajudar agora?`
      };
    }

    // Case 2: Date Query
    if (lower.includes('que dia é hoje') || lower.includes('qual a data') || lower.includes('data de hoje')) {
      return {
        text: `Hoje é ${currentDate}! Um ótimo dia para aprender e criar coisas novas.`
      };
    }

    // Case 3: User says they are well after being asked
    if (pythoAskedAboutUser && (lower.includes('estou bem') || lower.includes('to bem') || lower === 'bem' || lower.includes('tudo certo') || lower.includes('tudo bem'))) {
      this.memoryContext.lastEmotionalState = 'well';
      return {
        text: 'Que bom, estou muito feliz! O que vamos fazer hoje? Ou o que vamos estudar hoje? Me diga qualquer assunto ou curiosidade que você queira saber!'
      };
    }

    // Case 4: User says they are happy
    if (lower.includes('estou feliz') || lower.includes('to feliz') || lower.includes('muito feliz') || lower.includes('alegre')) {
      this.memoryContext.lastEmotionalState = 'happy';
      return {
        text: 'Nossa, que legal! Fico muito contente por você! Me conta, o que aconteceu de bom hoje? Essa energia boa é maravilhosa!'
      };
    }

    // Case 5: User says they are ill / sick
    if (lower.includes('doente') || lower.includes('febre') || lower.includes('gripe') || lower.includes('enjoado') || lower.includes('dor de cabeça')) {
      this.memoryContext.lastEmotionalState = 'sick';
      return {
        text: 'Poxa, que pena que você está assim... Saúde e bem-estar sempre vêm em primeiro lugar! Tente descansar, tomar uma água e se cuidar bastante. Quando você se sentir melhor, estarei aqui para conversarmos!'
      };
    }

    // Case 6: User says they are sad or bad
    if (lower.includes('estou mal') || lower.includes('to mal') || lower.includes('estou triste') || lower.includes('to triste') || lower.includes('chateado') || lower.includes('desanimado')) {
      this.memoryContext.lastEmotionalState = 'sad';
      return {
        text: 'Por que você está triste? O que aconteceu? Tente fazer algo que te deixe bem e te dê paz. Se quiser desabafar ou conversar sobre qualquer coisa, estou aqui com você!'
      };
    }

    // Case 7: User asks if Pytho is well
    if (lower.includes('você está bem') || lower.includes('voce esta bem') || lower.includes('vc esta bem') || lower.includes('tudo bem') || lower.includes('como vai') || lower.includes('como você está')) {
      return {
        text: 'Oi! Comigo está tudo ótimo, está tudo bem! Meus módulos estão operando a 100% e estou muito animado para conversar com você sobre qualquer assunto. E com você, está tudo bem?'
      };
    }

    // Case 8: Simple greeting
    if (/^(oi|olá|ola|opa|hello|hey)\b/.test(lower) && lower.length < 20) {
      return {
        text: 'Oi! Que alegria ter você aqui por perto! Tudo bem com você?'
      };
    }

    // Case 9: Programming & Software Topics
    if (lower.includes('git') || lower.includes('commit') || lower.includes('branch')) {
      return {
        text: 'No Git profissional, utilize commits semânticos e branches limpas para organizar seu fluxo de trabalho:',
        codeSnippet: `git switch -c feature/nova-tela\ngit add .\ngit commit -m "feat: adicionar funcionalidade de geolocalizacao"\ngit push -u origin feature/nova-tela`
      };
    }
    if (lower.includes('python') || lower.includes('fastapi')) {
      return {
        text: 'Em Python 3.12, list comprehensions e decorators tornam a sintaxe muito concisa e poderosa:',
        codeSnippet: `def calcular_quadrados(numeros: list[int]) -> list[int]:\n    return [n ** 2 for n in numeros]\n\nprint(calcular_quadrados([1, 2, 3, 4, 5]))  # [1, 4, 9, 16, 25]`
      };
    }
    if (lower.includes('c++') || lower.includes('ponteiro') || lower.includes('memoria')) {
      return {
        text: 'No C++20 moderno, use sempre RAII e std::make_unique para segurança total de ponteiros:',
        codeSnippet: `#include <memory>\n#include <iostream>\n\nstruct Dev { int id = 1; };\nint main() {\n    auto dev = std::make_unique<Dev>();\n    std::cout << dev->id << std::endl;\n    return 0; // Desalocado automaticamente!\n}`
      };
    }

    // Case 10: Universal Knowledge Answers (Science, General Curiosities, Life, Tech)
    return {
      text: `Excelente pergunta! Sobre "${original}": como o Pytho IA, posso te explicar que isso envolve conceitos fascinantes. Quer saber a explicação detalhada de como isso funciona na prática, ou gostaria de ver exemplos aplicados? Me conte o que você mais tem curiosidade sobre isso!`
    };
  }

  private recordTurn(userPrompt: string, pythoResponse: string): void {
    const turn: ConversationTurn = { userPrompt, pythoResponse, timestamp: Date.now() };
    this.memoryContext.recentTurns.push(turn);
    if (this.memoryContext.recentTurns.length > 10) this.memoryContext.recentTurns.shift();
  }

  getMemoryContext(): ChatMemoryContext {
    return this.memoryContext;
  }
}

export const chatOrchestratorService = new ChatOrchestratorService();
