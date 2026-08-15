export interface FoodOption {
  id: string;
  emoji: string;
  label: string;
  /** Porção descrita de forma prática — chávenas, colheres, unidades. Nunca em gramas. */
  desc: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  targetKcal: number;
  targetProtein: number;
  options: FoodOption[];
}

export const SUPPLEMENTS = [
  { name: 'Vitamina B12', note: 'Essencial pós-bariátrica' },
  { name: 'Multivitamínico', note: 'Diário, conforme indicação médica' },
  { name: 'Vitamina D', note: 'Diário ou conforme indicação médica' },
  { name: 'Cálcio', note: 'Diário, especialmente pós-bariátrica' },
  { name: 'Proteína em pó (whey ou vegetal)', note: 'Opcional, para ajudar a atingir a meta de proteína em dias de pouco apetite' }
];

export const DIET_NOTES = [
  'Porções pequenas, sem pressa — o objetivo é comer bem, não terminar o prato.',
  'Todas as opções de uma refeição são substituições equivalentes entre si — escolhe sempre a que tiveres disponível ou te apetecer mais.',
  'Não bebas durante as refeições (cerca de 30 min antes e depois) — recomendação comum pós-bariátrica.',
  'Com o Mounjaro o apetite pode variar bastante de dia para dia — está tudo bem em comer menos do que a porção sugerida nos dias de pouca fome.',
  'As porções aqui são descritas em chávenas, colheres e unidades de propósito — esta app nunca pede para pesar comida.',
  'Os valores de kcal e macros são estimativas de referência para acompanhamento pessoal — não são dados de tabela nutricional certificada nem substituem indicação médica/nutricional.'
];
