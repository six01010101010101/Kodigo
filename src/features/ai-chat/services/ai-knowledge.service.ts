export interface AIKnowledgeResult {
  text: string;
  codeSnippet?: string;
}

class AIKnowledgeService {
  findKnowledgeAnswer(query: string): AIKnowledgeResult | null {
    const q = query.toLowerCase();

    // 1. Quick Logic & Math
    if (q.includes('raiz quadrada') || q.includes('raiz de')) {
      if (q.includes('144')) return { text: 'A raiz quadrada de 144 é 12, pois 12 × 12 = 144.' };
      if (q.includes('16')) return { text: 'A raiz quadrada de 16 é 4, pois 4 × 4 = 16.' };
      if (q.includes('25')) return { text: 'A raiz quadrada de 25 é 5, pois 5 × 5 = 25.' };
      if (q.includes('64')) return { text: 'A raiz quadrada de 64 é 8, pois 8 × 8 = 64.' };
      if (q.includes('81')) return { text: 'A raiz quadrada de 81 é 9, pois 9 × 9 = 81.' };
      if (q.includes('100')) return { text: 'A raiz quadrada de 100 é 10, pois 10 × 10 = 100.' };
    }

    // 2. Logic: JavaScript & TypeScript Reasoning
    if (q.includes('==') && q.includes('===')) {
      return {
        text: 'A diferença é a coerção de tipo:\n• == (igualdade solta): compara valores convertendo os tipos automaticamente (ex: "5" == 5 é true).\n• === (igualdade estrita): compara valor E tipo sem conversão (ex: "5" === 5 é false). Em código profissional, use sempre ===!',
        codeSnippet: `console.log(0 == false);   // true  (converte tipos)\nconsole.log(0 === false);  // false (número !== booleano)`
      };
    }
    if (q.includes('let') && (q.includes('const') || q.includes('var'))) {
      return {
        text: 'Em JS moderno (ES6+):\n• const: declaração imutável por reatribuição (use como padrão para 90% dos casos).\n• let: variável mutável com escopo de bloco { }.\n• var: obsoleto, possui escopo de função e sofre hoisting de forma imprevisível.',
        codeSnippet: `const PI = 3.14159;\nlet contador = 0;\ncontador += 1; // permitido!`
      };
    }
    if (q.includes('recursão') || q.includes('recursao') || q.includes('recursiva')) {
      return {
        text: 'Recursão é quando uma função chama a si mesma para resolver subproblemas menores. Todo algoritmo recursivo DEVE ter:\n1. Caso base (condição de parada para evitar stack overflow).\n2. Passo recursivo (chamada com entrada reduzida).',
        codeSnippet: `function fatorial(n: number): number {\n  if (n <= 1) return 1; // Caso base\n  return n * fatorial(n - 1); // Passo recursivo\n}`
      };
    }

    // 3. Python Essentials
    if (q.includes('python')) {
      return {
        text: 'Python brilha pela clareza e sintaxe limpa. Por exemplo, list comprehensions permitem transformar dados em uma única linha legível:',
        codeSnippet: `numeros = [1, 2, 3, 4, 5]\npares_dobrados = [n * 2 for n in numeros if n % 2 == 0]\nprint(pares_dobrados)  # [4, 8]`
      };
    }

    // 4. Web, Backend & Databases
    if (q.includes('sql') || q.includes('banco') || q.includes('postgres')) {
      return {
        text: 'No SQL relacional, o segredo da performance é indexação e relacionamentos normalizados. Sempre selecione apenas as colunas necessárias:',
        codeSnippet: `SELECT id, username, streak\nFROM public.profiles\nWHERE streak >= 7\nORDER BY streak DESC\nLIMIT 5;`
      };
    }
    if (q.includes('docker') || q.includes('container')) {
      return {
        text: 'O Docker empacota sua aplicação e todas as dependências em um container isolado e leve, garantindo comportamento idêntico no seu notebook e no servidor em produção.'
      };
    }

    // 5. Science & Physics Curiosities
    if (q.includes('céu é azul') || q.includes('ceu e azul')) {
      return {
        text: 'O céu é azul por causa do fenômeno óptico chamado Espalhamento de Rayleigh: a luz do Sol é branca (composta por todas as cores), mas os gases da atmosfera terrestre espalham os comprimentos de onda mais curtos (azul e violeta) muito mais intensamente do que os tons vermelhos e amarelos!'
      };
    }
    if (q.includes('velocidade da luz')) {
      return {
        text: 'A velocidade da luz no vácuo (c) é uma constante fundamental da física: exatamente 299.792.458 metros por segundo (aproximadamente 300.000 km/s). Pela Relatividade de Einstein, nada com massa pode atingir ou ultrapassar essa velocidade!'
      };
    }
    if (q.includes('avião voa') || q.includes('aviao voa') || q.includes('voam')) {
      return {
        text: 'Aviões voam pela combinação do formato das asas (aerofólio) com o Princípio de Bernoulli e a 3ª Lei de Newton: o ar passa mais rápido por cima da asa, gerando menor pressão acima e maior pressão abaixo. Essa diferença de pressão cria a Força de Sustentação que empurra a aeronave para cima!'
      };
    }
    if (q.includes('buraco negro')) {
      return {
        text: 'Buracos negros são corpos celestes cuja gravidade é tão descomunal que a velocidade de escape supera a própria velocidade da luz! O ponto onde nada mais consegue escapar é o Horizonte de Eventos.'
      };
    }

    // 6. Conversational Human Default
    if (query.includes('?')) {
      return {
        text: `Essa é uma ótima pergunta! Analisando isso com lógica e clareza: esse assunto tem pontos muito interessantes. Me conta: o que despertou essa curiosidade em você hoje? Adoraria entender o seu ponto de vista!`
      };
    }

    return {
      text: `Nossa, concordo totalmente com você! É muito bom poder conversar e reparar nessas coisas com calma. O que mais tem passado pela sua cabeça ultimamente?`
    };
  }
}

export const aiKnowledgeService = new AIKnowledgeService();
