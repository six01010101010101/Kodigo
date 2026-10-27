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

    // Empathy and Conversational Responses
    if (/^(oi|olá|ola|e aí|e ai|opa|hello|hey)\b/.test(raw)) {
      text = 'Olá! Que alegria ver você por aqui! Como está seu dia e seus estudos hoje? Em que posso te ajudar?';
    } else if (raw.includes('triste') || raw.includes('chateado') || raw.includes('mal')) {
      text = 'Poxa, sinto muito ouvir isso... O que houve? Saiba que todo mundo passa por dias difíceis. Se quiser desabafar ou fazer uma pausa nos códigos para conversar, estou aqui com você!';
    } else if (raw.includes('cansado') || raw.includes('exausto') || raw.includes('pesado')) {
      text = 'Programar exige muita energia mental. Que tal pegar uma água, respirar 5 minutos e esticar as costas? Pequenas pausas aumentam a clareza e evitam bugs!';
    } else if (raw.includes('obrigado') || raw.includes('valeu') || raw.includes('agradeço')) {
      text = 'Por nada! Conte sempre comigo. Ver você evoluir na programação é minha maior satisfação!';
    } else if (raw.includes('git') || raw.includes('commit') || raw.includes('branch')) {
      text = 'No Git profissional, use commits semânticos (feat, fix, refactor) e branches curtas para um histórico limpo:';
      codeSnippet = `git switch -c feature/nova-tela\ngit add .\ngit commit -m "feat: implementar autenticacao 2fa"\ngit push -u origin feature/nova-tela`;
    } else if (raw.includes('html') || raw.includes('semant')) {
      text = 'O HTML5 semântico é a chave para acessibilidade e SEO topo de linha:';
      codeSnippet = `<header>\n  <nav aria-label="Menu Principal">\n    <a href="/">Home</a>\n  </nav>\n</header>\n<main>\n  <article>Conteúdo principal</article>\n</main>`;
    } else if (raw.includes('flexbox') || raw.includes('centralizar') || raw.includes('css')) {
      text = 'Para centralizar perfeitamente no CSS moderno com Flexbox:';
      codeSnippet = `.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n}`;
    } else if (raw.includes('closure') || raw.includes('event loop') || raw.includes('javascript') || raw.includes('js')) {
      text = 'Em JavaScript moderno, closures preservam o escopo léxico mesmo após a execução da função externa:';
      codeSnippet = `function criarContador() {\n  let count = 0;\n  return () => ++count;\n}\nconst contador = criarContador();\nconsole.log(contador()); // 1\nconsole.log(contador()); // 2`;
    } else if (raw.includes('typescript') || raw.includes('ts') || raw.includes('generic')) {
      text = 'Generics no TypeScript permitem criar componentes e funções reutilizáveis e com segurança de tipos total:';
      codeSnippet = `interface ApiResponse<T> {\n  data: T;\n  status: number;\n}\nfunction buscarDados<T>(endpoint: string): ApiResponse<T> {\n  // Implementação tipada\n}`;
    } else if (raw.includes('python') || raw.includes('fastapi')) {
      text = 'Python 3.12 é poderoso para APIs assíncronas e automações limpas:';
      codeSnippet = `from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/status")\nasync def health():\n    return {"status": "online", "mentor": "Pytho"}`;
    } else if (raw.includes('c++') || raw.includes('ponteiro') || raw.includes('memoria')) {
      text = 'No C++20 moderno, prefira Smart Pointers (std::unique_ptr) ao invés de gerenciamento manual com new/delete para evitar memory leaks:';
      codeSnippet = `#include <memory>\n#include <iostream>\n\nstruct Node { int id; };\nint main() {\n    auto node = std::make_unique<Node>(42);\n    std::cout << node->id << std::endl;\n    return 0; // Desalocado automaticamente!\n}`;
    } else {
      text = `Excelente ponto! Sobre "${prompt}", como engenheiro de software, recomendo quebrar o problema em pequenas etapas testáveis. Qual é a sua dúvida específica no código?`;
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
