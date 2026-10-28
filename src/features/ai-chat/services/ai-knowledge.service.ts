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

    // 2. Direct Coding Commands ("crie", "faça", "escreva", "gere", "desenvolva")
    if (q.startsWith('crie') || q.startsWith('faça') || q.startsWith('escreva') || q.startsWith('gere') || q.startsWith('desenvolva') || q.includes('codigo de') || q.includes('código de')) {
      if (q.includes('botão') || q.includes('botao') || q.includes('button')) {
        return {
          text: 'Aqui está um componente de Botão 3D moderno em React com TypeScript e Tailwind CSS:',
          codeSnippet: `import React from 'react';\n\ninterface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {\n  variant?: 'primary' | 'secondary' | 'danger';\n}\n\nexport const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {\n  const colors = {\n    primary: 'bg-emerald-500 hover:bg-emerald-600 border-b-4 border-emerald-700 text-white',\n    secondary: 'bg-blue-500 hover:bg-blue-600 border-b-4 border-blue-700 text-white',\n    danger: 'bg-red-500 hover:bg-red-600 border-b-4 border-red-700 text-white'\n  };\n  return (\n    <button {...props} className={\`px-6 py-2.5 rounded-2xl font-black text-sm active:translate-y-1 transition-all \${colors[variant]}\`}>\n      {children}\n    </button>\n  );\n};`
        };
      }
      if (q.includes('python') || q.includes('ordenar') || q.includes('função') || q.includes('funcao')) {
        return {
          text: 'Comando aplicado! Aqui está a solução com tipagem estrita e documentação clara em Python:',
          codeSnippet: `def filtrar_e_ordenar(itens: list[dict], chave: str) -> list[dict]:\n    """Filtra itens válidos e ordena pela chave fornecida."""\n    validos = [item for item in itens if chave in item and item[chave] is not None]\n    return sorted(validos, key=lambda x: x[chave])\n\n# Exemplo de uso:\ndados = [{"nome": "Ana", "pontos": 80}, {"nome": "Beto", "pontos": 95}]\nprint(filtrar_e_ordenar(dados, "pontos"))`
        };
      }
      if (q.includes('sql') || q.includes('tabela') || q.includes('query')) {
        return {
          text: 'Comando aplicado! Aqui está a estrutura SQL com chaves, índices e boas práticas:',
          codeSnippet: `CREATE TABLE public.projetos (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,\n  titulo TEXT NOT NULL,\n  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'concluido', 'pausado')),\n  created_at TIMESTAMPTZ DEFAULT now()\n);\n\nCREATE INDEX idx_projetos_user_id ON public.projetos(user_id);`
        };
      }
    }

    // 3. Problem Solving & Error Diagnostics
    if (q.includes('erro') || q.includes('bug') || q.includes('não funciona') || q.includes('nao funciona') || q.includes('como resolver')) {
      return {
        text: 'Para resolver isso de forma definitiva, o primeiro passo é isolar a causa raiz:\n1. Verifique os logs e o stack trace no console.\n2. Inspecione se os tipos esperados coincidem com o valor recebido (evite tipos indefinidos ou nulos).\n3. Teste a função isoladamente com valores controlados.\nMe mostre a mensagem de erro exata ou o trecho de código que posso te dar a correção linha por linha!'
      };
    }

    // 4. Fundamental Computer Science & Logic
    if (q.includes('==') && q.includes('===')) {
      return {
        text: 'A diferença é a coerção de tipos:\n• == (igualdade solta): converte os tipos antes de comparar (ex: 0 == "" é true).\n• === (igualdade estrita): compara valor E tipo sem conversão (ex: 0 === "" é false). Em produção, use sempre ===!',
        codeSnippet: `console.log(false == 0);   // true  (coerção implícita)\nconsole.log(false === 0);  // false (booleano !== número)`
      };
    }
    if (q.includes('recursão') || q.includes('recursao')) {
      return {
        text: 'Recursão ocorre quando uma função resolve um problema chamando a si mesma com uma entrada menor, até atingir a condição de parada (caso base):',
        codeSnippet: `function contagemRegressiva(n: number): void {\n  if (n <= 0) {\n    console.log("Fogo!");\n    return; // Caso base\n  }\n  console.log(n);\n  contagemRegressiva(n - 1); // Chamada recursiva\n}`
      };
    }

    // 5. Science & Curiosities
    if (q.includes('céu é azul') || q.includes('ceu e azul')) {
      return {
        text: 'O céu é azul devido ao Espalhamento de Rayleigh: a luz branca do Sol atravessa a atmosfera e os gases espalham com muito mais intensidade as ondas de luz de menor comprimento (azul e violeta) em todas as direções!'
      };
    }
    if (q.includes('velocidade da luz')) {
      return {
        text: 'A velocidade da luz no vácuo é de exatamente 299.792.458 m/s (cerca de 300 mil km/s). Pela relatividade geral de Einstein, ela é a velocidade limite do universo.'
      };
    }

    // 6. Natural Conversational Synthesis (Talks directly about what user said)
    if (q.includes('?')) {
      return {
        text: `Pensando sobre "${query.trim()}": a chave para entender isso é analisar o objetivo principal e como cada parte se conecta. O que você acha que seria a melhor abordagem nesse caso? Adoraria ouvir a sua ideia!`
      };
    }

    return {
      text: `Entendi perfeitamente o seu ponto! É muito interessante observar como "${query.trim()}" se aplica no dia a dia. Quer que a gente explore mais a fundo ou gostaria de aplicar isso em um exemplo prático?`
    };
  }
}

export const aiKnowledgeService = new AIKnowledgeService();
