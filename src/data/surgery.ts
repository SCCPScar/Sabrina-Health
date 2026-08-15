// Lista informativa das cirurgias plásticas previstas para o final do ano, na
// Turquia. Só para referência da Sabrina — sem qualquer lógica clínica.
import type { PlannedSurgery } from './types-surgery';

export const PLANNED_SURGERIES: PlannedSurgery[] = [
  {
    id: 'lipo360',
    emoji: '✨',
    name: 'Lipo 360',
    desc: 'Lipoaspiração em torno de todo o tronco (frente, lados e costas).'
  },
  {
    id: 'abdominoplastia',
    emoji: '🌸',
    name: 'Abdominoplastia',
    desc: 'Remoção do excesso de pele abdominal, comum após grande perda de peso.'
  },
  {
    id: 'mastopexia',
    emoji: '🎀',
    name: 'Mastopexia com Implante de Silicone',
    desc: 'Elevação do peito combinada com prótese de silicone.'
  },
  {
    id: 'bbl',
    emoji: '🍑',
    name: 'Enxerto de Gordura no Bumbum (BBL)',
    desc: 'Transferência de gordura própria (da lipo) para o bumbum.'
  },
  {
    id: 'plasma-pernas',
    emoji: '💫',
    name: 'Lipo com Jato de Plasma — Parte Interna das Pernas',
    desc: 'Lipoescultura com jato de plasma na zona interna das coxas.'
  }
];
