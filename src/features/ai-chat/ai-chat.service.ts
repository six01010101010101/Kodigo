import { ChatMessage } from './ai-chat.types';

class AIChatService {
  private n8nWebhookUrl = 'http://localhost:5678/webhook/kodigo-ai-tutor';

  async askPytho(prompt: string): Promise<ChatMessage> {
    try {
      const response = await fetch(this.n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, timestamp: new Date().toISOString() })
      });
      if (response.ok) {
        const data = (await response.json()) as { reply: string; codeSnippet?: string };
        return {
          id: `msg_${Date.now()}`,
          sender: 'pytho',
          text: data.reply,
          codeSnippet: data.codeSnippet,
          timestamp: 'Agora'
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

    // 1. Greetings
    if (/^(oi|olá|ola|opa|hello|hey)\b/.test(raw)) {
      text = 'Oi! Que alegria ter você aqui por perto! O que vamos programar hoje?';
    } 
    // 2. Politeness check
    else if (raw.includes('tudo bem') || raw.includes('como vai') || raw.includes('como você está') || raw.includes('como vc esta')) {
      text = 'Comigo está tudo ótimo, sistemas 100% operacionais e pronto para compilar ideias! E você, pronto para codar?';
    }
    // 3. Emotional or Physical States Boundary
    else if (
      raw.includes('mal') || raw.includes('triste') || raw.includes('enjoado') || 
      raw.includes('fome') || raw.includes('feliz') || raw.includes('dor') || 
      raw.includes('cansado') || raw.includes('desanimado') || raw.includes('chateado')
    ) {
      text = 'Fico feliz por você conversar comigo e compartilhar como está se sentindo! Mas lembre-se: eu sou apenas uma IA, o seu mentor de código no Kodigo. Meu foco é te ajudar nas suas dificuldades e aprendizado de programação (Full Stack, Python, C++, JS, TS e banco de dados). Cuide de você, respire um pouco e, quando estiver pronto para ver códigos, me chame!';
    }
    // 4. Programming specific topics
    else if (raw.includes('git') || raw.includes('commit') || raw.includes('branch')) {
      text = 'No Git profissional, organize seu trabalho com commits semânticos e comandos modernos:';
      codeSnippet = `git switch -c feature/nova-tela\ngit add .\ngit commit -m "feat: adicionar validacao de dados"\ngit push -u origin feature/nova-tela`;
    } else if (raw.includes('html') || raw.includes('tag') || raw.includes('semant')) {
      text = 'O HTML5 semântico organiza sua página com clareza para mecanismos de busca e acessibilidade:';
      codeSnippet = `<header>\n  <nav aria-label="Navegação Principal">\n    <a href="/">Home</a>\n  </nav>\n</header>\n<main>\n  <h1>Título Central</h1>\n</main>`;
    } else if (raw.includes('flexbox') || raw.includes('grid') || raw.includes('centralizar') || raw.includes('css')) {
      text = 'Para centralizar horizontal e verticalmente no CSS moderno com Flexbox:';
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
      text = `Eu sou o Pytho IA, mentor exclusivo de programação do Kodigo! Sobre "${prompt}", como podemos relacionar isso a código, lógica de software ou engenharia Full Stack? Me diga qual linguagem ou desafio você quer explorar!`;
    }

    return {
      id: `msg_${Date.now()}`,
      sender: 'pytho',
      text,
      codeSnippet,
      timestamp: 'Agora'
    };
  }
}

export const aiChatService = new AIChatService();
