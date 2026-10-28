export interface ConversationalResult {
  text: string;
  codeSnippet?: string;
}

class AIConversationalService {
  checkConversationalQuery(lower: string, prevPythoAsked: boolean): ConversationalResult | null {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo';
    const currentTime = new Date().toLocaleTimeString('pt-BR', { timeZone, hour: '2-digit', minute: '2-digit' });
    const currentDate = new Date().toLocaleDateString('pt-BR', { timeZone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Time query
    if (lower.includes('que horas') || lower.includes('hora é') || lower.includes('horas são') || lower.includes('horario atual')) {
      return {
        text: `Agora são exatamente ${currentTime} pelo horário local da sua região (${timeZone.replace('_', ' ')}). Como posso te ajudar agora?`
      };
    }

    // Date query
    if (lower.includes('que dia é hoje') || lower.includes('qual a data') || lower.includes('data de hoje') || lower.includes('dia da semana')) {
      return {
        text: `Hoje é ${currentDate}! Um ótimo momento para conversar e aprender coisas novas.`
      };
    }

    // User confirms they are well
    if (prevPythoAsked && (lower.includes('estou bem') || lower.includes('to bem') || lower === 'bem' || lower.includes('tudo certo') || lower.includes('tudo ótimo'))) {
      return {
        text: 'Que bom, estou muito feliz! O que vamos fazer hoje? Ou o que vamos estudar hoje? Me pergunte qualquer coisa, estou pronto para falar sobre qualquer assunto!'
      };
    }

    // User shares happiness
    if (lower.includes('estou feliz') || lower.includes('to feliz') || lower.includes('muito feliz') || lower.includes('radiante') || lower.includes('alegre')) {
      return {
        text: 'Nossa, que legal! Fico extremamente feliz por você! Essa energia boa é contagiante. Me conta mais: o que aconteceu de bom hoje?'
      };
    }

    // User is sick / unwell
    if (lower.includes('doente') || lower.includes('febre') || lower.includes('gripe') || lower.includes('dor de cabeça') || lower.includes('enjoado')) {
      return {
        text: 'Poxa, que pena que você está assim... Tente descansar, tomar bastante água e se cuidar com carinho. Saúde vem sempre em primeiro lugar! Quando você se sentir melhor, estarei sempre por aqui para papear!'
      };
    }

    // User is sad / feeling down
    if (lower.includes('estou mal') || lower.includes('to mal') || lower.includes('estou triste') || lower.includes('to triste') || lower.includes('desanimado') || lower.includes('chateado')) {
      return {
        text: 'Por que você está triste? O que aconteceu? Tente fazer algo que te traga calma e conforto. Se quiser desabafar, falar de outro assunto ou se distrair, estou aqui com você agora mesmo!'
      };
    }

    // User asks if Pytho is well
    if (lower.includes('você está bem') || lower.includes('voce esta bem') || lower.includes('tudo bem') || lower.includes('como vai') || lower.includes('como você tá')) {
      return {
        text: 'Oi! Comigo está tudo ótimo, está tudo bem! Meus circuitos estão brilhando e estou super animado para bater um papo com você sobre qualquer assunto do mundo. E você, como está?'
      };
    }

    // Greetings
    if (/^(oi|olá|ola|opa|hey|hello|eai|fala)\b/.test(lower) && lower.length < 25) {
      return {
        text: 'Sssss! Olá! Que alegria conversar com você! Como você está se sentindo hoje?'
      };
    }

    // Who is Pytho
    if (lower.includes('quem é você') || lower.includes('quem e voce') || lower.includes('seu nome') || lower.includes('você é uma cobra')) {
      return {
        text: 'Eu sou o Pytho IA, a serpente cibernética inteligente e o companheiro de inteligência artificial da plataforma Kodigo! Tenho conhecimento enciclopédico sobre o mundo, ciências, história, cotidiano e código. Pode me perguntar qualquer coisa!'
      };
    }

    return null;
  }
}

export const aiConversationalService = new AIConversationalService();
