// Plano alimentar da Nova Sabrina.
// Porções sempre em chávenas, colheres e unidades — nunca em gramas.
// Foco nos alimentos que a Sabrina já come habitualmente: granola, chia,
// sementes de abóbora, psílio, aveia. Contexto pós-bariátrica: porções
// pequenas, alta proteína, fácil digestão, sem forçar quantidade.
import type { Meal } from './types-diet';

export const MEALS: Meal[] = [
  {
    id: 'pa',
    name: 'Pequeno-Almoço',
    time: '08h',
    targetKcal: 220,
    targetProtein: 18,
    options: [
      {
        id: 'pa1',
        emoji: '🥣',
        label: 'Iogurte grego com granola e chia',
        desc: 'Iogurte grego natural (1 chávena pequena) + granola (2 colheres de sopa) + chia (1 colher de chá)',
        kcal: 230,
        protein: 19,
        carbs: 20,
        fat: 8
      },
      {
        id: 'pa2',
        emoji: '🌾',
        label: 'Papas de aveia com canela',
        desc: 'Aveia cozinhada (½ chávena) + leite sem lactose (½ chávena) + sementes de abóbora (1 colher de sopa) + canela a gosto',
        kcal: 215,
        protein: 11,
        carbs: 29,
        fat: 6
      },
      {
        id: 'pa3',
        emoji: '🍳',
        label: 'Ovos mexidos com abacate',
        desc: '2 ovos mexidos + torrada integral fina (1 fatia) + abacate (2 colheres de sopa)',
        kcal: 250,
        protein: 15,
        carbs: 14,
        fat: 15
      },
      {
        id: 'pa4',
        emoji: '🫐',
        label: 'Queijo fresco com granola e mirtilos',
        desc: 'Queijo fresco batido tipo skyr (1 chávena pequena) + granola (2 colheres de sopa) + chia (1 colher de chá) + mirtilos (2 colheres de sopa)',
        kcal: 225,
        protein: 20,
        carbs: 22,
        fat: 6
      },
      {
        id: 'pa5',
        emoji: '🥞',
        label: 'Panqueca de aveia e psílio',
        desc: 'Panqueca feita com aveia (3 colheres de sopa) + 1 ovo + psílio (1 colher de chá), grelhada sem óleo',
        kcal: 210,
        protein: 14,
        carbs: 24,
        fat: 6
      }
    ]
  },
  {
    id: 'lm',
    name: 'Lanche da Manhã',
    time: '10h30',
    targetKcal: 120,
    targetProtein: 8,
    options: [
      {
        id: 'lm1',
        emoji: '🥄',
        label: 'Iogurte grego com sementes de abóbora',
        desc: 'Iogurte grego natural (½ chávena) + sementes de abóbora (1 colher de sopa)',
        kcal: 110,
        protein: 9,
        carbs: 6,
        fat: 5
      },
      {
        id: 'lm2',
        emoji: '🍎',
        label: 'Fruta com chia',
        desc: 'Maçã ou pera em pedaços (1 chávena) + chia (1 colher de chá)',
        kcal: 100,
        protein: 2,
        carbs: 22,
        fat: 2
      },
      {
        id: 'lm3',
        emoji: '🥣',
        label: 'Punhado de granola',
        desc: 'Granola (3 colheres de sopa) com um fiozinho de leite sem lactose',
        kcal: 130,
        protein: 4,
        carbs: 18,
        fat: 5
      },
      {
        id: 'lm4',
        emoji: '🧀',
        label: 'Queijo fresco com nozes',
        desc: 'Queijo fresco (2 colheres de sopa) + 3 nozes',
        kcal: 125,
        protein: 8,
        carbs: 3,
        fat: 9
      }
    ]
  },
  {
    id: 'al',
    name: 'Almoço',
    time: '13h',
    targetKcal: 280,
    targetProtein: 25,
    options: [
      {
        id: 'al1',
        emoji: '🍗',
        label: 'Frango grelhado com legumes',
        desc: 'Frango grelhado desfiado (½ chávena) + legumes salteados (1 chávena) + arroz integral (2 colheres de sopa)',
        kcal: 290,
        protein: 28,
        carbs: 22,
        fat: 8
      },
      {
        id: 'al2',
        emoji: '🐟',
        label: 'Peixe grelhado com puré',
        desc: 'Peixe branco grelhado (1 posta pequena) + puré de batata-doce (½ chávena) + brócolos (½ chávena)',
        kcal: 270,
        protein: 24,
        carbs: 24,
        fat: 6
      },
      {
        id: 'al3',
        emoji: '🍳',
        label: 'Omelete com queijo e espinafres',
        desc: 'Omelete de 2 ovos + espinafres (½ chávena) + queijo light (1 fatia)',
        kcal: 260,
        protein: 22,
        carbs: 4,
        fat: 16
      },
      {
        id: 'al4',
        emoji: '🫘',
        label: 'Leguminosas com legumes',
        desc: 'Grão-de-bico ou lentilhas cozidas (½ chávena) + legumes salteados (½ chávena) + azeite (1 colher de chá)',
        kcal: 265,
        protein: 14,
        carbs: 34,
        fat: 8
      },
      {
        id: 'al5',
        emoji: '🥗',
        label: 'Frango com quinoa',
        desc: 'Frango grelhado em cubos (½ chávena) + quinoa cozida (3 colheres de sopa) + tomate e pepino (½ chávena)',
        kcal: 285,
        protein: 27,
        carbs: 24,
        fat: 7
      }
    ]
  },
  {
    id: 'lt',
    name: 'Lanche da Tarde',
    time: '16h30',
    targetKcal: 120,
    targetProtein: 8,
    options: [
      {
        id: 'lt1',
        emoji: '🥄',
        label: 'Iogurte com psílio e canela',
        desc: 'Iogurte grego (½ chávena) + psílio (1 colher de chá) + canela a gosto',
        kcal: 105,
        protein: 9,
        carbs: 7,
        fat: 4
      },
      {
        id: 'lt2',
        emoji: '🍇',
        label: 'Fruta com sementes de abóbora',
        desc: 'Fatias de fruta da época (1 chávena) + sementes de abóbora (1 colher de sopa)',
        kcal: 115,
        protein: 3,
        carbs: 20,
        fat: 3
      },
      {
        id: 'lt3',
        emoji: '🍞',
        label: 'Torrada com queijo fresco',
        desc: 'Torrada integral fina (1 fatia) + queijo fresco (2 colheres de sopa)',
        kcal: 120,
        protein: 8,
        carbs: 12,
        fat: 4
      },
      {
        id: 'lt4',
        emoji: '🥤',
        label: 'Smoothie leve de iogurte e chia',
        desc: 'Smoothie de iogurte, chia e fruta (1 copo pequeno, cerca de 1 chávena)',
        kcal: 130,
        protein: 7,
        carbs: 18,
        fat: 3
      }
    ]
  },
  {
    id: 'ja',
    name: 'Jantar',
    time: '19h30',
    targetKcal: 260,
    targetProtein: 22,
    options: [
      {
        id: 'ja1',
        emoji: '🍲',
        label: 'Sopa de legumes com peixe',
        desc: 'Sopa de legumes (1 chávena) + peixe grelhado (1 posta pequena)',
        kcal: 250,
        protein: 22,
        carbs: 16,
        fat: 8
      },
      {
        id: 'ja2',
        emoji: '🍳',
        label: 'Omelete leve com cogumelos',
        desc: 'Omelete de 2 claras + 1 ovo inteiro + cogumelos salteados (½ chávena)',
        kcal: 200,
        protein: 20,
        carbs: 4,
        fat: 11
      },
      {
        id: 'ja3',
        emoji: '🍗',
        label: 'Frango desfiado com legumes',
        desc: 'Frango desfiado (½ chávena) + legumes cozidos (1 chávena)',
        kcal: 245,
        protein: 25,
        carbs: 12,
        fat: 8
      },
      {
        id: 'ja4',
        emoji: '🥗',
        label: 'Queijo fresco com salada',
        desc: 'Queijo fresco (½ chávena) + salada verde (1 chávena) + azeite (1 colher de chá)',
        kcal: 240,
        protein: 18,
        carbs: 8,
        fat: 15
      },
      {
        id: 'ja5',
        emoji: '🍵',
        label: 'Creme de legumes com sementes',
        desc: 'Creme de legumes (1 chávena) + sementes de abóbora por cima (1 colher de sopa) + queijo fresco (2 colheres de sopa)',
        kcal: 230,
        protein: 14,
        carbs: 22,
        fat: 9
      }
    ]
  },
  {
    id: 'ce',
    name: 'Ceia',
    time: '21h30',
    targetKcal: 100,
    targetProtein: 8,
    options: [
      {
        id: 'ce1',
        emoji: '🥄',
        label: 'Iogurte grego pequeno',
        desc: 'Iogurte grego natural (½ chávena)',
        kcal: 90,
        protein: 9,
        carbs: 4,
        fat: 4
      },
      {
        id: 'ce2',
        emoji: '🥛',
        label: 'Leite morno com psílio',
        desc: 'Leite sem lactose morno (1 chávena pequena) + psílio (1 colher de chá)',
        kcal: 95,
        protein: 7,
        carbs: 10,
        fat: 2
      },
      {
        id: 'ce3',
        emoji: '🧀',
        label: 'Queijo fresco',
        desc: 'Queijo fresco (2 colheres de sopa)',
        kcal: 80,
        protein: 8,
        carbs: 2,
        fat: 4
      },
      {
        id: 'ce4',
        emoji: '🍵',
        label: 'Chá com sementes de abóbora',
        desc: 'Chá de camomila ou erva-cidreira + sementes de abóbora (1 colher de sopa)',
        kcal: 70,
        protein: 4,
        carbs: 4,
        fat: 4
      }
    ]
  }
];
