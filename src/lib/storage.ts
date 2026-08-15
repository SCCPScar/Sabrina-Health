import type { DayRecord, DressingEntry, MeasurementEntry, MedicationEntry, NoteEntry, Settings, WeightEntry, Tombstonable } from './types';
import { DEFAULT_SETTINGS } from './types';
import { visible, withAdded, withSoftDeleted } from './tombstoneList';

export const PFX = 'ns';

/** Keys changed by any set* call, used by the sync layer to know what to push. */
export type ChangeListener = (key: string) => void;
const listeners = new Set<ChangeListener>();
export function onChange(fn: ChangeListener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
function notify(key: string) {
  for (const fn of listeners) fn(key);
}

export function rawGet<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function rawSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notify(key);
  } catch {
    // storage full or unavailable — data stays in memory for this session
  }
}

export function rawRemove(key: string): void {
  try {
    localStorage.removeItem(key);
    notify(key);
  } catch {
    /* ignore */
  }
}

/**
 * Internal bookkeeping keys that live under the same "ns_" prefix but are
 * NOT user data — they must never be synced to the cloud (a stale
 * ns_last_synced_at pulled from another device would corrupt this device's
 * sync cursor) and never included in backups.
 */
const INTERNAL_KEYS = new Set([`${PFX}_meta`, `${PFX}_last_synced_at`]);

/** Every user-data key currently in localStorage, for backup/export/sync. */
export function allKeys(): string[] {
  const out: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(PFX + '_') && !INTERNAL_KEYS.has(k)) out.push(k);
  }
  return out;
}

// ---- Day records (refeições, água, exercícios, treino, curativos) ----

const emptyDay = (): DayRecord => ({ meals: {}, water: 0, exercisesDone: {}, trainingDone: null, dressings: [], medsTaken: {} });

export function getDay(date: string): DayRecord {
  const d = rawGet<Partial<DayRecord>>(`${PFX}_day_${date}`, {});
  return { ...emptyDay(), ...d };
}

function setDay(date: string, day: DayRecord): void {
  rawSet(`${PFX}_day_${date}`, day);
}

export function toggleMeal(date: string, mealId: string): boolean {
  const day = getDay(date);
  day.meals[mealId] = !day.meals[mealId];
  setDay(date, day);
  return day.meals[mealId];
}

export function getWater(date: string): number {
  return getDay(date).water;
}

export function setWater(date: string, glasses: number): void {
  const day = getDay(date);
  day.water = Math.max(0, glasses);
  setDay(date, day);
}

export function getExercisesDone(date: string, workoutId: string): string[] {
  return getDay(date).exercisesDone[workoutId] ?? [];
}

export function toggleExercise(date: string, workoutId: string, exerciseId: string): boolean {
  const day = getDay(date);
  const list = day.exercisesDone[workoutId] ?? [];
  const idx = list.indexOf(exerciseId);
  let done: boolean;
  if (idx >= 0) {
    list.splice(idx, 1);
    done = false;
  } else {
    list.push(exerciseId);
    done = true;
  }
  day.exercisesDone[workoutId] = list;
  setDay(date, day);
  return done;
}

export function setTrainingDone(date: string, workoutId: string, done = true): void {
  const day = getDay(date);
  day.trainingDone = done ? { workoutId, done: true } : null;
  setDay(date, day);
}

// ---- Curativos pós-operatórios ----

export function getDressings(date: string): DressingEntry[] {
  return getDay(date).dressings;
}

export function addDressing(date: string, time: string, label: string): void {
  const day = getDay(date);
  day.dressings.push({ id: `${date}_${time}_${Date.now()}`, time, label, done: false });
  day.dressings.sort((a, b) => (a.time < b.time ? -1 : a.time > b.time ? 1 : 0));
  setDay(date, day);
}

export function toggleDressing(date: string, id: string): void {
  const day = getDay(date);
  const entry = day.dressings.find((d) => d.id === id);
  if (!entry) return;
  entry.done = !entry.done;
  setDay(date, day);
}

export function deleteDressing(date: string, id: string): void {
  const day = getDay(date);
  day.dressings = day.dressings.filter((d) => d.id !== id);
  setDay(date, day);
}

// ---- Toma diária de medicação ----

function medKey(medicationId: string, time: string): string {
  return `${medicationId}::${time}`;
}

export function getMedsTaken(date: string): Record<string, boolean> {
  return getDay(date).medsTaken;
}

export function isMedTaken(date: string, medicationId: string, time: string): boolean {
  return Boolean(getMedsTaken(date)[medKey(medicationId, time)]);
}

export function toggleMedTaken(date: string, medicationId: string, time: string): boolean {
  const day = getDay(date);
  const key = medKey(medicationId, time);
  day.medsTaken[key] = !day.medsTaken[key];
  setDay(date, day);
  return day.medsTaken[key];
}

// ---- Peso ----
// Deletes are soft (tombstoned), never spliced out, so a delete made offline
// on one device can't be silently undone by a stale copy still held by
// another device once they sync — see tombstoneList.ts and merge.ts.

function getWeightsRaw(): WeightEntry[] {
  return rawGet<WeightEntry[]>(`${PFX}_weights`, []);
}

export function getWeights(): WeightEntry[] {
  return visible(getWeightsRaw());
}

export function addWeight(kg: number, date: string): void {
  rawSet(`${PFX}_weights`, withAdded(getWeightsRaw(), { kg, date }));
}

export function deleteWeight(visibleIndex: number): void {
  rawSet(
    `${PFX}_weights`,
    withSoftDeleted(getWeightsRaw(), visibleIndex, (a, b) => a.date === b.date && a.kg === b.kg)
  );
}

// ---- Medidas ----

function getMeasurementsRaw(): MeasurementEntry[] {
  return rawGet<MeasurementEntry[]>(`${PFX}_measurements`, []);
}

export function getMeasurements(): MeasurementEntry[] {
  return visible(getMeasurementsRaw());
}

function sameMeasurement(a: MeasurementEntry, b: MeasurementEntry): boolean {
  return (
    a.date === b.date &&
    a.waist === b.waist &&
    a.hip === b.hip &&
    a.thigh === b.thigh &&
    a.arm === b.arm &&
    JSON.stringify(a.extra ?? {}) === JSON.stringify(b.extra ?? {})
  );
}

export function addMeasurement(entry: Omit<MeasurementEntry, 'updatedAt' | 'deleted'>): void {
  rawSet(`${PFX}_measurements`, withAdded(getMeasurementsRaw(), entry));
}

export function deleteMeasurement(visibleIndex: number): void {
  rawSet(`${PFX}_measurements`, withSoftDeleted(getMeasurementsRaw(), visibleIndex, sameMeasurement));
}

/**
 * Edits are implemented as tombstone-the-old-entry + add-a-new-one, rather
 * than mutating fields in place. The sync/merge layer identifies entries by
 * their content (see merge.ts), so an in-place field change would silently
 * create a duplicate on the next sync instead of replacing anything — going
 * through the same soft-delete + add primitives keeps editing exactly as
 * sync-safe as deleting already is.
 */
export function updateMeasurement(visibleIndex: number, next: Omit<MeasurementEntry, 'updatedAt' | 'deleted'>): void {
  const withDeleted = withSoftDeleted(getMeasurementsRaw(), visibleIndex, sameMeasurement);
  rawSet(`${PFX}_measurements`, withAdded(withDeleted, next));
}

// ---- Notas / diário ----

function getNotesRaw(): NoteEntry[] {
  return rawGet<NoteEntry[]>(`${PFX}_notes`, []);
}

export function getNotes(): NoteEntry[] {
  return visible(getNotesRaw());
}

export function addNote(text: string, date: string): void {
  rawSet(`${PFX}_notes`, withAdded(getNotesRaw(), { text, date }));
}

export function deleteNote(visibleIndex: number): void {
  rawSet(
    `${PFX}_notes`,
    withSoftDeleted(getNotesRaw(), visibleIndex, (a, b) => a.date === b.date && a.text === b.text)
  );
}

// ---- Medicação / suplementos ----
// Ao contrário de peso/medidas/notas (sem id natural, por isso identificadas
// por conteúdo), cada medicação tem um `id` estável — edições mudam os
// campos in-place em vez de tombstone+re-add, e o merge (ver merge.ts) usa
// esse id diretamente como chave.

function getMedicationsRaw(): MedicationEntry[] {
  return rawGet<MedicationEntry[]>(`${PFX}_medications`, []);
}

export function getMedications(): MedicationEntry[] {
  return visible(getMedicationsRaw());
}

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function addMedication(entry: { name: string; note?: string; times: string[] }): MedicationEntry {
  const raw = getMedicationsRaw();
  const created: MedicationEntry = { ...entry, id: generateId(), updatedAt: Date.now() };
  rawSet(`${PFX}_medications`, [created, ...raw]);
  return created;
}

export function updateMedication(id: string, patch: { name: string; note?: string; times: string[] }): void {
  const raw = getMedicationsRaw();
  const idx = raw.findIndex((m) => m.id === id && !m.deleted);
  if (idx === -1) return;
  const next = [...raw];
  next[idx] = { ...next[idx], ...patch, updatedAt: Date.now() };
  rawSet(`${PFX}_medications`, next);
}

export function deleteMedication(id: string): void {
  const raw = getMedicationsRaw();
  const idx = raw.findIndex((m) => m.id === id && !m.deleted);
  if (idx === -1) return;
  const next = [...raw];
  next[idx] = { ...next[idx], deleted: true, updatedAt: Date.now() };
  rawSet(`${PFX}_medications`, next);
}

// ---- Definições ----

export function getSettings(): Settings {
  const stored = rawGet<Partial<Settings>>(`${PFX}_settings`, {});
  return {
    ...DEFAULT_SETTINGS,
    ...stored,
    mounjaro: { ...DEFAULT_SETTINGS.mounjaro, ...(stored.mounjaro ?? {}) },
    reminderTimes: { ...DEFAULT_SETTINGS.reminderTimes, ...(stored.reminderTimes ?? {}) }
  };
}

export function saveSettings(patch: Partial<Settings>): Settings {
  const next = { ...getSettings(), ...patch };
  rawSet(`${PFX}_settings`, next);
  return next;
}

// ---- Exportar / importar tudo (backup) ----

export interface Backup {
  version: 1;
  exportedAt: string;
  data: Record<string, unknown>;
}

export function exportBackup(): Backup {
  const data: Record<string, unknown> = {};
  for (const key of allKeys()) {
    data[key] = rawGet(key, null);
  }
  return { version: 1, exportedAt: new Date().toISOString(), data };
}

export function importBackup(backup: Backup): void {
  if (!backup || typeof backup !== 'object' || !backup.data) {
    throw new Error('Ficheiro de backup inválido.');
  }
  for (const [key, value] of Object.entries(backup.data)) {
    if (key.startsWith(PFX + '_') && !INTERNAL_KEYS.has(key)) rawSet(key, value);
  }
}

// ---- Progressão de treino (reps/carga/duração) ----

export interface ExerciseLogEntry extends Tombstonable {
  date: string;
  weightKg?: number; // carga usada, para exercícios com halteres leves ou elástico graduado
  reps?: number; // repetições feitas
  seconds?: number; // duração (ex. prancha, wall sit)
  note?: string; // variação/dificuldade (ex. "joelhos no chão", "elástico leve")
}

function getExerciseLoadsRaw(exerciseId: string): ExerciseLogEntry[] {
  return rawGet<ExerciseLogEntry[]>(`${PFX}_loads_${exerciseId}`, []);
}

export function getExerciseLoads(exerciseId: string): ExerciseLogEntry[] {
  return visible(getExerciseLoadsRaw(exerciseId));
}

export function logExerciseLoad(exerciseId: string, entry: Omit<ExerciseLogEntry, 'updatedAt' | 'deleted'>): void {
  rawSet(`${PFX}_loads_${exerciseId}`, withAdded(getExerciseLoadsRaw(exerciseId), entry));
}

export function deleteExerciseLoad(exerciseId: string, visibleIndex: number): void {
  rawSet(
    `${PFX}_loads_${exerciseId}`,
    withSoftDeleted(
      getExerciseLoadsRaw(exerciseId),
      visibleIndex,
      (a, b) => a.date === b.date && a.weightKg === b.weightKg && a.reps === b.reps && a.seconds === b.seconds && a.note === b.note
    )
  );
}
