import { ChatMessage } from './ai-chat.types';

class AIChatService {
  private n8nWebhookUrl = 'http://localhost:5678/webhook/kodigo-ai-tutor';

  async askPytho(prompt: string): Promise<ChatMessage> {
    // 1. Try Gemini API directly if key is stored in localStorage or env
    const apiKey = localStorage.getItem('kodigo_gemini_api_key') || ((import.meta as unknown as { env: Record<string, string> }).env?.VITE_GEMINI_API_KEY);
    if (apiKey) {
      try {
        const geminiReply = await this.callGeminiProDirectly(prompt, apiKey);
        if (geminiReply) {
          return {
            id: `msg_${Date.now()}`,
            sender: 'pytho',
            text: geminiReply.text,
            codeSnippet: geminiReply.codeSnippet,
            createdAt: Date.now()
          };
        }
      } catch {
        // Fallback to n8n or local engine
      }
    }

    // 2. Try N8N Webhook connected to Gemini Pro
    try {
      const response = await fetch(this.n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          user: 'kenkobayashi2005@gmail.com',
          model: 'gemini-1.5-pro',
          timestamp: new Date().toISOString()
        })
      });
      if (response.ok) {
        const data = (await response.json()) as { reply: string; codeSnippet?: string };
        return {
          id: `msg_${Date.now()}`,
          sender: 'pytho',
          text: data.reply,
          codeSnippet: data.codeSnippet,
          createdAt: Date.now()
        };
      }
    } catch {
      // Intelligent fallback
    }

    return this.generateNaturalPythoResponse(prompt);
  }

  private async callGeminiProDirectly(prompt: string, apiKey: string): Promise<{ text: string; codeSnippet?: string } | null> {
    const systemPrompt = `Você é o Pytho, uma cobra inteligente, carismática e o amigo mentor de programação da plataforma Kodigo.
Regras da sua persona:
1. Responda a tudo que o usuário perguntar com naturalidade e simpatia.
2. Se o usuário perguntar se você está bem, responda que está tudo ótimo, tudo bem, com energia para conversar.
3. Se o usuário disser que está feliz, diga "Nossa, que legal!" e continue a conversa perguntando o que houve.
4. Se o usuário disser que está triste ou chateado, diga: "Por que você está triste? Tenta melhorar, fazer algo que você goste..." e continue a conversa de forma amigável.
5. Se o usuário fugir muito do assunto (política partidária, meteoros caindo, teorias da conspiração, fofocas), responda exatamente: "Eu sou o seu amigo da programação e, infelizmente, eu não consigo responder essas perguntas. Eu estou aqui para te apoiar e te ajudar nas suas dificuldades de programação."
6. Para perguntas de programação e tecnologia, dê explicações completas, didáticas e mostre snippets de código claros.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nUsuário: ${prompt}` }] }
        ]
      })
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    // Extract code block if present
    const codeMatch = rawText.match(/```(?:[a-zA-Z0-9]+)?\n([\s\S]*?)```/);
    if (codeMatch) {
      const cleanText = rawText.replace(/```(?:[a-zA-Z0-9]+)?\n[\s\S]*?```/, '').trim();
      return { text: cleanText || 'Aqui está o exemplo:', codeSnippet: codeMatch[1].trim() };
    }
    return { text: rawText };
  }

  private generateNaturalPythoResponse(prompt: string): ChatMessage {
    const raw = prompt.trim().toLowerCase();
    let text = '';
    let codeSnippet: string | undefined;

    // 1. Extreme Off-Topic Filter (política, meteoro, fofoca distante)
    const isExtremeOffTopic =
      raw.includes('política') || raw.includes('politica') || raw.includes('eleição') || raw.includes('eleicao') ||
      raw.includes('partido') || raw.includes('presidente') || raw.includes('governo') ||
      raw.includes('meteoro') || raw.includes('asteroide') || raw.includes('disco voador') ||
      raw.includes('fofoca') || raw.includes('celebridade') || raw.includes('novela');

    if (isExtremeOffTopic) {
      text = 'Eu sou o seu amigo da programação e, infelizmente, eu não consigo responder essas perguntas. Eu estou aqui para te apoiar e te ajudar nas suas dificuldades de programação. O que acha de vermos um código legal hoje?';
    }
    // 2. User saying they are happy
    else if (raw.includes('estou feliz') || raw.includes('to feliz') || raw.includes('muito feliz') || raw.includes('alegre') || raw.includes('contente')) {
      text = 'Nossa, que legal! Fico muito contente por você! Me conta, o que aconteceu de bom para você estar feliz assim? Essa energia boa é ótima até para aprender coisas novas!';
    }
    // 3. User saying they are sad / down
    else if (raw.includes('estou triste') || raw.includes('to triste') || raw.includes('muito triste') || raw.includes('chateado') || raw.includes('estou mal') || raw.includes('to mal')) {
      text = 'Por que você está triste? O que aconteceu? Tenta dar uma respirada, se cuidar e tentar melhorar, talvez fazendo algo que você goste bastante. Se quiser conversar um pouco, estou por aqui, ou se preferir se distrair com desafios de código, podemos ir juntos com calma!';
    }
    // 4. Asking if Pytho is well
    else if (raw.includes('você está bem') || raw.includes('voce esta bem') || raw.includes('vc esta bem') || raw.includes('tudo bem') || raw.includes('como você tá') || raw.includes('como vai')) {
      text = 'Comigo está tudo ótimo, está tudo bem! Minhas escamas digitais estão brilhando e meus circuitos prontos para trocar uma ideia bacana com você. E você, como estão as coisas por aí?';
    }
    // 5. Basic greetings
    else if (/^(oi|olá|ola|opa|hello|hey|bom dia|boa tarde|boa noite)\b/.test(raw) && raw.length < 25) {
      text = 'Oi! Que alegria ter você aqui por perto! Como você está hoje? Me conte o que você quer ver ou conversar!';
    }
    // 6. Programming & Software Topics
    else if (raw.includes('git') || raw.includes('commit') || raw.includes('branch')) {
      text = 'No Git profissional, organize seu trabalho com commits semânticos e comandos modernos:';
      codeSnippet = `git switch -c feature/nova-tela\ngit add .\ngit commit -m "feat: adicionar validacao de dados"\ngit push -u origin feature/nova-tela`;
    } else if (raw.includes('html') || raw.includes('tag') || raw.includes('semant')) {
      text = 'O HTML5 semântico organiza sua página com clareza para mecanismos de busca e acessibilidade:';
      codeSnippet = `<header>\n  <nav aria-label="Navegação Principal">\n    <a href="/">Home</a>\n  </nav>\n</header>\n<main>\n  <h1>Título Central</h1>\n</main>`;
    } else if (raw.includes('flexbox') || raw.includes('grid') || raw.includes('centralizar') || raw.includes('css')) {
      text = 'Para centralizar perfeitamente no CSS moderno com Flexbox:';
      codeSnippet = `.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n}`;
    } else if (raw.includes('javascript') || raw.includes('js') || raw.includes('closure') || raw.includes('promise')) {
      text = 'Em JavaScript moderno, utilize async/await para lidar com código assíncrono de maneira limpa:';
      codeSnippet = `async function buscarUsuarios() {\n  try {\n    const res = await fetch('/api/users');\n    const data = await res.json();\n    return data;\n  } catch (err) {\n    console.error('Falha:', err);\n  }\n}`;
    } else if (raw.includes('typescript') || raw.includes('ts') || raw.includes('interface')) {
      text = 'No TypeScript, interfaces definem contratos claros e evitam bugs em tempo de compilação:';
      codeSnippet = `interface Dev {\n  id: string;\n  nome: string;\n  senioridade: 'junior' | 'pleno' | 'senior';\n}\nconst programador: Dev = { id: '1', nome: 'Dev', senioridade: 'pleno' };`;
    } else if (raw.includes('python') || raw.includes('def') || raw.includes('fastapi')) {
      text = 'Em Python 3, tipagem e list comprehensions tornam o código conciso e elegante:';
      codeSnippet = `def dobrar_positivos(numeros: list[int]) -> list[int]:\n    return [n * 2 for n in numeros if n > 0]\n\nprint(dobrar_positivos([-2, 1, 3, 5]))  # [2, 6, 10]`;
    } else if (raw.includes('c++') || raw.includes('ponteiro') || raw.includes('memoria')) {
      text = 'No C++20 moderno, use smart pointers para gerenciar memória automaticamente sem vazamentos:';
      codeSnippet = `#include <memory>\n#include <iostream>\n\nstruct Objeto { int valor = 42; };\nint main() {\n    auto ptr = std::make_unique<Objeto>();\n    std::cout << ptr->valor << std::endl;\n    return 0; // Memória liberada automaticamente!\n}`;
    } else {
      text = `Com certeza! Eu sou o Pytho, seu amigo da programação. Sobre "${prompt}", me diga mais detalhes: você quer entender o conceito teórico, ver um exemplo prático de código ou resolver algum problema específico? Estou aqui contigo!`;
    }

    return {
      id: `msg_${Date.now()}`,
      sender: 'pytho',
      text,
      codeSnippet,
      createdAt: Date.now()
    };
  }
}

export const aiChatService = new AIChatService();
