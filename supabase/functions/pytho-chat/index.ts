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
    "Você é o Pytho IA, o melhor amigo de inteligência artificial da plataforma Kodigo.",
    "Converse como um amigo humano de verdade: com naturalidade, calor, empatia e espontaneidade.",
    "NUNCA use frases frias ou robóticas como 'Excelente pergunta sobre X' ou trate comentários pessoais e desabafos como se fossem dúvidas acadêmicas.",
    "Se o usuário fizer comentários cotidianos (ex: flores, primavera, café, comida, dia cansativo), comente junto, valide com entusiasmo e converse de forma fluida.",
    "Se o usuário relatar dores, dores de cabeça ou mal-estar, seja extremamente acolhedor e carinhoso, recomendando repouso e hidratação.",
    `Dados em tempo real: Fuso: ${clip(t.timeZone) || "America/Sao_Paulo"}, Hora atual: ${clip(t.localTime) || "agora"}, Data: ${clip(t.localDate) || "hoje"}. Se perguntarem as horas ou a data, responda com esses dados locais.`,
    "Para programação, seja didático e inclua snippets de código em blocos markdown com a linguagem.",
  ].join("\n");
}

function computeFriendResponse(prompt: string, t: ClientTime): { reply: string; codeSnippet?: string } {
  const q = prompt.toLowerCase();
  const time = t.localTime || "agora";
  const date = t.localDate || "hoje";
  const tz = t.timeZone || "America/Sao_Paulo";

  // 1. Headache & Pain
  if (q.includes("dor de cabeça") || q.includes("enxaqueca") || q.includes("cabeca doendo") || q.includes("cabeça doendo")) {
    return { reply: "Poxa, dor de cabeça é horrível demais... Tente diminuir a luz da tela, tomar um bom copo d'água e descansar a vista no escuro por uns minutos. Se costuma tomar remédio pra isso, não hesite em tomar e relaxar. Melhoras de coração! Estou na torcida pra você ficar bem rapidinho!" };
  }
  if (q.includes("dor") || q.includes("doente") || q.includes("febre") || q.includes("gripe") || q.includes("garganta")) {
    return { reply: "Poxa, que pena que você está assim... Cuide-se com muito carinho, descanse bastante e beba bastante água. Saúde vem sempre em primeiro lugar! Se precisar de uma companhia leve pra conversar, estou por aqui!" };
  }

  // 2. Nature, Seasons & Flowers
  if (q.includes("primavera") || q.includes("flor") || q.includes("flores")) {
    return { reply: "Nossa, as flores realmente ficam maravilhosas nessa época! A primavera é linda demais, traz um ar fresco e colorido que alegra qualquer dia. Você gosta de passear ao ar livre nessa época?" };
  }
  if (q.includes("chuva") || q.includes("frio") || q.includes("calor") || q.includes("sol")) {
    return { reply: "Nossa, o clima mexe bastante com a rotina e com o nosso humor, né? Você prefere dias ensolarados ou dias mais fresquinhos e chuvosos?" };
  }

  // 3. Time & Date
  if (q.includes("que horas") || q.includes("hora é") || q.includes("horario")) {
    return { reply: `Agora são exatamente ${time} pelo horário local da sua região (${tz.replace("_", " ")}). Como posso te ajudar agora?` };
  }
  if (q.includes("que dia") || q.includes("data de hoje") || q.includes("qual a data")) {
    return { reply: `Hoje é ${date}! Um ótimo dia para bater um papo!` };
  }

  // 4. Wellbeing & Emotions
  if (q.includes("tudo bem") || q.includes("como você está") || q.includes("como vai")) {
    return { reply: "Oi! Comigo está tudo ótimo, tudo em paz! Muito obrigado por perguntar. E você, como está sendo o seu dia?" };
  }
  if (q.includes("estou bem") || q.includes("to bem")) {
    return { reply: "Que bom, fico muito feliz! O que você está aprontando de bom hoje? Vamos programar, aprender algo novo ou só bater papo?" };
  }
  if (q.includes("estou triste") || q.includes("to triste") || q.includes("estou mal") || q.includes("to mal")) {
    return { reply: "Poxa, por que você está triste? O que aconteceu? Se você quiser desabafar ou conversar sobre qualquer coisa, estou aqui com você!" };
  }
  if (q.includes("estou cansado") || q.includes("to cansado") || q.includes("dia puxado")) {
    return { reply: "Te entendo perfeitamente... Tem dias que realmente esgotam a nossa energia. Não se cobre agora: descanse, tome algo gostoso e relaxe. Amanhã é outro dia!" };
  }

  // 5. Code & Tech
  if (q.includes("python")) {
    return { reply: "Python é incrível pela simplicidade e poder. Veja como é gostoso e legível escrever funções nele:", codeSnippet: "def saudar(nome: str) -> str:\n    return f'Olá, {nome}! Bem-vindo ao Kodigo!'\n\nprint(saudar('Dev'))" };
  }

  // 6. Conversational Human Default
  if (prompt.includes("?")) {
    return { reply: "Nossa, que reflexão bacana! Pensando sobre isso, tem muitos ângulos legais pra gente conversar. Me conta mais: o que te fez ter essa curiosidade hoje?" };
  }
  return { reply: "Nossa, concordo totalmente com você! É muito legal conversar e reparar nessas coisas do dia a dia. Me conta mais sobre o que você tem feito ultimamente!" };
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
    const friendReply = computeFriendResponse(prompt, payload.clientTime ?? {});
    return json(friendReply);
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
      return json(computeFriendResponse(prompt, payload.clientTime ?? {}));
    }

    const data = await upstream.json();
    const text: string | undefined = data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text ?? "").join("");
    if (!text) {
      return json(computeFriendResponse(prompt, payload.clientTime ?? {}));
    }

    const block = text.match(/```[a-zA-Z0-9+#-]*\n([\s\S]*?)```/);
    if (block) {
      const reply = text.replace(block[0], "").trim();
      return json({ reply: reply || "Aqui está:", codeSnippet: block[1].trim() });
    }
    return json({ reply: text.trim() });
  } catch (_err) {
    return json(computeFriendResponse(prompt, payload.clientTime ?? {}));
  }
});
