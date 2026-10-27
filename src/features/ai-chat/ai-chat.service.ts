import { ChatMessage } from './ai-chat.types';

class AIChatService {
  private n8nWebhookUrl = 'http://localhost:5678/webhook/kodigo-ai-tutor';

  async askPytho(prompt: string): Promise<ChatMessage> {
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

  private generateNaturalPythoResponse(prompt: string): ChatMessage {
    const raw = prompt.trim().toLowerCase();
    let text = '';
    let codeSnippet: string | undefined;

    // 1. Basic Greetings
    if (/^(oi|olá|ola|opa|hello|hey|bom dia|boa tarde|boa noite)\b/.test(raw) && raw.length < 25) {
      text = 'Oi! Que alegria ter você aqui por perto! Em que posso te ajudar hoje?';
    }
    // 2. Asking if Pytho is well
    else if (raw.includes('você está bem') || raw.includes('voce esta bem') || raw.includes('vc esta bem') || raw.includes('tudo bem') || raw.includes('como vai') || raw.includes('como você está')) {
      text = 'Comigo está tudo ótimo! Meus circuitos estão aquecidos, escamas digitais brilhando e estou super animado para compartilhar conhecimento de tecnologia com você. E você, como está sendo o seu dia?';
    }
    // 3. User feeling bad / sad / sick / down
    else if (
      raw.includes('estou mal') || raw.includes('to mal') || raw.includes('me sentindo mal') ||
      raw.includes('estou triste') || raw.includes('to triste') || raw.includes('estou chateado') ||
      raw.includes('estou enjoado') || raw.includes('estou com fome') || raw.includes('estou doente') ||
      raw.includes('para baixo') || raw.includes('desanimado')
    ) {
      text = 'Que triste, que pena que você está assim. Tente arranjar algo para que você fique bem, como descansar um pouco, respirar fundo, tomar uma água ou conversar com alguém querido. Eu, no momento, não posso te ajudar muito com isso porque sou apenas uma inteligência artificial e o seu mentor de programação aqui no Kodigo. Mas torço para que melhore logo! Quando quiser ver código, estarei aqui.';
    }
    // 4. Programming & Software Engineering Topics
    else if (raw.includes('git') || raw.includes('commit') || raw.includes('branch') || raw.includes('merge') || raw.includes('rebase')) {
      text = 'No Git profissional, organize seu trabalho com commits semânticos e comandos modernos:';
      codeSnippet = `git switch -c feature/nova-tela\ngit add .\ngit commit -m "feat: adicionar validacao de dados"\ngit push -u origin feature/nova-tela`;
    } else if (raw.includes('html') || raw.includes('tag') || raw.includes('semant') || raw.includes('seo')) {
      text = 'O HTML5 semântico organiza sua página com clareza para mecanismos de busca e acessibilidade:';
      codeSnippet = `<header>\n  <nav aria-label="Navegação Principal">\n    <a href="/">Home</a>\n  </nav>\n</header>\n<main>\n  <h1>Título Central</h1>\n</main>`;
    } else if (raw.includes('flexbox') || raw.includes('grid') || raw.includes('centralizar') || raw.includes('css')) {
      text = 'Para centralizar horizontal e verticalmente no CSS moderno com Flexbox:';
      codeSnippet = `.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n}`;
    } else if (raw.includes('javascript') || raw.includes('js') || raw.includes('closure') || raw.includes('promise') || raw.includes('async')) {
      text = 'Em JavaScript moderno, utilize async/await para lidar com código assíncrono de maneira limpa:';
      codeSnippet = `async function buscarUsuarios() {\n  try {\n    const res = await fetch('/api/users');\n    const data = await res.json();\n    return data;\n  } catch (err) {\n    console.error('Falha:', err);\n  }\n}`;
    } else if (raw.includes('typescript') || raw.includes('ts') || raw.includes('interface') || raw.includes('generic') || raw.includes('type')) {
      text = 'No TypeScript, interfaces definem contratos claros e evitam bugs em tempo de compilação:';
      codeSnippet = `interface Dev {\n  id: string;\n  nome: string;\n  senioridade: 'junior' | 'pleno' | 'senior';\n}\nconst programador: Dev = { id: '1', nome: 'Dev', senioridade: 'pleno' };`;
    } else if (raw.includes('react') || raw.includes('hook') || raw.includes('usestate') || raw.includes('useeffect')) {
      text = 'No React 19, componentes funcionais utilizam hooks para gerenciar estado e efeitos de forma declarativa:';
      codeSnippet = `import { useState } from 'react';\n\nexport function Contador() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(c => c + 1)}>Cliques: {count}</button>;\n}`;
    } else if (raw.includes('python') || raw.includes('def') || raw.includes('fastapi') || raw.includes('django') || raw.includes('flask')) {
      text = 'Em Python 3, tipagem e list comprehensions tornam o código conciso e elegante:';
      codeSnippet = `def dobrar_positivos(numeros: list[int]) -> list[int]:\n    return [n * 2 for n in numeros if n > 0]\n\nprint(dobrar_positivos([-2, 1, 3, 5]))  # [2, 6, 10]`;
    } else if (raw.includes('c++') || raw.includes('ponteiro') || raw.includes('memoria') || raw.includes('cpp')) {
      text = 'No C++20 moderno, use smart pointers para gerenciar memória automaticamente sem vazamentos:';
      codeSnippet = `#include <memory>\n#include <iostream>\n\nstruct Objeto { int valor = 42; };\nint main() {\n    auto ptr = std::make_unique<Objeto>();\n    std::cout << ptr->valor << std::endl;\n    return 0; // Memória liberada automaticamente!\n}`;
    } else if (raw.includes('sql') || raw.includes('banco') || raw.includes('database') || raw.includes('postgres') || raw.includes('supabase')) {
      text = 'Em SQL profissional, sempre use índices para campos frequentemente filtrados e relacionamentos com chaves estrangeiras:';
      codeSnippet = `CREATE INDEX idx_user_email ON public.profiles(email);\nSELECT id, username, xp FROM public.profiles WHERE xp > 100 ORDER BY xp DESC;`;
    } else if (raw.includes('docker') || raw.includes('container') || raw.includes('compose')) {
      text = 'No Docker, isole serviços em containers leves com docker-compose para um ambiente de desenvolvimento reprodutível:';
      codeSnippet = `services:\n  web:\n    build: .\n    ports:\n      - "5173:5173"`;
    } else if (raw.includes('api') || raw.includes('backend') || raw.includes('frontend') || raw.includes('fullstack') || raw.includes('full stack') || raw.includes('codigo') || raw.includes('programar') || raw.includes('linguagem') || raw.includes('algoritmo') || raw.includes('funcao') || raw.includes('função')) {
      text = `Com certeza! Na engenharia de software e desenvolvimento Full Stack, dominar fundamentos de lógica e arquitetura é essencial. O que você gostaria de ver em detalhes sobre "${prompt}"?`;
    }
    // 5. Completely off-topic fallback
    else {
      text = 'Eu sou o seu mentor de programação e estou aqui para falar sobre programação. Como posso te ajudar na sua jornada de código ou com alguma dúvida de desenvolvimento hoje?';
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
