export interface AIKnowledgeResult {
  text: string;
  codeSnippet?: string;
}

class AIKnowledgeService {
  findKnowledgeAnswer(query: string): AIKnowledgeResult | null {
    const q = query.toLowerCase();

    // 1. Programming & Computer Science
    if (q.includes('python')) {
      return {
        text: 'Python é uma linguagem de alto nível, interpretada e multiparadigma, célebre pela legibilidade. É o padrão da indústria para Inteligência Artificial, Ciência de Dados e automação de backends com frameworks rápidos como FastAPI e Django:',
        codeSnippet: `# Exemplo moderno de tipagem estrita e async em Python\nfrom dataclasses import dataclass\n\n@dataclass\nclass Dev:\n    nome: str\n    skills: list[str]\n\ndef apresentar(dev: Dev) -> str:\n    return f"{dev.nome} domina {', '.join(dev.skills)}!"\n\nprint(apresentar(Dev("Dev Kodigo", ["Python", "FastAPI", "IA"])))`
      };
    }

    if (q.includes('react') || q.includes('hook') || q.includes('usestate') || q.includes('useeffect')) {
      return {
        text: 'O React funciona com base em componentes e uma árvore virtual (Virtual DOM). O segredo para um React de alta performance é manter os estados locais ao componente que os utiliza e isolar efeitos colaterais com hooks puros:',
        codeSnippet: `import React, { useState, useEffect } from 'react';\n\nexport const Contador: React.FC = () => {\n  const [count, setCount] = useState<number>(0);\n  useEffect(() => {\n    document.title = \`Cliques: \${count}\`;\n  }, [count]);\n  return <button onClick={() => setCount(c => c + 1)}>Cliques: {count}</button>;\n};`
      };
    }

    if (q.includes('typescript') || q.includes('tipagem') || q.includes('interface')) {
      return {
        text: 'TypeScript adiciona um sistema de tipos estático sobre o JavaScript, eliminado mais de 80% dos bugs comuns de execução (como undefined is not a function) antes mesmo do código rodar em produção:',
        codeSnippet: `type Status = 'pendente' | 'aprovado' | 'rejeitado';\n\ninterface Tarefa {\n  id: string;\n  titulo: string;\n  status: Status;\n}\n\nconst atualizarStatus = (t: Tarefa, s: Status): Tarefa => ({ ...t, status: s });`
      };
    }

    if (q.includes('sql') || q.includes('banco') || q.includes('database') || q.includes('postgres')) {
      return {
        text: 'Bancos relacionais modernos como o PostgreSQL oferecem confiabilidade ACID, indexação B-Tree rápida e suporte a JSON nativo. Para consultas eficientes, sempre filtre colunas indexadas e evite SELECT * em tabelas grandes:',
        codeSnippet: `-- Consulta analítica com agregação e filtros no PostgreSQL\nSELECT u.username, COUNT(m.id) AS total_mensagens\nFROM public.profiles u\nLEFT JOIN public.chat_messages m ON m.user_id = u.id\nGROUP BY u.username\nHAVING COUNT(m.id) > 0\nORDER BY total_mensagens DESC\nLIMIT 10;`
      };
    }

    if (q.includes('algoritmo') || q.includes('complexidade') || q.includes('big o') || q.includes('ordenacao')) {
      return {
        text: 'A complexidade de tempo e espaço (Notação Big O) mede como o consumo de recursos de um algoritmo cresce em relação ao tamanho da entrada (N). Por exemplo, O(1) é constante, O(log N) é busca binária, O(N) é varredura linear e O(N log N) é o limite para algoritmos de ordenação rápida (como MergeSort e QuickSort).',
        codeSnippet: `// Busca binária eficiente O(log N)\nfunction buscaBinaria(arr: number[], alvo: number): number {\n  let inicio = 0, fim = arr.length - 1;\n  while (inicio <= fim) {\n    const meio = Math.floor((inicio + fim) / 2);\n    if (arr[meio] === alvo) return meio;\n    if (arr[meio] < alvo) inicio = meio + 1;\n    else fim = meio - 1;\n  }\n  return -1;\n}`
      };
    }

    if (q.includes('docker') || q.includes('container') || q.includes('devops')) {
      return {
        text: 'Docker empacota aplicações e suas dependências completas em imagens imutáveis e isoladas do sistema operacional hospedeiro, garantindo o princípio: "se funciona na minha máquina, funciona em qualquer servidor".'
      };
    }

    // 2. Science, Physics, Astronomy & Math
    if (q.includes('buraco negro') || q.includes('universo') || q.includes('estrela') || q.includes('astronomia') || q.includes('galaxia')) {
      return {
        text: 'Na astrofísica, buracos negros são regiões do espaço-tempo onde a gravidade é tão intensa que nada — nem mesmo a luz a 300.000 km/s — consegue escapar do chamado "Horizonte de Eventos". No centro, a Relatividade Geral prevê uma singularidade onde a densidade é teoricamente infinita!'
      };
    }

    if (q.includes('quantica') || q.includes('quântica') || q.includes('fisica') || q.includes('relatividade')) {
      return {
        text: 'A Mecânica Quântica estuda a natureza no nível subatômico, onde partículas como elétrons e fótons exibem dualidade onda-partícula e o Princípio da Incerteza de Heisenberg. Já a Teoria da Relatividade de Einstein descreve o macrocosmos: o espaço e o tempo formam um tecido unificado que se curva sob a presença de massa!'
      };
    }

    if (q.includes('inteligencia artificial') || q.includes('ia') || q.includes('llm') || q.includes('machine learning')) {
      return {
        text: 'Grandes Modelos de Linguagem (LLMs), como a tecnologia que me alimenta, utilizam redes neurais com a arquitetura Transformer e o mecanismo de auto-atenção (Self-Attention). Eles processam bilhões de parâmetros para prever relações semânticas e raciocinar sobre conceitos abstratos, lógica e linguagens em tempo real.'
      };
    }

    // 3. Philosophy & Human Thought
    if (q.includes('filosofia') || q.includes('estoicismo') || q.includes('sentido da vida') || q.includes('etica')) {
      return {
        text: 'O estoicismo (de pensadores como Marco Aurélio e Sêneca) ensina a dicotomia do controle: devemos focar 100% da nossa energia naquilo que está sob nosso controle (nossos pensamentos, atitudes e integridade) e aceitar com serenidade o que está fora dele. O propósito da vida é construído nas pequenas ações diárias e no aprendizado contínuo.'
      };
    }

    // 4. Productivity & Learning
    if (q.includes('aprender') || q.includes('produtividade') || q.includes('estudar') || q.includes('foco')) {
      return {
        text: 'Para aprender qualquer habilidade com máxima retenção (Técnica Feynman):\n1. Escolha o conceito.\n2. Tente explicá-lo em linguagem simples, sem jargões, como se ensinasse a uma criança.\n3. Identifique os pontos onde você travou e revise a fonte.\n4. Pratique com pequenos projetos reais e repetição espaçada!'
      };
    }

    // 5. Intelligent Synthesis for Any General Question
    return {
      text: `Excelente ponto sobre "${query.trim()}". Analisando sob a ótica da ciência, tecnologia e lógica: este assunto envolve compreender os princípios fundamentais, como diferentes variáveis se relacionam e qual o impacto prático no nosso dia a dia. Se quiser aprofundar em algum detalhe específico desse tópico, me diga o que mais chama sua atenção!`
    };
  }
}

export const aiKnowledgeService = new AIKnowledgeService();
