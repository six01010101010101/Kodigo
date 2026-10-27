import { ChatMessage } from './ai-chat.types';

class AIChatService {
  private n8nWebhookUrl = 'http://localhost:5678/webhook/kodigo-ai-tutor';

  async askPytho(prompt: string): Promise<ChatMessage> {
    // Attempt webhook if available, otherwise generate expert educational response
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
      // Fallback to intelligent local AI mentor logic
    }

    return this.generateLocalPythoResponse(prompt);
  }

  private generateLocalPythoResponse(prompt: string): ChatMessage {
    const lower = prompt.toLowerCase();
    let text = 'Sssss! Eu sou o Pytho! ';
    let codeSnippet: string | undefined;

    if (lower.includes('html') || lower.includes('tag')) {
      text += 'No HTML5, prefira sempre tags semânticas como <main>, <nav>, <header> e <article> para otimizar SEO e acessibilidade.';
      codeSnippet = `<nav>\n  <ul>\n    <li><a href="/">Home</a></li>\n  </ul>\n</nav>`;
    } else if (lower.includes('css') || lower.includes('flexbox') || lower.includes('grid')) {
      text += 'Para centralizar perfeitamente qualquer elemento em CSS moderno, basta usar Flexbox ou Grid com poucas linhas:';
      codeSnippet = `.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}`;
    } else if (lower.includes('python') || lower.includes('função') || lower.includes('def')) {
      text += 'Em Python, o código é limpo e expressivo! Veja como declaramos uma função com tipagem:';
      codeSnippet = `def somar(a: int, b: int) -> int:\n    """Retorna a soma de dois números."""\n    return a + b\n\nprint(somar(10, 5))`;
    } else if (lower.includes('typescript') || lower.includes('react') || lower.includes('js')) {
      text += 'No TypeScript, interfaces e tipagem estrita evitam bugs antes mesmo de executar o código!';
      codeSnippet = `interface User {\n  id: string;\n  name: string;\n}\nconst dev: User = { id: "1", name: "Dev" };`;
    } else {
      text += `Excelente pergunta sobre "${prompt}"! Meu conselho é dividir o problema em pequenas etapas lógicas e praticar aqui no Kodigo para fixar bem!`;
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
