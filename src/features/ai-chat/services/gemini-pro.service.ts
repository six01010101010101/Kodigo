import { GeminiProPayload, GeminiProResult } from '../types/chat-session.types';

class GeminiProService {
  private n8nWebhookUrl = 'http://localhost:5678/webhook/kodigo-ai-tutor';
  private edgeFunctionUrl = 'https://oxaydmsemyjrmyhnxwpt.supabase.co/functions/v1/pytho-chat';
  private defaultEmail = 'kobaofc1@gmail.com';

  async queryGeminiPro(payload: GeminiProPayload): Promise<GeminiProResult | null> {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo';
    const currentTime = new Date().toLocaleTimeString('pt-BR', { timeZone, hour: '2-digit', minute: '2-digit' });
    const currentDate = new Date().toLocaleDateString('pt-BR', { timeZone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const apiKey = localStorage.getItem('kodigo_gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY;

    // 1. Try N8N webhook with quick timeout
    try {
      const response = await fetch(this.n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(400),
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
        if (data.reply) return { reply: data.reply, codeSnippet: data.codeSnippet, isFallback: false };
      }
    } catch {
      // Continue
    }

    // 2. Try Supabase Edge Function
    const edgeResult = await this.callEdgeFunction(payload, currentTime, currentDate, timeZone, apiKey);
    if (edgeResult && !edgeResult.isFallback) return edgeResult;

    // 3. Try Direct Gemini Pro API with stored key if edge was fallback
    if (apiKey) {
      try {
        const direct = await this.callDirectGeminiPro(payload, apiKey, currentTime, currentDate, timeZone);
        if (direct) return direct;
      } catch {
        // Fallback
      }
    }

    return edgeResult || null;
  }

  private async callEdgeFunction(
    payload: GeminiProPayload,
    currentTime: string,
    currentDate: string,
    timeZone: string,
    apiKey?: string
  ): Promise<GeminiProResult | null> {
    try {
      const res = await fetch(this.edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { 'x-gemini-key': apiKey } : {})
        },
        body: JSON.stringify({
          prompt: payload.prompt,
          history: payload.conversationHistory,
          clientTime: { timeZone, localTime: currentTime, localDate: currentDate },
          apiKey
        })
      });
      if (res.ok) {
        const data = (await res.json()) as {
          reply?: string;
          codeSnippet?: string;
          follow_up_prompts?: string[];
          followUpPrompts?: string[];
          isFallback?: boolean;
        };
        if (data.reply) {
          return {
            reply: data.reply,
            codeSnippet: data.codeSnippet,
            followUpPrompts: data.follow_up_prompts || data.followUpPrompts,
            isFallback: data.isFallback === true
          };
        }
      }
    } catch {
      // Ignored
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
    const systemPrompt = `Você é o Pytho IA, mentor inteligente e amigo da plataforma Kodigo.
1. Responda a qualquer dúvida ou comando (ciência, tecnologia, programação, cotidiano).
2. Horário local: ${currentTime}, Data: ${currentDate}, Fuso: ${timeZone}.
3. Sem clichês como 'Excelente pergunta sobre...'. Responda direto, empático e prestativo.`;

    const contents = [
      ...payload.conversationHistory.map((h) => ({ role: h.role, parts: [{ text: h.text }] })),
      { role: 'user', parts: [{ text: `${systemPrompt}\n\nUsuário: ${payload.prompt}` }] }
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
      return { reply: cleanText || 'Aqui está o exemplo:', codeSnippet: codeMatch[1].trim(), isFallback: false };
    }
    return { reply: rawText, isFallback: false };
  }
}

export const geminiProService = new GeminiProService();
