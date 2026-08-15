import type { DayRecord, DressingEntry, Tombstonable } from './types';

/**
 * Merge strategy for the sync layer, used only when BOTH the local and the
 * remote copy of a key changed since the last successful sync (a genuine
 * concurrent edit — e.g. refeições marcadas no telemóvel enquanto offline, e
 * água registada no PC na mesma janela). Fora dessa janela estreita,
 * sync.ts usa o lado que sabe não ter mudado, sem chamar isto — o merge é a
 * exceção, não o caminho por defeito.
 *
 * Bias for DayRecord fields (meals/exercises/water/training/dressings): nunca
 * perder um estado "feito"/marcado que qualquer um dos lados tenha
 * registado — ver mergeDayRecords.
 *
 * Bias for entry lists (peso/medidas/notas/progressão): resolve conflitos de
 * mesmo conteúdo por `updatedAt` (ver tombstoneList.ts) — o lado que tocou
 * nessa entrada mais recentemente ganha, INCLUINDO um delete, para que uma
 * eliminação feita offline não seja ressuscitada por uma cópia remota
 * desatualizada assim que ambos os lados sincronizarem. Entradas sem
 * `updatedAt` (dados pré-tombstone) são tratadas como as mais antigas.
 */

export function mergeDayRecords(a: DayRecord, b: DayRecord): DayRecord {
  return {
    meals: unionBooleans(a.meals, b.meals),
    water: Math.max(a.water ?? 0, b.water ?? 0),
    exercisesDone: unionStringArrays(a.exercisesDone, b.exercisesDone),
    trainingDone: a.trainingDone?.done ? a.trainingDone : b.trainingDone?.done ? b.trainingDone : null,
    dressings: mergeDressings(a.dressings ?? [], b.dressings ?? [])
  };
}

function unionBooleans(a: Record<string, boolean>, b: Record<string, boolean>): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  for (const k of new Set([...Object.keys(a ?? {}), ...Object.keys(b ?? {})])) {
    out[k] = Boolean(a?.[k]) || Boolean(b?.[k]);
  }
  return out;
}

function unionStringArrays(a: Record<string, string[]>, b: Record<string, string[]>): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const k of new Set([...Object.keys(a ?? {}), ...Object.keys(b ?? {})])) {
    out[k] = [...new Set([...(a?.[k] ?? []), ...(b?.[k] ?? [])])];
  }
  return out;
}

function mergeDressings(a: DressingEntry[], b: DressingEntry[]): DressingEntry[] {
  const map = new Map<string, DressingEntry>();
  for (const entry of a) map.set(entry.id, entry);
  for (const entry of b) {
    const existing = map.get(entry.id);
    map.set(entry.id, existing ? { ...existing, done: existing.done || entry.done } : entry);
  }
  return [...map.values()].sort((x, y) => (x.time < y.time ? -1 : x.time > y.time ? 1 : 0));
}

/**
 * Union-merges duas listas append-only e tombstoned (peso, medidas, notas,
 * progressão) por chave de conteúdo. Quando ambos os lados têm uma entrada
 * com a mesma chave, a que tiver o `updatedAt` mais recente ganha — apagada
 * ou não — em vez de manter sempre a cópia local. O resultado mantém os
 * tombstones (quem chama persiste o array em bruto); as leituras da UI devem
 * usar sempre os getters "visible-only" de storage.ts, que já filtram as
 * entradas apagadas.
 */
export function mergeEntryLists<T extends Tombstonable>(
  local: T[],
  remote: T[],
  keyFn: (entry: T) => string,
  dateFn: (entry: T) => string
): T[] {
  const map = new Map<string, T>();
  const consider = (entry: T) => {
    const k = keyFn(entry);
    const existing = map.get(k);
    if (!existing || (entry.updatedAt ?? 0) >= (existing.updatedAt ?? 0)) {
      map.set(k, entry);
    }
  };
  for (const entry of remote ?? []) consider(entry);
  for (const entry of local ?? []) consider(entry);
  return [...map.values()].sort((x, y) => {
    const dx = dateFn(x);
    const dy = dateFn(y);
    return dx < dy ? 1 : dx > dy ? -1 : 0;
  });
}
