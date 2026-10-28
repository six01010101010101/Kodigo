import { AgentContext, AgentTool, AgentToolResult } from '../types/agent.types';

class AgentToolsService {
  private tools: AgentTool[] = [
    {
      name: 'math_logic_solver',
      description: 'Calcula raízes, expressões aritméticas e problemas matemáticos com precisão estrita.',
      canHandle: (p: string) => {
        const q = p.toLowerCase();
        return q.includes('raiz') || q.includes('calcular') || /\d+\s*[\+\-\*\/]\s*\d+/.test(q);
      },
      execute: (p: string): AgentToolResult => {
        const q = p.toLowerCase();
        if (q.includes('raiz')) {
          const match = q.match(/\b(\d+)\b/);
          if (match) {
            const num = parseInt(match[1], 10);
            const sqrt = Math.sqrt(num);
            const isInt = Number.isInteger(sqrt);
            return {
              success: true,
              toolName: 'math_logic_solver',
              text: `A raiz quadrada de ${num} é ${isInt ? sqrt : sqrt.toFixed(4)}. Razão: ${isInt ? `${sqrt} × ${sqrt} = ${num}` : `aproximação exata`}.`,
              followUpPrompts: [
                'Como calcular raízes não exatas de cabeça?',
                'Qual é a raiz cúbica desse número?',
                'Mostre a fórmula matemática de aproximação de Newton'
              ]
            };
          }
        }
        const exprMatch = q.match(/(\d+(?:\.\d+)?)\s*([\+\-\*\/])\s*(\d+(?:\.\d+)?)/);
        if (exprMatch) {
          const a = parseFloat(exprMatch[1]);
          const op = exprMatch[2];
          const b = parseFloat(exprMatch[3]);
          let res = 0;
          if (op === '+') res = a + b;
          else if (op === '-') res = a - b;
          else if (op === '*') res = a * b;
          else if (op === '/') res = b !== 0 ? a / b : NaN;

          return {
            success: true,
            toolName: 'math_logic_solver',
            text: `O resultado de ${a} ${op} ${b} é **${res}**.`,
            followUpPrompts: [
              'Como aplicar essa conta em uma função JavaScript?',
              'Faça outro cálculo para mim',
              'Explique a ordem de precedência dos operadores'
            ]
          };
        }
        return {
          success: false,
          toolName: 'math_logic_solver',
          text: 'Não consegui isolar a expressão numérica exata.',
          followUpPrompts: ['Calcule 25 * 4', 'Qual a raiz de 144?']
        };
      }
    },
    {
      name: 'code_scaffold_generator',
      description: 'Gera código de produção em React, TypeScript, Python, SQL ou Docker.',
      canHandle: (p: string) => {
        const q = p.toLowerCase();
        return q.startsWith('crie') || q.startsWith('faça') || q.startsWith('escreva') || q.startsWith('gere') || q.startsWith('desenvolva') || q.includes('código de');
      },
      execute: (p: string): AgentToolResult => {
        const q = p.toLowerCase();
        if (q.includes('botão') || q.includes('botao') || q.includes('button')) {
          return {
            success: true,
            toolName: 'code_scaffold_generator',
            text: 'Comando executado com sucesso! Aqui está o componente modular de botão em React + Tailwind CSS:',
            codeSnippet: `import React from 'react';\n\ninterface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {\n  variant?: 'primary' | 'secondary' | 'danger';\n}\n\nexport const ActionButton: React.FC<ButtonProps> = ({\n  children,\n  variant = 'primary',\n  className = '',\n  ...props\n}) => {\n  const styles = {\n    primary: 'bg-emerald-500 hover:bg-emerald-600 border-b-4 border-emerald-700',\n    secondary: 'bg-blue-500 hover:bg-blue-600 border-b-4 border-blue-700',\n    danger: 'bg-red-500 hover:bg-red-600 border-b-4 border-red-700'\n  };\n  return (\n    <button\n      {...props}\n      className={\`px-6 py-2.5 rounded-2xl font-bold text-white shadow-lg active:translate-y-0.5 transition-all \${styles[variant]} \${className}\`}\n    >\n      {children}\n    </button>\n  );\n};`,
            followUpPrompts: [
              'Como adicionar um estado de loading com spinner nesse botão?',
              'Adicione um teste unitário com Vitest para esse componente',
              'Como usar esse botão com ícones do Lucide?'
            ]
          };
        }
        if (q.includes('python') || q.includes('ordenar') || q.includes('lista') || q.includes('função')) {
          return {
            success: true,
            toolName: 'code_scaffold_generator',
            text: 'Comando executado! Aqui está o algoritmo otimizado com anotações de tipo PEP 484:',
            codeSnippet: `def ordenar_registros(itens: list[dict], campo: str, reverso: bool = False) -> list[dict]:\n    """Ordena uma lista de dicionários de forma segura pelo campo indicado."""\n    return sorted(\n        [item for item in itens if campo in item and item[campo] is not None],\n        key=lambda x: x[campo],\n        reverse=reverso\n    )\n\n# Exemplo de teste:\ndados = [{"id": 1, "score": 88}, {"id": 2, "score": 95}, {"id": 3, "score": 72}]\nprint(ordenar_registros(dados, "score", reverso=True))`,
            followUpPrompts: [
              'Qual a complexidade de tempo Big O dessa ordenação?',
              'Como tratar valores nulos sem descartá-los?',
              'Transforme isso em uma classe com tipagem genérica'
            ]
          };
        }
        if (q.includes('sql') || q.includes('tabela') || q.includes('postgres')) {
          return {
            success: true,
            toolName: 'code_scaffold_generator',
            text: 'Comando executado! Aqui está o schema SQL com UUID, integridade referencial e índices de performance:',
            codeSnippet: `CREATE TABLE IF NOT EXISTS public.projetos (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,\n  nome TEXT NOT NULL CHECK (char_length(nome) >= 3),\n  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'concluido', 'pausado')),\n  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),\n  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()\n);\n\nCREATE INDEX idx_projetos_user_id ON public.projetos(user_id);\nCREATE INDEX idx_projetos_status ON public.projetos(status);`,
            followUpPrompts: [
              'Crie uma política de RLS (Row Level Security) para essa tabela',
              'Como criar um trigger para atualizar automaticamente o updated_at?',
              'Gere a query de inserção e consulta para essa tabela'
            ]
          };
        }
        return {
          success: false,
          toolName: 'code_scaffold_generator',
          text: 'Por favor, especifique o tipo de código que deseja (ex: React, Python, SQL, Docker).',
          followUpPrompts: ['Crie um botão em React', 'Crie uma função de ordenação em Python', 'Crie uma tabela em SQL']
        };
      }
    },
    {
      name: 'data_comparison_tool',
      description: 'Estrutura comparações técnicas em tabelas Markdown organizadas.',
      canHandle: (p: string) => {
        const q = p.toLowerCase();
        return q.includes('diferença entre') || q.includes('qual a diferença') || (q.includes('vs') && !q.includes('jogos'));
      },
      execute: (p: string): AgentToolResult => {
        const q = p.toLowerCase();
        if (q.includes('==') && q.includes('===')) {
          return {
            success: true,
            toolName: 'data_comparison_tool',
            text: `Aqui está a comparação estruturada entre os operadores de igualdade:\n\n| Característica | \`==\` (Igualdade Solta) | \`===\` (Igualdade Estrita) |\n| :--- | :--- | :--- |\n| **Coerção de Tipo** | Sim (tenta converter tipos) | Não (compara tipos diretamente) |\n| **\`0 == ''\`** | \`true\` | \`false\` |\n| **\`null == undefined\`** | \`true\` | \`false\` |\n| **Recomendação** | Evitar em produção | Padrão profissional obrigatório |`,
            codeSnippet: `console.log(0 == false);   // true (coerção implícita)\nconsole.log(0 === false);  // false (número !== booleano)`,
            followUpPrompts: [
              'Como funciona o Object.is() em relação ao ===?',
              'Por que [] == ![] resulta em true no JavaScript?',
              'Quais são os principais casos de coerção bizarra no JS?'
            ]
          };
        }
        if (q.includes('sql') && (q.includes('nosql') || q.includes('mongodb'))) {
          return {
            success: true,
            toolName: 'data_comparison_tool',
            text: `Aqui está a matriz comparativa entre bancos SQL e NoSQL:\n\n| Critério | Bancos SQL (Relacionais) | Bancos NoSQL (Documentos/Grafos) |\n| :--- | :--- | :--- |\n| **Estrutura** | Tabelas com schema rígido | Schemas dinâmicos (JSON, BSON) |\n| **Transações** | ACID nativo e forte integridade | Teorema CAP (consistência eventual) |\n| **Escala** | Escalonamento vertical primário | Escalonamento horizontal distribuído |\n| **Exemplos** | PostgreSQL, MySQL, SQLite | MongoDB, Cassandra, Redis |`,
            followUpPrompts: [
              'Quando devo usar PostgreSQL com colunas JSONB ao invés de MongoDB?',
              'Como funcionam as transações ACID?',
              'Qual escala melhor para milhões de acessos por segundo?'
            ]
          };
        }
        return {
          success: false,
          toolName: 'data_comparison_tool',
          text: 'Comparação não mapeada diretamente.',
          followUpPrompts: ['Qual a diferença entre == e ===?', 'SQL vs NoSQL: qual escolher?']
        };
      }
    }
  ];

  findMatchingTool(prompt: string): AgentTool | null {
    return this.tools.find((t) => t.canHandle(prompt)) || null;
  }

  executeTool(prompt: string, context: AgentContext): AgentToolResult | null {
    const tool = this.findMatchingTool(prompt);
    if (!tool) return null;
    const result = tool.execute(prompt, context);
    return result.success ? result : null;
  }
}

export const agentToolsService = new AgentToolsService();
