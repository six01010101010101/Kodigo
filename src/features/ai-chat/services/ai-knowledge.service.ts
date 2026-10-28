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
        text: 'Python é uma das linguagens mais agradáveis e populares do mundo, justamente por ler quase como inglês! Ela domina Machine Learning, automações e criação de APIs rápidas com FastAPI:',
        codeSnippet: `# Exemplo limpo e moderno em Python\ndef saudar(nome: str) -> str:\n    return f"Olá, {nome}! Bem-vindo à jornada de código do Kodigo!"\n\nprint(saudar("Dev"))`
      };
    }

    if (q.includes('javascript') || q.includes('js')) {
      return {
        text: 'JavaScript é a alma viva da web moderna! Com o motor V8 e o ecossistema Node.js, ele roda tanto no navegador quanto em servidores de altíssima escala:',
        codeSnippet: `// Arrow function e desestruturação moderna\nconst usuario = { nome: 'Dev', nivel: 'Pro' };\nconst boasVindas = ({ nome, nivel }) => \`Dev \${nome} no nível \${nivel}!\`;\nconsole.log(boasVindas(usuario));`
      };
    }

    if (q.includes('react') || q.includes('hook') || q.includes('usestate') || q.includes('useeffect')) {
      return {
        text: 'O React trabalha com componentes reutilizáveis e reatividade instantânea. Cada vez que o estado muda, a interface se adapta de forma eficiente através do Virtual DOM:',
        codeSnippet: `import React, { useState } from 'react';\n\nexport const Contador: React.FC = () => {\n  const [count, setCount] = useState<number>(0);\n  return <button onClick={() => setCount(c => c + 1)}>Cliques: {count}</button>;\n};`
      };
    }

    if (q.includes('typescript') || q.includes('tipagem') || q.includes('interface')) {
      return {
        text: 'TypeScript adiciona segurança e previsibilidade ao JavaScript, avisando de erros de digitação e tipos errados antes mesmo de você rodar o código:',
        codeSnippet: `interface Aluno {\n  nome: string;\n  xp: number;\n}\n\nconst premiar = (a: Aluno): string => \`\${a.nome} tem \${a.xp} XP acumulados!\`;`
      };
    }

    if (q.includes('sql') || q.includes('banco') || q.includes('database') || q.includes('postgres')) {
      return {
        text: 'Bancos de dados relacionais como o PostgreSQL organizam informações em tabelas com chaves primárias e relacionamentos estritos, garantindo integridade e velocidade em consultas:',
        codeSnippet: `SELECT u.username, COUNT(m.id) AS total\nFROM public.profiles u\nJOIN public.chat_messages m ON m.user_id = u.id\nGROUP BY u.username;`
      };
    }

    if (q.includes('docker') || q.includes('container')) {
      return {
        text: 'O Docker revolucionou a entrega de software: ele empacota todo o ambiente (Node, Python, bibliotecas e SO) em um container leve que roda idêntico em qualquer máquina ou nuvem.'
      };
    }

    // 2. Science, Astronomy & Nature
    if (q.includes('buraco negro') || q.includes('universo') || q.includes('espaço') || q.includes('estrela') || q.includes('galaxia') || q.includes('galáxia')) {
      return {
        text: 'O universo é fascinante demais! Os buracos negros são corpos celestes com uma densidade tão gigantesca que nem a partícula mais veloz do cosmos — a luz — consegue escapar do seu horizonte de eventos. É onde a gravidade extrema e o tempo se curvam de maneira surreal!'
      };
    }

    if (q.includes('inteligencia artificial') || q.includes('ia') || q.includes('llm') || q.includes('machine learning')) {
      return {
        text: 'A Inteligência Artificial moderna aprende a partir de bilhões de padrões em redes neurais profundas. Ela não apenas decora dados, mas conecta conceitos semânticos para conversar, raciocinar e criar soluções junto com a gente!'
      };
    }

    if (q.includes('filosofia') || q.includes('estoicismo') || q.includes('sentido da vida')) {
      return {
        text: 'Filosofia é a arte de viver bem. O estoicismo nos lembra que não podemos controlar o que acontece no mundo exterior, mas temos controle absoluto sobre como reagimos e como tratamos as pessoas com gentileza e integridade.'
      };
    }

    // 3. Conversational Default (Human-to-Human friend tone)
    const isQuestion = query.includes('?');
    if (isQuestion) {
      return {
        text: `Nossa, que reflexão bacana! Pensando sobre isso, tem muitos ângulos legais para a gente conversar. Me conta mais: o que te fez ter essa curiosidade hoje? Adoraria saber a sua visão!`
      };
    }

    return {
      text: `Nossa, concordo totalmente com você! É muito legal reparar e conversar sobre essas coisas do dia a dia. Tem mais alguma coisa que você tem reparado ultimamente? Adoro trocar ideias com você!`
    };
  }
}

export const aiKnowledgeService = new AIKnowledgeService();
