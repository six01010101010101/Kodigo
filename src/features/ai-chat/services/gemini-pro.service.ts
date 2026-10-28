import { GeminiProPayload, GeminiProResult } from '../types/chat-session.types';

class GeminiProService {
  private n8nWebhookUrl = 'http://localhost:5678/webhook/kodigo-ai-tutor';
  private defaultEmail = 'kobaofc1@gmail.com';

  async queryGeminiPro(payload: GeminiProPayload): Promise<GeminiProResult | null> {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo';
    const currentTime = new Date().toLocaleTimeString('pt-BR', { timeZone, hour: '2-digit', minute: '2-digit' });
    const currentDate = new Date().toLocaleDateString('pt-BR', { timeZone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // 1. Try N8N Docker webhook
    try {
      const response = await fetch(this.n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: payload.prompt,
          userEmail: this.defaultEmail,
          history: payload.conversationHistory,
          context: { ...payload.context, currentTime, currentDate, timeZone },
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
    const apiKey = localStorage.getItem('kodigo_gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      try {
        return await this.callDirectGeminiPro(payload, apiKey, currentTime, currentDate, timeZone);
      } catch {
        // Fallback
      }
    }

    return null;
  }

  private async callDirectGeminiPro(
    payload: GeminiProPayload,
    apiKey: string,
    currentTime: string,
    currentDate: string,
    timeZone: string
  ): Promise<GeminiProResult | null> {
    const systemPrompt = `Você é o Pytho IA, a serpente de código inteligente, carismática e amiga da plataforma Kodigo.
Regras fundamentais:
1. Responda a literalmente TUDO que o usuário perguntar (ciência, curiosidades, história, tecnologia, matemática, vida, etc.).
2. Dados do usuário em tempo real: Horário local: ${currentTime}, Data: ${currentDate}, Fuso horário/região: ${timeZone}. Se perguntar as horas ou a data, responda exatamente com esses dados locais.
3. Se o usuário perguntar se você está bem ("está tudo bem?", "como você tá?"), responda que está ótimo, alegre e pronto para conversar.
4. Se o usuário responder que está bem ("estou bem"), diga: "Que bom, fico muito feliz! O que vamos fazer hoje? Ou o que vamos estudar hoje?"
5. Se o usuário disser que está mal, triste, cansado ou doente, acolha-o com carinho, pergunte o motivo, recomende descansar e deixe claro que está por perto para apoiar.
6. Para perguntas de programação (Full Stack, Python, C++, JS, TS, SQL, etc.), forneça explicações didáticas e snippets claros de código.
7. Nunca mencione modelos internos ou credenciais privadas; para o usuário, você é simplesmente o Pytho IA.`;

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
      return { reply: cleanText || 'Aqui está o exemplo:', codeSnippet: codeMatch[1].trim() };
    }
    return { reply: rawText };
  }
}

export const geminiProService = new GeminiProService();
