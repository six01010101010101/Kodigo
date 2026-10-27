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
      userEmail: 'cobaloficial1@gmail.com',
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

    // 2. Intelligent Multi-turn Context Engine (Full Conversational Continuity)
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
    const lastTurn = this.memoryContext.recentTurns[this.memoryContext.recentTurns.length - 1];
    const prevPytho = lastTurn?.pythoResponse?.toLowerCase() || '';

    // Multi-turn context check: Pytho previously asked how the user is ("e você, como está?")
    const pythoAskedAboutUser = prevPytho.includes('e com você') || prevPytho.includes('e você') || prevPytho.includes('como você');

    // Case 1: User says they are well after being asked
    if (pythoAskedAboutUser && (lower.includes('estou bem') || lower.includes('to bem') || lower === 'bem' || lower.includes('tudo certo') || lower.includes('tudo bem'))) {
      this.memoryContext.lastEmotionalState = 'well';
      return {
        text: 'Que bom, estou muito feliz! O que vamos fazer hoje? Ou o que vamos estudar hoje? Temos trilhas de HTML, CSS, JavaScript, TypeScript, Python e C++ prontas!'
      };
    }

    // Case 2: User says they are happy
    if (lower.includes('estou feliz') || lower.includes('to feliz') || lower.includes('muito feliz') || lower.includes('alegre')) {
      this.memoryContext.lastEmotionalState = 'happy';
      return {
        text: 'Nossa, que legal! Fico muito contente por você! Me conta, o que aconteceu de bom hoje? Essa energia boa é excelente para focar nos seus objetivos e aprender algo novo!'
      };
    }

    // Case 3: User says they are ill / sick
    if (lower.includes('doente') || lower.includes('febre') || lower.includes('gripe') || lower.includes('com dor') || lower.includes('dor de cabeça')) {
      this.memoryContext.lastEmotionalState = 'sick';
      return {
        text: 'Poxa, que pena que você está doente... Saúde sempre vem em primeiro lugar! Tente descansar, tomar bastante líquido, se alimentar bem e se cuidar. Quando você estiver 100% recuperado, eu estarei aqui para codarmos juntos!'
      };
    }

    // Case 4: User says they are sad or bad
    if (lower.includes('estou mal') || lower.includes('to mal') || lower.includes('estou triste') || lower.includes('to triste') || lower.includes('chateado') || lower.includes('desanimado')) {
      this.memoryContext.lastEmotionalState = 'sad';
      return {
        text: 'Por que você está triste? O que aconteceu? Tente fazer algo que te deixe bem e te dê paz. Se quiser conversar um pouco, estou por aqui, e quando você se sentir pronto para ver códigos, estaremos juntos!'
      };
    }

    // Case 5: Extreme off-topic filter (politics, meteors, gossip)
    const isExtremeOffTopic =
      lower.includes('política') || lower.includes('politica') || lower.includes('eleição') || lower.includes('eleicao') ||
      lower.includes('partido') || lower.includes('presidente') || lower.includes('governo') ||
      lower.includes('meteoro') || lower.includes('asteroide') || lower.includes('fofoca') || lower.includes('celebridade');

    if (isExtremeOffTopic) {
      return {
        text: 'Eu sou o seu amigo da programação e, infelizmente, eu não consigo responder essas perguntas. Eu estou aqui para te apoiar e te ajudar nas suas dificuldades de programação. O que acha de vermos um código legal hoje?'
      };
    }

    // Case 6: User asks if Pytho is well
    if (lower.includes('você está bem') || lower.includes('voce esta bem') || lower.includes('vc esta bem') || lower.includes('tudo bem') || lower.includes('como vai') || lower.includes('como você está')) {
      return {
        text: 'Oi! Eu estou ótimo, está tudo bem! Meus módulos estão operando a todo vapor e estou muito animado para conversar com você. E com você, está tudo bem?'
      };
    }

    // Case 7: Simple greeting
    if (/^(oi|olá|ola|opa|hello|hey)\b/.test(lower) && lower.length < 20) {
      return {
        text: 'Oi! Que alegria ter você aqui por perto! Tudo bem com você?'
      };
    }

    // Case 8: Programming topic responses
    if (lower.includes('git') || lower.includes('commit') || lower.includes('branch')) {
      return {
        text: 'No Git profissional, utilize commits semânticos para manter o histórico da equipe impecável:',
        codeSnippet: `git switch -c feature/nova-tela\ngit add .\ngit commit -m "feat: implementar autenticacao em tempo real"\ngit push -u origin feature/nova-tela`
      };
    }
    if (lower.includes('python') || lower.includes('fastapi')) {
      return {
        text: 'Em Python 3.12, tipagem e list comprehensions tornam o código muito legível e rápido:',
        codeSnippet: `def filtrar_pares(numeros: list[int]) -> list[int]:\n    return [n for n in numeros if n % 2 == 0]\n\nprint(filtrar_pares([1, 2, 3, 4, 5, 6]))  # [2, 4, 6]`
      };
    }
    if (lower.includes('typescript') || lower.includes('ts') || lower.includes('interface')) {
      return {
        text: 'No TypeScript, interfaces fornecem tipagem estrita para evitar bugs antes de rodar o código:',
        codeSnippet: `interface Aluno {\n  id: string;\n  nome: string;\n  xp: number;\n}\nconst dev: Aluno = { id: '1', nome: 'Dev', xp: 280 };`
      };
    }
    if (lower.includes('c++') || lower.includes('ponteiro') || lower.includes('memoria')) {
      return {
        text: 'No C++20, smart pointers como std::unique_ptr gerenciam o ciclo de vida do objeto com RAII:',
        codeSnippet: `#include <memory>\n#include <iostream>\n\nstruct Node { int id = 42; };\nint main() {\n    auto n = std::make_unique<Node>();\n    std::cout << n->id << std::endl;\n    return 0; // Desalocado automaticamente!\n}`
      };
    }

    return {
      text: `Eu sou o Pytho IA, seu amigo da programação! Sobre "${original}", como posso te ajudar no desenvolvimento Full Stack ou nas suas dúvidas de código hoje? Me diga qual tecnologia quer explorar!`
    };
  }

  private recordTurn(userPrompt: string, pythoResponse: string): void {
    const turn: ConversationTurn = {
      userPrompt,
      pythoResponse,
      timestamp: Date.now()
    };
    this.memoryContext.recentTurns.push(turn);
    if (this.memoryContext.recentTurns.length > 10) {
      this.memoryContext.recentTurns.shift();
    }
  }

  getMemoryContext(): ChatMemoryContext {
    return this.memoryContext;
  }
}

export const chatOrchestratorService = new ChatOrchestratorService();
