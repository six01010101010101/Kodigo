import { ChatMessage } from '../../../types/mobile.types';
import { EDGE_FUNCTION_URL } from '../../../services/supabase.client';

interface ChatResponse {
  reply: string;
  codeSnippet?: string;
}

class MobileChatService {
  async askPytho(prompt: string, history: ChatMessage[]): Promise<ChatMessage> {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo';
    const localTime = new Date().toLocaleTimeString('pt-BR', { timeZone, hour: '2-digit', minute: '2-digit' });
    const localDate = new Date().toLocaleDateString('pt-BR', { timeZone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const formattedHistory = history.slice(-10).map((m) => ({
      role: m.sender === 'user' ? ('user' as const) : ('model' as const),
      text: m.text,
    }));

    try {
      const res = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          history: formattedHistory,
          clientTime: { timeZone, localTime, localDate },
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as ChatResponse;
        if (data?.reply) {
          return {
            id: `pytho_${Date.now()}`,
            sender: 'pytho',
            text: data.reply,
            codeSnippet: data.codeSnippet,
            createdAt: Date.now(),
          };
        }
      }
    } catch {
      // Graceful fallback below
    }

    // Dynamic empathetic fallback if edge function is unreachable
    const lower = prompt.toLowerCase();
    let fallbackText = 'Sssss! Estou aqui com você para te apoiar em cada linha de código!';

    if (lower.includes('tudo bem') || lower.includes('como vai') || lower.includes('como você tá')) {
      fallbackText = 'Sssss! Estou ótimo e cheio de energia para programar! E você, como está se sentindo hoje?';
    } else if (lower.includes('estou bem') || lower.includes('tô bem')) {
      fallbackText = 'Que notícia maravilhosa! Fico muito feliz! O que vamos construir ou estudar hoje?';
    } else if (lower.includes('estou mal') || lower.includes('estou triste') || lower.includes('doente')) {
      fallbackText = 'Sinto muito que você esteja passando por isso. Descanse um pouco e cuide de você com carinho. Estou sempre por aqui torcendo pela sua melhora!';
    } else if (lower.includes('que horas') || lower.includes('horas')) {
      fallbackText = `Agora são exatamente ${localTime} em ${timeZone}!`;
    }

    return {
      id: `pytho_${Date.now()}`,
      sender: 'pytho',
      text: fallbackText,
      createdAt: Date.now(),
    };
  }
}

export const mobileChatService = new MobileChatService();
