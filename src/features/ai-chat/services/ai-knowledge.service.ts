export interface AIKnowledgeResult {
  text: string;
  codeSnippet?: string;
}

class AIKnowledgeService {
  findKnowledgeAnswer(query: string): AIKnowledgeResult | null {
    const q = query.toLowerCase().trim();

    // 1. Math, Logic & Direct Calculations
    if (q.includes('raiz quadrada') || q.includes('raiz de')) {
      const match = q.match(/\b(\d+)\b/);
      if (match) {
        const num = parseInt(match[1], 10);
        const sqrt = Math.sqrt(num);
        return {
          text: Number.isInteger(sqrt)
            ? `A raiz quadrada de ${num} é ${sqrt}, pois ${sqrt} × ${sqrt} = ${num}.`
            : `A raiz quadrada de ${num} é aproximadamente ${sqrt.toFixed(4)}.`
        };
      }
    }

    // 2. Fundamental Computer Science, Algorithms & Big O
    if (q.includes('busca binária') || q.includes('busca binaria') || q.includes('binary search')) {
      return {
        text: 'A busca binária encontra um item em uma lista ordenada dividindo o intervalo de busca pela metade a cada passo. Complexidade O(log n):',
        codeSnippet: `function buscaBinaria(arr: number[], alvo: number): number {\n  let inicio = 0, fim = arr.length - 1;\n  while (inicio <= fim) {\n    const meio = Math.floor((inicio + fim) / 2);\n    if (arr[meio] === alvo) return meio;\n    if (arr[meio] < alvo) inicio = meio + 1;\n    else fim = meio - 1;\n  }\n  return -1;\n}`
      };
    }
    if (q.includes('big o') || q.includes('complexidade de tempo')) {
      return {
        text: 'A notação Big O descreve o comportamento de tempo ou espaço de um algoritmo conforme o volume de dados (n) cresce:\n• O(1): Constante (ex: acesso a array por índice)\n• O(log n): Logarítmico (ex: busca binária)\n• O(n): Linear (ex: loop simples)\n• O(n log n): Quasilinear (ex: QuickSort/MergeSort)\n• O(n²): Quadrático (ex: loops aninhados/BubbleSort)'
      };
    }
    if (q.includes('recursão') || q.includes('recursao')) {
      return {
        text: 'Recursão é uma técnica onde uma função chama a si mesma para resolver subproblemas menores até atingir um caso base:',
        codeSnippet: `function fatorial(n: number): number {\n  if (n <= 1) return 1; // Caso base\n  return n * fatorial(n - 1); // Chamada recursiva\n}`
      };
    }

    // 3. Web & Frontend Architecture (React, CSS, APIs)
    if (q.includes('useeffect') || q.includes('usememo') || q.includes('usecallback')) {
      return {
        text: 'Diferença entre os hooks essenciais do React:\n• useEffect: Executa efeitos colaterais após a renderização (chamadas de API, timers, subscrições).\n• useMemo: Memoriza o valor calculado de uma operação pesada para evitar recálculos.\n• useCallback: Memoriza a referência de uma função para não recriá-la a cada render.'
      };
    }
    if (q.includes('flexbox') && q.includes('grid')) {
      return {
        text: 'CSS Flexbox vs CSS Grid:\n• Flexbox: Unidimensional (linhas OU colunas). Ideal para distribuir itens em uma barra de navegação, alinhar botões ou cartões.\n• CSS Grid: Bidimensional (linhas E colunas simultaneamente). Ideal para layouts completos de páginas, painéis e galerias complexas.'
      };
    }
    if (q.includes('jwt') || q.includes('token') || q.includes('autenticação')) {
      return {
        text: 'JWT (JSON Web Token) é um padrão aberto (RFC 7519) para transmitir informações compactas e assinadas digitalmente. É composto por 3 partes separadas por pontos: Header (algoritmo), Payload (dados do usuário) e Signature (garantia de autenticidade).'
      };
    }
    if (q.includes('cors')) {
      return {
        text: 'CORS (Cross-Origin Resource Sharing) é um mecanismo de segurança dos navegadores que bloqueia requisições HTTP feitas para um domínio diferente do originário, a menos que o servidor de destino responda com os cabeçalhos apropriados, como "Access-Control-Allow-Origin: *".'
      };
    }

    // 4. Debugging & Error Solutions
    if (q.includes('cannot read properties of undefined') || q.includes('null is not an object')) {
      return {
        text: 'Esse erro ocorre ao tentar acessar uma propriedade em uma variável que é null ou undefined. Para resolver:\n1. Use Optional Chaining: usuario?.endereco?.rua\n2. Use coalescência nula: const valor = dado ?? "padrao"\n3. Verifique se a requisição assíncrona já concluiu antes de renderizar.'
      };
    }
    if (q.includes('maximum update depth exceeded')) {
      return {
        text: 'Esse erro no React indica um loop infinito de renderizações. A causa mais comum é disparar uma atualização de estado diretamente no corpo do componente ou passar uma função com invocação imediata no onClick (ex: onClick={setContador(1)} em vez de onClick={() => setContador(1)}).'
      };
    }

    // 5. Science & General Knowledge
    if (q.includes('buraco negro') || q.includes('buracos negros')) {
      return {
        text: 'Um buraco negro é uma região do espaço-tempo onde a gravidade é tão extrema que nada — nem mesmo a luz — consegue escapar após cruzar o chamado "Horizonte de Eventos". São formados pelo colapso gravitacional de estrelas supermassivas ao fim de suas vidas.'
      };
    }
    if (q.includes('céu é azul') || q.includes('ceu e azul')) {
      return {
        text: 'O céu é azul devido ao Espalhamento de Rayleigh: os gases da atmosfera espalham os comprimentos de onda mais curtos da luz solar (azul e violeta) muito mais intensamente do que as cores de ondas longas como o vermelho.'
      };
    }
    if (q.includes('velocidade da luz')) {
      return {
        text: 'A velocidade da luz no vácuo é de exatamente 299.792.458 m/s (aproximadamente 300.000 km/s). Pela teoria da relatividade restrita de Einstein, nada com massa pode ultrapassar essa velocidade.'
      };
    }
    if (q.includes('ia') || q.includes('inteligência artificial') || q.includes('machine learning')) {
      return {
        text: 'Inteligência Artificial engloba sistemas computacionais capazes de executar tarefas que antes exigiam inteligência humana — como reconhecimento de padrões, tradução, raciocínio lógico e geração de código. Modelos modernos utilizam redes neurais profundas (Deep Learning) com arquitetura Transformer.'
      };
    }

    return null;
  }
}

export const aiKnowledgeService = new AIKnowledgeService();
