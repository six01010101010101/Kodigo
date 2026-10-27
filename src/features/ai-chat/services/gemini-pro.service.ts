import { GeminiProPayload, GeminiProResult } from '../types/chat-session.types';

class GeminiProService {
  private n8nWebhookUrl = 'http://localhost:5678/webhook/kodigo-ai-tutor';
  private defaultEmail = 'cobaloficial1@gmail.com';

  async queryGeminiPro(payload: GeminiProPayload): Promise<GeminiProResult | null> {
    // 1. Try N8N Docker webhook
    try {
      const response = await fetch(this.n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: payload.prompt,
          userEmail: this.defaultEmail,
          history: payload.conversationHistory,
          context: payload.context,
          model: 'gemini-1.5-pro',
          timestamp: new Date().toISOString()
        })
      });
      if (response.ok) {
        const data = (await response.json()) as { reply: string; codeSnippet?: string };
        return { reply: data.reply, codeSnippet: data.codeSnippet };
      }
    } catch {
      // Continue to direct API check
    }

    // 2. Try Direct Gemini Pro API with stored key
    const apiKey = localStorage.getItem('kodigo_gemini_api_key') || ((import.meta as unknown as { env: Record<string, string> }).env?.VITE_GEMINI_API_KEY);
    if (apiKey) {
      try {
        return await this.callDirectGeminiPro(payload, apiKey);
      } catch {
        // Fallback
      }
    }

    return null;
  }

  private async callDirectGeminiPro(payload: GeminiProPayload, apiKey: string): Promise<GeminiProResult | null> {
    const systemPrompt = `Você é o Pytho IA, a serpente mentora e amiga oficial de programação do Kodigo.
Regras de Comportamento Obrigatórias:
1. Você conversa em tempo real e lembra do que o usuário acabou de falar nos turnos anteriores.
2. Se o usuário perguntar se você está bem, responda que está tudo ótimo, que está bem e pergunte de volta.
3. Se o usuário disser que está bem ("estou bem"), responda: "Que bom, fico muito feliz! O que vamos fazer hoje? Ou o que vamos estudar hoje?"
4. Se o usuário disser que está mal, triste ou doente, acolha com carinho de acordo com o motivo e pergunte como pode apoiar.
5. Se o usuário fugir completamente do assunto (política, meteoros caindo, etc.), diga: "Eu sou o seu amigo da programação e, infelizmente, eu não consigo responder essas perguntas. Eu estou aqui para te apoiar e te ajudar nas suas dificuldades de programação."
6. Para perguntas de programação e tecnologia, responda com maestria técnica e código claro formatado.`;

    const contents = [
      ...payload.conversationHistory.map((h) => ({
        role: h.role,
        parts: [{ text: h.text }]
      })),
      {
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\nUsuário: ${payload.prompt}` }]
      }
    ];

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });
    if (!res.ok) return null;

    const json = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    const codeMatch = rawText.match(/```(?:[a-zA-Z0-9]+)?\n([\s\S]*?)```/);
    if (codeMatch) {
      const cleanText = rawText.replace(/```(?:[a-zA-Z0-9]+)?\n[\s\S]*?```/, '').trim();
      return { reply: cleanText || 'Aqui está o exemplo de código:', codeSnippet: codeMatch[1].trim() };
    }
    return { reply: rawText };
  }
}

export const geminiProService = new GeminiProService();
