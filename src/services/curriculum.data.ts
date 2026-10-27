import { CodeTrack, Unit } from '../types/kodigo.types';

export const SIX_LEVEL_TRACKS: CodeTrack[] = [
  {
    id: 'lvl_basico',
    name: '1. Básico: Web & Git',
    language: 'html_css',
    icon: '🌐',
    description: 'Fundamentos essenciais da web: tags semânticas, acessibilidade ARIA e versionamento com Git.',
    totalUnits: 3,
    completedUnits: 1,
    badgeColor: '#10B981'
  },
  {
    id: 'lvl_medio',
    name: '2. Médio: JavaScript ES2024',
    language: 'javascript',
    icon: '⚡',
    description: 'Event Loop, Closures, Async/Await, manipulação de arrays e lógica assíncrona moderna.',
    totalUnits: 4,
    completedUnits: 0,
    badgeColor: '#F59E0B'
  },
  {
    id: 'lvl_intermediario',
    name: '3. Intermediário: TypeScript & React',
    language: 'typescript',
    icon: '🔷',
    description: 'Tipagem estrita, Generics, arquitetura de componentes, hooks e ciclo de vida do React 19.',
    totalUnits: 4,
    completedUnits: 0,
    badgeColor: '#3B82F6'
  },
  {
    id: 'lvl_avancado',
    name: '4. Avançado: Supabase & Full Stack',
    language: 'typescript',
    icon: '🗄️',
    description: 'Bancos relacionais PostgreSQL, queries SQL de alta performance, Row Level Security e APIs.',
    totalUnits: 4,
    completedUnits: 0,
    badgeColor: '#8B5CF6'
  },
  {
    id: 'lvl_expert',
    name: '5. Expert: Python & Automação',
    language: 'python',
    icon: '🐍',
    description: 'Scripts de automação corporativa, decorators, generators, APIs com FastAPI e dados.',
    totalUnits: 4,
    completedUnits: 0,
    badgeColor: '#06B6D4'
  },
  {
    id: 'lvl_pro',
    name: '6. Pró: C++20 & Alta Performance',
    language: 'cpp',
    icon: '⚙️',
    description: 'Ponteiros, RAII, gerenciamento de memória manual, smart pointers e concorrência multithread.',
    totalUnits: 4,
    completedUnits: 0,
    badgeColor: '#EC4899'
  }
];

export const SERIOUS_UNITS: Unit[] = [
  {
    id: 'u_basico_1',
    title: 'Nível Básico: Estrutura & Semântica Corporativa',
    description: 'Boas práticas profissionais que empresas e auditorias de acessibilidade exigem.',
    order: 1,
    isLocked: false,
    lessons: [
      {
        id: 'l_b1',
        title: 'Arquitetura Semântica & SEO',
        xpReward: 25,
        completed: true,
        challenges: [
          {
            id: 'cb1',
            type: 'multiple_choice',
            prompt: 'Em uma aplicação moderna, qual tag deve encapsular o conteúdo central e único da página para otimização de SEO e leitores de tela?',
            options: ['<div class="content">', '<main>', '<section id="app">', '<article>'],
            correctAnswer: '<main>',
            hint: 'A tag que define o conteúdo primordial do documento (apenas uma por documento).',
            explanation: 'A tag <main> é o padrão W3C para indicar o bloco principal, eliminando ruídos em leitores de tela e otimizando SEO.'
          },
          {
            id: 'cb2',
            type: 'multiple_choice',
            prompt: 'No Git, qual comando cria uma branch e alterna para ela imediatamente no padrão moderno?',
            options: ['git branch -new feature', 'git switch -c feature', 'git checkout -m feature', 'git init feature'],
            correctAnswer: 'git switch -c feature',
            hint: 'O subcomando "switch" com a flag "-c" (create).',
            explanation: 'git switch -c é a sintaxe oficial e segura introduzida no Git moderno para separação entre navegação de branches e restauração de arquivos.'
          }
        ]
      },
      {
        id: 'l_b2',
        title: 'Box Model & Renderização no Navegador',
        xpReward: 30,
        completed: false,
        challenges: [
          {
            id: 'cb3',
            type: 'multiple_choice',
            prompt: 'Qual regra CSS evita que o padding e a borda aumentem a largura total definida de um componente?',
            options: ['box-sizing: border-box;', 'display: contents;', 'overflow: hidden;', 'margin: collapse;'],
            correctAnswer: 'box-sizing: border-box;',
            hint: 'Indica que a caixa deve calcular suas dimensões considerando a borda.',
            explanation: 'box-sizing: border-box faz com que width e height incluam padding e border, evitando quebras acidentais de layout.'
          }
        ]
      }
    ]
  },
  {
    id: 'u_medio_1',
    title: 'Nível Médio: Assincronismo & Event Loop',
    description: 'Entenda como a V8 do Chrome e o Node processam tarefas na Microtask Queue.',
    order: 2,
    isLocked: false,
    lessons: [
      {
        id: 'l_m1',
        title: 'Microtasks vs Macrotasks',
        xpReward: 35,
        completed: false,
        challenges: [
          {
            id: 'cm1',
            type: 'multiple_choice',
            prompt: 'Entre Promise.resolve() e setTimeout(fn, 0), qual callback o Event Loop executará primeiro?',
            options: ['Promise.resolve() (Microtask Queue)', 'setTimeout (Macrotask/Task Queue)', 'Executam simultaneamente em paralelo', 'A ordem é aleatória'],
            correctAnswer: 'Promise.resolve() (Microtask Queue)',
            hint: 'A Microtask Queue tem prioridade estrita de esvaziamento antes da próxima Macrotask.',
            explanation: 'Microtasks (Promises, queueMicrotask) são sempre drenadas antes que o Event Loop processe a próxima macrotask do timer.'
          }
        ]
      }
    ]
  },
  {
    id: 'u_inter_1',
    title: 'Nível Intermediário: TypeScript Estrito & React 19',
    description: 'Generics avançados, inferência de tipos e imutabilidade.',
    order: 3,
    isLocked: true,
    lessons: []
  },
  {
    id: 'u_pro_1',
    title: 'Níveis Avançado a Pró: Backend, Python & C++20',
    description: 'Arquitetura de dados, memória manual com ponteiros e alta escalabilidade.',
    order: 4,
    isLocked: true,
    lessons: []
  }
];
