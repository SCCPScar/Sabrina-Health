export const DAY_NAMES = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
export const DAY_ABBR = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
export const MONTH_NAMES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
];

export function todayISO(): string {
  return toISO(new Date());
}

export function toISO(d: Date): string {
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().split('T')[0];
}

export function fromISO(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}

export function formatLong(d: Date = new Date()): string {
  return `${DAY_NAMES[d.getDay()]}, ${d.getDate()} de ${MONTH_NAMES[d.getMonth()]}`;
}

export function formatShort(dateISO: string): string {
  const d = fromISO(dateISO);
  return `${d.getDate()} de ${MONTH_NAMES[d.getMonth()]} de ${d.getFullYear()}`;
}

export function greeting(d: Date = new Date()): string {
  const h = d.getHours();
  if (h < 12) return 'Bom dia';
  if (h < 20) return 'Boa tarde';
  return 'Boa noite';
}

/**
 * Dias de calendário até `dateISO` (pode ser negativo se já passou).
 * Compara apenas datas civis, ignorando a hora do dia, para que "faltam 0
 * dias" seja exatamente hoje e não dependa da hora em que se abre a app.
 */
export function daysUntil(dateISO: string, from: Date = new Date()): number {
  const target = fromISO(dateISO);
  const today = fromISO(toISO(from));
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((target.getTime() - today.getTime()) / msPerDay);
}

/** Sun=0 .. Sat=6 -> ordem das chaves do dataset seg,ter,qua,qui,sex,sab,dom */
export const WEEKDAY_KEYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
