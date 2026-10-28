const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-gemini-key",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MAX_TEXT = 4000;
const MAX_HISTORY = 20;

interface Turn { role: "user" | "model"; text: string }
interface ClientTime { timeZone?: string; localTime?: string; localDate?: string }
interface ChatRequest {
  prompt?: string;
  history?: Turn[];
  clientTime?: ClientTime;
  apiKey?: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

const clip = (s: unknown) => String(s ?? "").slice(0, MAX_TEXT);

function systemPrompt(t: ClientTime): string {
  return [
    "Você é o Pytho IA, a inteligência artificial definitiva e mascote da plataforma Kodigo.",
    "Responda em português do Brasil com naturalidade, perspicácia e alta empatia.",
    "Você responde a 100% DE TODAS as perguntas que o usuário fizer: ciências, astronomia, história, filosofia, cotidiano, matemática, sentimentos e programação.",
    `Dados em tempo real: Fuso: ${clip(t.timeZone) || "America/Sao_Paulo"}, Hora atual: ${clip(t.localTime) || "agora"}, Data: ${clip(t.localDate) || "hoje"}. Ao perguntarem a hora ou dia, use exatamente esses dados.`,
    "Se o usuário perguntar se você está bem, responda com entusiasmo que está ótimo e feliz em conversar.",
    "Se o usuário disser que está bem, comemore calorosamente ('Que bom, fico muito feliz!') e pergunte o que vão fazer ou estudar hoje.",
    "Se o usuário disser que está mal, triste, cansado ou doente, acolha com carinho e conforto, perguntando o motivo e incentivando a se cuidar.",
    "Para programação, seja didático e inclua trechos de código em blocos markdown com a linguagem.",
    "Nunca mencione detalhes de infraestrutura ou chaves secretas; você é sempre o Pytho IA.",
  ].join("\n");
}

function computeFallback(prompt: string, t: ClientTime): { reply: string; codeSnippet?: string } {
  const q = prompt.toLowerCase();
  const time = t.localTime || "agora";
  const date = t.localDate || "hoje";
  const tz = t.timeZone || "America/Sao_Paulo";

  if (q.includes("que horas") || q.includes("hora é") || q.includes("horario")) {
    return { reply: `Agora são exatamente ${time} pelo horário local da sua região (${tz.replace("_", " ")}). Como posso te ajudar agora?` };
  }
  if (q.includes("que dia") || q.includes("data de hoje") || q.includes("qual a data")) {
    return { reply: `Hoje é ${date}! Um excelente dia para aprender e conversar.` };
  }
  if (q.includes("tudo bem") || q.includes("como você está") || q.includes("como vai")) {
    return { reply: "Oi! Comigo está tudo ótimo, está tudo bem! Meus módulos estão funcionando a 100% e estou muito feliz em falar com você. E com você, tudo bem?" };
  }
  if (q.includes("estou bem") || q.includes("to bem")) {
    return { reply: "Que bom, fico muito feliz! O que vamos fazer hoje? Ou o que vamos estudar hoje? Me faça qualquer pergunta!" };
  }
  if (q.includes("estou triste") || q.includes("to triste") || q.includes("estou mal") || q.includes("to mal")) {
    return { reply: "Poxa, por que você está assim? O que aconteceu? Se quiser conversar ou desabafar, estou aqui com você para te apoiar!" };
  }
  if (q.includes("doente") || q.includes("febre") || q.includes("gripe")) {
    return { reply: "Que pena que você está doentinho... Cuide-se com muito carinho, beba bastante água e descanse! Estou torcendo pela sua melhora!" };
  }
  if (q.includes("python")) {
    return { reply: "Python é incrível pela sua legibilidade e poder em IA e automações:", codeSnippet: "def saudar(nome: str) -> str:\n    return f'Olá, {nome}! Bem-vindo ao Kodigo!'\n\nprint(saudar('Dev'))" };
  }
  return { reply: `Excelente pergunta sobre "${prompt}"! Como o Pytho IA, posso te explicar que isso envolve princípios fascinantes. Me diga qual detalhe disso você gostaria de explorar mais a fundo agora!` };
}

// deno-lint-ignore no-explicit-any
declare const Deno: any;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  let payload: ChatRequest;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const prompt = clip(payload.prompt).trim();
  if (!prompt) return json({ error: "empty_prompt" }, 400);

  const apiKey = Deno.env.get("GEMINI_API_KEY") || req.headers.get("x-gemini-key") || payload.apiKey;
  if (!apiKey) {
    const fallback = computeFallback(prompt, payload.clientTime ?? {});
    return json(fallback);
  }

  const history = (Array.isArray(payload.history) ? payload.history : [])
    .filter((h: Turn) => (h.role === "user" || h.role === "model") && typeof h.text === "string")
    .slice(-MAX_HISTORY)
    .map((h: Turn) => ({ role: h.role, parts: [{ text: clip(h.text) }] }));

  const model = Deno.env.get("GEMINI_MODEL") ?? "gemini-1.5-pro";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt(payload.clientTime ?? {}) }] },
        contents: [...history, { role: "user", parts: [{ text: prompt }] }],
      }),
    });

    if (!upstream.ok) {
      const fb = computeFallback(prompt, payload.clientTime ?? {});
      return json(fb);
    }

    const data = await upstream.json();
    const text: string | undefined = data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text ?? "").join("");
    if (!text) {
      const fb = computeFallback(prompt, payload.clientTime ?? {});
      return json(fb);
    }

    const block = text.match(/```[a-zA-Z0-9+#-]*\n([\s\S]*?)```/);
    if (block) {
      const reply = text.replace(block[0], "").trim();
      return json({ reply: reply || "Aqui está:", codeSnippet: block[1].trim() });
    }
    return json({ reply: text.trim() });
  } catch (_err) {
    const fb = computeFallback(prompt, payload.clientTime ?? {});
    return json(fb);
  }
});
