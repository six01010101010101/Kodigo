import { CodeTrack, Unit } from '../types/kodigo.types';

export const INITIAL_TRACKS: CodeTrack[] = [
  {
    id: 'html_css',
    name: 'HTML5 & CSS3',
    language: 'html_css',
    icon: '🌐',
    description: 'A base da web moderna: tags semânticas, layout flexbox e grid.',
    totalUnits: 4,
    completedUnits: 1,
    badgeColor: '#E44D26'
  },
  {
    id: 'javascript',
    name: 'JavaScript Moderno',
    language: 'javascript',
    icon: '⚡',
    description: 'Lógica, manipulação do DOM, async/await e closures.',
    totalUnits: 5,
    completedUnits: 0,
    badgeColor: '#F7DF1E'
  },
  {
    id: 'typescript',
    name: 'TypeScript & React',
    language: 'typescript',
    icon: '🔷',
    description: 'Tipagem estrita, interfaces, generics e componentes full stack.',
    totalUnits: 6,
    completedUnits: 0,
    badgeColor: '#3178C6'
  },
  {
    id: 'python',
    name: 'Python & Automação',
    language: 'python',
    icon: '🐍',
    description: 'Sintaxe limpa, scripts de automação, APIs e dados.',
    totalUnits: 5,
    completedUnits: 0,
    badgeColor: '#3776AB'
  },
  {
    id: 'cpp',
    name: 'C++ de Alta Performance',
    language: 'cpp',
    icon: '⚙️',
    description: 'Ponteiros, gerenciamento de memória manual e algoritmos velozes.',
    totalUnits: 4,
    completedUnits: 0,
    badgeColor: '#00599C'
  }
];

export const HTML_CSS_UNITS: Unit[] = [
  {
    id: 'unit_1',
    title: 'Unidade 1: Fundamentos do HTML5',
    description: 'Aprenda os blocos de construção essenciais de qualquer página web.',
    order: 1,
    isLocked: false,
    lessons: [
      {
        id: 'lesson_1_1',
        title: 'Tags e Estrutura Semântica',
        xpReward: 15,
        completed: true,
        challenges: [
          {
            id: 'c1',
            type: 'multiple_choice',
            prompt: 'Qual tag HTML5 representa o cabeçalho de maior hierarquia em uma página?',
            options: ['<header>', '<h6>', '<h1>', '<title>'],
            correctAnswer: '<h1>',
            hint: 'A numeração 1 indica o topo da hierarquia de títulos.',
            explanation: 'O <h1> define o cabeçalho principal e mais importante de um documento.'
          },
          {
            id: 'c2',
            type: 'multiple_choice',
            prompt: 'Qual elemento semântico é o mais recomendado para uma barra de navegação com links?',
            options: ['<div>', '<nav>', '<section>', '<menu>'],
            correctAnswer: '<nav>',
            hint: 'É uma abreviação de "navigation".',
            explanation: '<nav> informa aos navegadores e leitores de tela que aquele bloco contém links de navegação.'
          }
        ]
      },
      {
        id: 'lesson_1_2',
        title: 'Atributos e Links',
        xpReward: 20,
        completed: false,
        challenges: [
          {
            id: 'c3',
            type: 'multiple_choice',
            prompt: 'Qual atributo é obrigatório na tag <a> para definir o destino do link?',
            options: ['src', 'href', 'target', 'link'],
            correctAnswer: 'href',
            hint: 'Significa Hypertext Reference.',
            explanation: 'O atributo href (Hypertext Reference) especifica a URL da página para a qual o link aponta.'
          },
          {
            id: 'c4',
            type: 'multiple_choice',
            prompt: 'Qual atributo da tag <img> garante acessibilidade quando a imagem não carrega?',
            options: ['alt', 'title', 'caption', 'name'],
            correctAnswer: 'alt',
            hint: 'Significa "texto alternativo".',
            explanation: 'O atributo alt descreve a imagem para leitores de tela e em caso de falha de carregamento.'
          }
        ]
      },
      {
        id: 'lesson_1_3',
        title: 'Formulários e Inputs',
        xpReward: 25,
        completed: false,
        challenges: [
          {
            id: 'c5',
            type: 'multiple_choice',
            prompt: 'Qual tipo de input nativo do HTML5 valida automaticamente o formato de e-mail?',
            options: ['type="text"', 'type="mail"', 'type="email"', 'type="validate"'],
            correctAnswer: 'type="email"',
            hint: 'A palavra exata em inglês para correio eletrônico.',
            explanation: 'Com type="email", o navegador verifica a presença de @ e formato válido antes de enviar.'
          }
        ]
      }
    ]
  },
  {
    id: 'unit_2',
    title: 'Unidade 2: Estilização com CSS3 Moderno',
    description: 'Flexbox, cores vibrantes, fontes e responsividade.',
    order: 2,
    isLocked: false,
    lessons: [
      {
        id: 'lesson_2_1',
        title: 'Flexbox: Alinhamento e Eixos',
        xpReward: 20,
        completed: false,
        challenges: [
          {
            id: 'c6',
            type: 'multiple_choice',
            prompt: 'Qual propriedade Flexbox alinha itens ao longo do eixo principal (main axis)?',
            options: ['align-items', 'justify-content', 'flex-direction', 'align-content'],
            correctAnswer: 'justify-content',
            hint: 'Pense em "justificar" o conteúdo horizontalmente.',
            explanation: 'justify-content distribui o espaço entre itens no eixo principal.'
          }
        ]
      }
    ]
  },
  {
    id: 'unit_3',
    title: 'Unidade 3: CSS Grid Layout',
    description: 'Crie layouts bidimensionais complexos sem complicação.',
    order: 3,
    isLocked: true,
    lessons: []
  }
];
