/**
 * Every append-only, sync-merged list entry (peso, medidas, notas) carries
 * these two fields so deletions survive sync as tombstones instead of being
 * resurrected by a stale copy from another device — see
 * src/lib/tombstoneList.ts and src/lib/merge.ts.
 */
export interface Tombstonable {
  /** epoch ms of the last create/delete of this entry — used to resolve conflicts. */
  updatedAt?: number;
  /** true once soft-deleted; entries are never physically removed pre-sync. */
  deleted?: boolean;
}

export interface WeightEntry extends Tombstonable {
  date: string; // YYYY-MM-DD
  kg: number;
}

export interface MeasurementEntry extends Tombstonable {
  date: string;
  waist?: number; // cintura
  hip?: number; // quadril / glúteos
  thigh?: number; // coxa
  arm?: number; // braço
  extra?: Record<string, number>;
}

export interface NoteEntry extends Tombstonable {
  date: string;
  text: string;
}

export interface DressingEntry {
  id: string;
  time: string; // HH:MM
  label: string;
  done: boolean;
}

/**
 * Medicação/suplementos, com horários diários para lembretes. `id` é a
 * identidade estável da entrada (edições são feitas in-place, ao contrário
 * de peso/medidas/notas, que não têm um id natural e por isso usam
 * tombstone+re-add — ver merge.ts).
 */
export interface MedicationEntry extends Tombstonable {
  id: string;
  name: string;
  note?: string; // ex: "1 comprimido", "2x ao dia"
  times: string[]; // HH:MM, uma ou mais tomas por dia
}

export interface DayRecord {
  meals: Record<string, boolean>; // meal option id -> comido
  water: number; // copos
  exercisesDone: Record<string, string[]>; // workoutId -> exercise ids feitos
  trainingDone: { workoutId: string; done: boolean } | null;
  dressings: DressingEntry[];
  medsTaken: Record<string, boolean>; // `${medicationId}::${time}` -> tomado
}

export interface MounjaroInfo {
  startDate: string; // YYYY-MM-DD
  endDatePlanned: string; // YYYY-MM-DD
  resumedDate?: string; // preenchido se/quando retomar
}

export interface Settings {
  name: string;
  age: number;
  heightCm: number;
  currentWeightKg: number;
  goalWeightKg: number;
  bariatricSurgeryDate?: string; // YYYY-MM-DD, opcional
  mounjaro: MounjaroInfo;
  turkeyTripDate: string; // YYYY-MM-DD
  waterGoalMl: number;
  calorieGoal: number;
  proteinGoal: number;
  carbGoal: number;
  fatGoal: number;
  notificationsEnabled: boolean;
  reminderTimes: { water: string[]; meals: string[]; training: string[] };
  reducedMotion: boolean;
}

// carbGoal/fatGoal/calorieGoal/proteinGoal são médias de referência das opções
// em src/data/diet.ts — estimativas de acompanhamento, não prescrição clínica.
export const DEFAULT_SETTINGS: Settings = {
  name: 'Sabrina',
  age: 48,
  heightCm: 160,
  currentWeightKg: 75,
  goalWeightKg: 65,
  bariatricSurgeryDate: '',
  mounjaro: { startDate: '2025-08-01', endDatePlanned: '2026-02-01', resumedDate: '' },
  turkeyTripDate: '2026-12-12',
  waterGoalMl: 1500,
  calorieGoal: 1100,
  proteinGoal: 89,
  carbGoal: 90,
  fatGoal: 40,
  notificationsEnabled: false,
  reminderTimes: {
    water: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'],
    meals: ['08:00', '13:00', '19:00'],
    training: ['17:30']
  },
  reducedMotion: false
};
