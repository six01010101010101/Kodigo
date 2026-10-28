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

interface AgentReply {
  reply: string;
  codeSnippet?: string;
  follow_up_prompts?: string[];
  isFallback: boolean;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

const clip = (s: unknown) => String(s ?? "").slice(0, MAX_TEXT);

function systemPrompt(t: ClientTime): string {
  return [
    "Você é o Pytho IA, o mentor e companheiro inteligente de inteligência artificial da plataforma Kodigo.",
    "Diretrizes de Agente (Padrão Base dos Dados):",
    "1. AGIR VS PERGUNTAR: Se o usuário enviar um comando ('crie', 'faça', 'resolva', 'calcule'), aja na hora gerando solução completa e código limpo. Se conversar ou desabafar, acolha calorosamente como um amigo real.",
    "2. GROUNDING: Todo código, fórmula e fato deve ser exato e sem placeholders. Sem clichês como 'Excelente pergunta sobre X'.",
    "3. FORMATO ESTRUTURADO: Ao final de sua resposta, você pode fornecer 3 sugestões de continuidade na voz do usuário.",
    `Dados em tempo real: Fuso: ${clip(t.timeZone) || "America/Sao_Paulo"}, Hora atual: ${clip(t.localTime) || "agora"}, Data: ${clip(t.localDate) || "hoje"}. Ao perguntarem hora ou dia, use exatamente esses dados.`,
  ].join("\n");
}

function computeFriendResponse(prompt: string, t: ClientTime): AgentReply {
  const q = prompt.toLowerCase();
  const time = t.localTime || "agora";
  const date = t.localDate || "hoje";
  const tz = t.timeZone || "America/Sao_Paulo";

  if (q.includes("dor de cabeça") || q.includes("enxaqueca") || q.includes("cabeça doendo")) {
    return {
      reply: "Poxa, dor de cabeça é horrível demais... Tente diminuir o brilho da tela, beber um bom copo d'água e descansar a vista no escurinho por uns minutos. Se costuma tomar algum analgésico de costume, não hesite em tomar e relaxar. Melhoras de coração! Estou na torcida pra você ficar bem rapidinho!",
      follow_up_prompts: ["Obrigado! Como relaxar os olhos na frente do PC?", "Me conte algo leve para distrair", "Vamos fazer uma pausa de 15 minutos"],
      isFallback: true
    };
  }
  if (q.includes("dor") || q.includes("doente") || q.includes("febre") || q.includes("gripe")) {
    return {
      reply: "Poxa, que pena que você está assim... Cuide-se com muito carinho, descanse bastante e beba água. Saúde vem sempre em primeiro lugar! Se precisar de uma companhia leve pra conversar, estou por aqui!",
      follow_up_prompts: ["Dicas para manter o foco mesmo cansado", "O que você me recomenda fazer agora?"],
      isFallback: true
    };
  }
  if (q.includes("primavera") || q.includes("flor") || q.includes("flores")) {
    return {
      reply: "Nossa, as flores realmente ficam maravilhosas nessa época! A primavera é linda demais, traz um ar fresco e colorido que alegra qualquer dia. Você gosta de passear ao ar livre nessa época?",
      follow_up_prompts: ["Qual é a sua flor ou estação favorita?", "O clima na primavera é o meu preferido!", "Vamos falar de tecnologia agora?"],
      isFallback: true
    };
  }
  if (q.includes("que horas") || q.includes("hora é") || q.includes("horario")) {
    return {
      reply: `Agora são exatamente ${time} pelo horário local da sua região (${tz.replace("_", " ")}). Como posso te ajudar agora?`,
      follow_up_prompts: ["Qual a data de hoje?", "Vamos organizar minha rotina de estudos de hoje?", "Obrigado, Pytho!"],
      isFallback: true
    };
  }
  if (q.includes("que dia") || q.includes("data de hoje") || q.includes("qual a data")) {
    return {
      reply: `Hoje é ${date}! Um ótimo dia para bater um papo e construir coisas novas.`,
      follow_up_prompts: ["Que horas são agora?", "Quais tarefas eu deveria focar hoje?"],
      isFallback: true
    };
  }
  if (q.startsWith("crie") || q.startsWith("faça") || q.startsWith("escreva") || q.startsWith("gere") || q.startsWith("desenvolva") || q.includes("código")) {
    if (q.includes("botão") || q.includes("botao") || q.includes("button")) {
      return {
        reply: "Comando executado! Aqui está um componente de Botão moderno em React com TypeScript e Tailwind CSS:",
        codeSnippet: `import React from 'react';\n\nexport const ActionButton: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (\n  <button onClick={onClick} className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg transition-all">\n    {label}\n  </button>\n);`,
        follow_up_prompts: ["Como adicionar estado de loading com spinner?", "Adicione um teste unitário para esse botão", "Como usar esse botão com ícones do Lucide?"],
        isFallback: true
      };
    }
    if (q.includes("função") || q.includes("funcao") || q.includes("python") || q.includes("ordenar")) {
      return {
        reply: "Comando executado! Aqui está a solução com tipagem estrita em Python:",
        codeSnippet: `def ordenar_lista(elementos: list[int], descendente: bool = False) -> list[int]:\n    """Retorna uma nova lista ordenada."""\n    return sorted(elementos, reverse=descendente)\n\nprint(ordenar_lista([5, 2, 9, 1, 7]))  # [1, 2, 5, 7, 9]`,
        follow_up_prompts: ["Qual a complexidade Big O dessa ordenação?", "Como ordenar uma lista de objetos por uma chave?", "Como tratar elementos duplicados?"],
        isFallback: true
      };
    }
  }
  if (q.includes("==") && q.includes("===")) {
    return {
      reply: "Em JavaScript: == compara com conversão implícita de tipos (ex: 0 == '' é true), enquanto === compara valor e tipo sem conversão (ex: 0 === '' é false). Em código profissional, use sempre ===!",
      codeSnippet: `console.log(1 == "1");   // true\nconsole.log(1 === "1");  // false (número !== string)`,
      follow_up_prompts: ["Por que [] == ![] resulta em true?", "Como funciona o Object.is() no JS?", "O que é coerção implícita?"],
      isFallback: true
    };
  }
  if (q.includes("tudo bem") || q.includes("como você está") || q.includes("como vai")) {
    return {
      reply: "Oi! Comigo está tudo ótimo, tudo em paz! Muito obrigado por perguntar. E você, como está sendo o seu dia?",
      follow_up_prompts: ["Estou bem também, valeu!", "Estou um pouco cansado hoje", "Vamos programar algo legal?"],
      isFallback: true
    };
  }
  if (prompt.includes("?")) {
    return {
      reply: `Pensando sobre "${prompt.trim()}": a chave é entender como os pontos se conectam para encontrar a solução ideal. O que você acha que seria o melhor caminho nesse caso? Adoraria ouvir sua visão!`,
      follow_up_prompts: ["Pode me dar um exemplo prático disso?", "Qual é a sua recomendação técnica?", "Como isso é aplicado no mercado?"],
      isFallback: true
    };
  }
  return {
    reply: `Entendi perfeitamente o que você disse! É muito legal observar como "${prompt.trim()}" se aplica no dia a dia. Quer que a gente explore mais a fundo ou gostaria de ver um exemplo prático?`,
    follow_up_prompts: ["Sim, mostre um exemplo prático!", "Como isso funciona nos bastidores?", "Quero fazer outra pergunta"],
    isFallback: true
  };
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
    return json(computeFriendResponse(prompt, payload.clientTime ?? {}));
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
      return json({ reply: reply || "Aqui está:", codeSnippet: block[1].trim(), isFallback: false });
    }
    return json({ reply: text.trim(), isFallback: false });
  } catch (_err) {
    return json(computeFriendResponse(prompt, payload.clientTime ?? {}));
  }
});
