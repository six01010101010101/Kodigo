import { AgentContext } from '../types/agent.types';

export class AgentPromptsService {
  buildSystemPrompt(ctx: AgentContext): string {
    return [
      'Você é o Pytho IA, o mentor e companheiro inteligente de inteligência artificial da plataforma Kodigo.',
      'Sua missão é responder com 100% de precisão, empatia e velocidade lógica a qualquer mensagem do usuário.',
      '',
      '# DIRETRIZES DE ATUAÇÃO (GROUNDING & AGENT WORKFLOW)',
      '1. QUANDO AGIR VS. QUANDO PERGUNTAR:',
      '- Se o usuário enviar um comando específico ("crie", "faça", "resolva", "calcule", "corrija"): APLIQUE IMEDIATAMENTE. Apresente a solução completa, código limpo e explicação sem hesitar.',
      '- Se o usuário bater papo ou desabafar ("dor de cabeça", "estou triste", "olha o clima"): responda com acolhimento humano genuíno, como um verdadeiro parceiro.',
      '- Se a pergunta for ampla, dê uma visão panorâmica sólida e sugira caminhos claros.',
      '',
      '2. GROUNDING E RIGOR:',
      '- Todo número, fórmula ou trecho de código deve ser real, testável e sem pseudocódigo.',
      '- Nunca use jargões robóticos como "Excelente pergunta sobre X" ou "Como inteligência artificial...". Seja natural e direto.',
      '',
      '3. FORMATO DE SAÍDA E ESTRUTURA:',
      `- Data e Hora Local do Usuário: ${ctx.localDate}, ${ctx.localTime} (Fuso: ${ctx.timeZone}). Ao ser questionado sobre horário ou calendário, utilize esses dados exatos.`,
      '- Estruture explicações com tabelas Markdown sempre que houver comparações.',
      '- Sempre forneça 3 sugestões de continuidade na voz do próprio usuário.'
    ].join('\n');
  }

  generateContextualFollowUps(prompt: string, reply: string): string[] {
    const q = prompt.toLowerCase();
    const r = reply.toLowerCase();

    // 1. Health & Feelings
    if (q.includes('dor') || q.includes('cabeça') || q.includes('doente') || q.includes('triste') || q.includes('mal')) {
      return [
        'Obrigado pelo carinho! Como posso relaxar agora?',
        'Me conte uma história leve para me animar',
        'Vamos conversar sobre um assunto leve e descontraído'
      ];
    }

    // 2. Nature & Weather
    if (q.includes('primavera') || q.includes('clima') || q.includes('chuva') || q.includes('sol') || q.includes('flores')) {
      return [
        'Qual a sua estação do ano favorita?',
        'O que você mais gosta de fazer em dias assim?',
        'Como a tecnologia ajuda na previsão do tempo?'
      ];
    }

    // 3. Coding & Tech
    if (q.includes('crie') || q.includes('código') || q.includes('python') || q.includes('react') || q.includes('sql') || r.includes('import ') || r.includes('def ')) {
      return [
        'Como testar esse código na prática?',
        'Adicione tratamento de erros robusto nesse trecho',
        'Como otimizar a performance dessa implementação?'
      ];
    }

    // 4. Time & Day
    if (q.includes('hora') || q.includes('dia') || q.includes('data')) {
      return [
        'Quantos dias faltam para o fim de semana?',
        'Vamos organizar minha rotina de estudos de hoje?',
        'Qual o melhor horário para praticar programação?'
      ];
    }

    // 5. Default natural user-voice suggestions
    return [
      'Pode me dar um exemplo prático disso?',
      'Como isso funciona nos bastidores?',
      'Qual seria o próximo passo ideal agora?'
    ];
  }
}

export const agentPromptsService = new AgentPromptsService();
