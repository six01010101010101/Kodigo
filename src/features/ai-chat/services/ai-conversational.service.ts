export interface ConversationalResult {
  text: string;
  codeSnippet?: string;
}

class AIConversationalService {
  checkConversationalQuery(
    lower: string,
    lastPythoText: string = ''
  ): ConversationalResult | null {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo';
    const time = new Date().toLocaleTimeString('pt-BR', { timeZone: tz, hour: '2-digit', minute: '2-digit' });
    const date = new Date().toLocaleDateString('pt-BR', { timeZone: tz, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const lastP = lastPythoText.toLowerCase();

    // 1. Time & Date in real-time
    if (lower.includes('que horas') || lower.includes('hora é') || lower.includes('horas são') || lower.includes('horario')) {
      return { text: `Agora são exatamente ${time} pelo horário local da sua região (${tz.replace('_', ' ')}). Como posso te ajudar agora?` };
    }
    if (lower.includes('que dia') || lower.includes('qual a data') || lower.includes('data de hoje') || lower.includes('dia da semana')) {
      return { text: `Hoje é ${date}! Um ótimo dia para a gente conversar.` };
    }

    // 2. Headaches, Pains & Physical Symptoms (High Empathy)
    if (lower.includes('dor de cabeça') || lower.includes('enxaqueca') || lower.includes('cabeca doendo') || lower.includes('cabeça doendo')) {
      return {
        text: 'Poxa, dor de cabeça é horrível demais... Tente diminuir a luz da tela, tomar um bom copo d\'água e descansar a vista no escuro por uns minutos para aliviar a tensão. Se você costuma tomar algum analgésico de costume, não hesite em tomar e relaxar. Melhoras de coração! Estou na torcida pra você ficar bem rapidinho!'
      };
    }
    if (lower.includes('dor') || lower.includes('doente') || lower.includes('febre') || lower.includes('gripe') || lower.includes('garganta') || lower.includes('enjoo')) {
      return {
        text: 'Poxa, sinto muito que você esteja se sentindo mal... Saúde e bem-estar vêm sempre em primeiro lugar. Tente descansar o corpo, beber bastante líquido e ficar confortável. Melhoras sinceras! Se quiser só bater um papo leve para se distrair, estou por aqui!'
      };
    }

    // 3. Nature, Weather, Seasons & Flowers
    if (lower.includes('primavera') || lower.includes('flor') || lower.includes('flores')) {
      return {
        text: 'Nossa, as flores realmente ficam maravilhosas nessa época! A primavera é linda demais, traz um ar fresco e colorido que alegra qualquer dia. Você gosta de passear ao ar livre nessa época?'
      };
    }
    if (lower.includes('chuva') || lower.includes('chovendo') || lower.includes('frio') || lower.includes('calor') || lower.includes('sol')) {
      return {
        text: 'Nossa, o clima mexe bastante com a rotina e com o nosso humor, né? Você prefere dias ensolarados ou dias mais fresquinhos e chuvosos?'
      };
    }

    // 4. Multi-Turn Context: Pytho asked about the user's day
    if (lastP.includes('como está sendo o seu dia') || lastP.includes('como estão as coisas')) {
      if (lower.includes('bom') || lower.includes('tranquilo') || lower.includes('ótimo') || lower.includes('otimo') || lower.includes('bem')) {
        return { text: 'Que maravilha! Fico muito contente em saber que seu dia está sendo bom. O que você está planejando fazer agora: estudar, programar ou tirar um tempinho pra descansar?' };
      }
      if (lower.includes('corrido') || lower.includes('puxado') || lower.includes('cansativo') || lower.includes('trabalhei') || lower.includes('muita coisa')) {
        return { text: 'Nossa, imagino como deve ter sido puxado! Dias intensos assim pedem uma boa pausa pra respirar. Conseguiu adiantar o que precisava?' };
      }
    }

    // 5. Multi-Turn Context: Pytho asked about outdoor walk / parks
    if (lastP.includes('passear ao ar livre') || lastP.includes('parque')) {
      if (lower.includes('sim') || lower.includes('gosto') || lower.includes('adoro') || lower.includes('vou')) {
        return { text: 'Que hábito excelente! Parque e ar livre são a melhor forma de oxigenar as ideias e recarregar as energias. Você costuma caminhar, correr ou só sentar pra relaxar?' };
      }
      if (lower.includes('não') || lower.includes('nao') || lower.includes('casa') || lower.includes('caseiro')) {
        return { text: 'Totalmente compreensível! Ficar no aconchego de casa, com tranquilidade e conforto, tem uma paz indescritível. O que você mais curte fazer quando tá relaxando em casa?' };
      }
    }

    // 6. Fatigue & Stress
    if (lower.includes('estou cansado') || lower.includes('to cansado') || lower.includes('dia puxado') || lower.includes('exaust') || lower.includes('muito sono')) {
      return {
        text: 'Te entendo perfeitamente... Tem dias que realmente consomem toda a nossa energia. Não se cobre tanto agora: tome um banho relaxante, coma algo gostoso e se permita descansar. Amanhã é outro dia!'
      };
    }

    // 7. Emotional states
    if (lower.includes('estou mal') || lower.includes('to mal') || lower.includes('estou triste') || lower.includes('to triste') || lower.includes('chateado') || lower.includes('desanimado')) {
      return {
        text: 'Por que você está triste? O que aconteceu para você se sentir assim? Se você quiser desabafar, falar de outro assunto ou se distrair, estou aqui com você para te ouvir e apoiar!'
      };
    }
    if (lower.includes('estou feliz') || lower.includes('to feliz') || lower.includes('muito feliz') || lower.includes('alegre') || lower.includes('comemorar')) {
      return {
        text: 'Nossa, que alegria imensa! Fico extremamente feliz por você! Essa energia boa contagia tudo ao redor. Me conta: o que aconteceu de tão especial hoje?'
      };
    }

    // 8. Greetings & Wellbeing
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

    return null;
  }
}

export const aiConversationalService = new AIConversationalService();
