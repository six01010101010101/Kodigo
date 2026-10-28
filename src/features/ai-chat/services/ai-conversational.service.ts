export interface ConversationalResult {
  text: string;
  codeSnippet?: string;
}

class AIConversationalService {
  checkConversationalQuery(lower: string, prevAsked: boolean): ConversationalResult | null {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo';
    const time = new Date().toLocaleTimeString('pt-BR', { timeZone: tz, hour: '2-digit', minute: '2-digit' });
    const date = new Date().toLocaleDateString('pt-BR', { timeZone: tz, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // 1. Time & Date
    if (lower.includes('que horas') || lower.includes('hora é') || lower.includes('horas são') || lower.includes('horario')) {
      return { text: `Agora são exatamente ${time} pelo horário da sua região (${tz.replace('_', ' ')}). Como posso te ajudar agora?` };
    }
    if (lower.includes('que dia') || lower.includes('qual a data') || lower.includes('data de hoje')) {
      return { text: `Hoje é ${date}! Um ótimo dia para bater um papo e aprender.` };
    }

    // 2. Headaches, Pains & Health Symptoms
    if (lower.includes('dor de cabeça') || lower.includes('enxaqueca') || lower.includes('cabeca doendo') || lower.includes('cabeça doendo')) {
      return {
        text: 'Poxa, dor de cabeça é horrível demais... Tente diminuir um pouco o brilho da tela, beber um bom copo d\'água e fechar os olhos no escuro por uns minutos para relaxar a vista. Se você costuma tomar algum analgésico de costume, pode ajudar. Melhoras, viu? Fica bem, estou aqui torcendo por você!'
      };
    }
    if (lower.includes('dor') || lower.includes('doente') || lower.includes('febre') || lower.includes('gripe') || lower.includes('garganta') || lower.includes('enjoo')) {
      return {
        text: 'Poxa, sinto muito que você esteja se sentindo assim... Saúde e bem-estar vêm sempre em primeiro lugar. Tente descansar o corpo, beber bastante líquido e ficar confortável. Melhoras de coração! Se quiser só bater um papo leve para se distrair, estou por aqui!'
      };
    }

    // 3. Nature, Weather, Seasons & Flowers
    if (lower.includes('primavera') || lower.includes('flor') || lower.includes('flores')) {
      return {
        text: 'Nossa, as flores realmente ficam maravilhosas nessa época! A primavera traz uma energia tão leve e colorida, parece que tudo ganha mais vida. Você tem algum lugar favorito com árvores ou plantas por perto pra admirar?'
      };
    }
    if (lower.includes('chuva') || lower.includes('chovendo') || lower.includes('frio') || lower.includes('calor') || lower.includes('verão') || lower.includes('inverno') || lower.includes('outono')) {
      return {
        text: 'Clima mexe muito com o nosso dia a dia, né? Um tempinho assim dá uma sensação diferente na rotina. Você prefere dias mais quentes de sol ou dias frescos e aconchegantes?'
      };
    }

    // 4. Fatigue, Exhaustion & Stress
    if (lower.includes('estou cansado') || lower.includes('to cansado') || lower.includes('dia puxado') || lower.includes('exaust') || lower.includes('muito sono') || lower.includes('preguiça')) {
      return {
        text: 'Te entendo perfeitamente... Tem dias que consomem toda a nossa energia. Não se cobre tanto agora: tome um banho relaxante, coma algo gostoso e se permita descansar. Amanhã é um novo dia com energias renovadas!'
      };
    }

    // 5. Feelings: Sadness vs Happiness
    if (lower.includes('estou mal') || lower.includes('to mal') || lower.includes('estou triste') || lower.includes('to triste') || lower.includes('chateado') || lower.includes('desanimado')) {
      return {
        text: 'Poxa, por que você está assim? O que aconteceu para você se sentir assim? Se quiser desabafar, falar de qualquer coisa ou só uma distração, estou aqui com você para te ouvir e apoiar!'
      };
    }
    if (lower.includes('estou feliz') || lower.includes('to feliz') || lower.includes('muito feliz') || lower.includes('alegre') || lower.includes('comemorar')) {
      return {
        text: 'Nossa, que alegria imensa! Fico extremamente feliz por você! Essa energia boa contagia tudo ao redor. Me conta: o que aconteceu de tão especial hoje?'
      };
    }

    // 6. User confirms they are well
    if (prevAsked && (lower.includes('estou bem') || lower.includes('to bem') || lower === 'bem' || lower.includes('tudo certo') || lower.includes('tudo ótimo'))) {
      return {
        text: 'Que bom, fico muito feliz! O que você está aprontando hoje de bom? Vamos estudar, construir algo novo ou só bater um papo descontraído?'
      };
    }

    // 7. Pytho's Wellbeing & Greetings
    if (lower.includes('você está bem') || lower.includes('voce esta bem') || lower.includes('como você tá') || lower.includes('como vai') || lower.includes('tudo bem')) {
      return {
        text: 'Oi! Comigo está tudo ótimo, tudo em paz! Muito obrigado por perguntar. E você, como está sendo o seu dia?'
      };
    }
    if (/^(oi|olá|ola|opa|hey|hello|eai|fala)\b/.test(lower) && lower.length < 25) {
      return {
        text: 'Sssss! Olá! Que alegria te ver por aqui! Como estão as coisas com você hoje?'
      };
    }

    // 8. Daily Life & Hobbies
    if (lower.includes('café') || lower.includes('cafe') || lower.includes('almoço') || lower.includes('almoco') || lower.includes('jantar') || lower.includes('pizza') || lower.includes('comi')) {
      return {
        text: 'Nossa, uma comidinha gostosa ou um café quentinho salva qualquer dia! Essas pequenas pausas fazem toda a diferença na nossa produtividade e no humor.'
      };
    }
    if (lower.includes('música') || lower.includes('musica') || lower.includes('filme') || lower.includes('série') || lower.includes('serie') || lower.includes('jogo')) {
      return {
        text: 'Arte e entretenimento são maravilhosos para inspirar a mente! O que você tem escutado, assistido ou jogado ultimamente que mais te marcou?'
      };
    }

    return null;
  }
}

export const aiConversationalService = new AIConversationalService();
