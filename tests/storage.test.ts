import { describe, it, expect, beforeEach } from 'vitest';
import {
  rawGet,
  rawSet,
  getDay,
  toggleMeal,
  getWater,
  setWater,
  toggleExercise,
  getExercisesDone,
  setTrainingDone,
  getDressings,
  addDressing,
  toggleDressing,
  deleteDressing,
  getWeights,
  addWeight,
  deleteWeight,
  getMeasurements,
  addMeasurement,
  updateMeasurement,
  deleteMeasurement,
  getNotes,
  addNote,
  getSettings,
  saveSettings,
  exportBackup,
  importBackup,
  allKeys,
  getExerciseLoads,
  logExerciseLoad,
  deleteExerciseLoad
} from '../src/lib/storage';
import { touchedAt } from '../src/lib/meta';

beforeEach(() => {
  localStorage.clear();
});

describe('raw get/set', () => {
  it('round-trips JSON values', () => {
    rawSet('ns_test', { a: 1 });
    expect(rawGet('ns_test', null)).toEqual({ a: 1 });
  });

  it('returns the fallback when nothing stored', () => {
    expect(rawGet('ns_missing', 'fallback')).toBe('fallback');
  });
});

describe('day records', () => {
  it('toggles a meal option on and off', () => {
    const date = '2026-01-01';
    expect(toggleMeal(date, 'pa1')).toBe(true);
    expect(getDay(date).meals.pa1).toBe(true);
    expect(toggleMeal(date, 'pa1')).toBe(false);
    expect(getDay(date).meals.pa1).toBe(false);
  });

  it('tracks water glasses per day independently', () => {
    setWater('2026-01-01', 3);
    setWater('2026-01-02', 5);
    expect(getWater('2026-01-01')).toBe(3);
    expect(getWater('2026-01-02')).toBe(5);
  });

  it('never lets water go negative', () => {
    setWater('2026-01-01', -5);
    expect(getWater('2026-01-01')).toBe(0);
  });

  it('toggles exercises done for a specific workout', () => {
    const date = '2026-01-01';
    expect(toggleExercise(date, 'seg-normal', 'flexao_parede')).toBe(true);
    expect(getExercisesDone(date, 'seg-normal')).toContain('flexao_parede');
    expect(toggleExercise(date, 'seg-normal', 'flexao_parede')).toBe(false);
    expect(getExercisesDone(date, 'seg-normal')).not.toContain('flexao_parede');
  });

  it('records which workout was completed today', () => {
    const date = '2026-01-01';
    setTrainingDone(date, 'seg-normal', true);
    expect(getDay(date).trainingDone).toEqual({ workoutId: 'seg-normal', done: true });
    setTrainingDone(date, 'seg-normal', false);
    expect(getDay(date).trainingDone).toBeNull();
  });
});

describe('curativos (dressings)', () => {
  it('adds, toggles and deletes dressing entries for a day, sorted by time', () => {
    const date = '2026-01-01';
    addDressing(date, '20:00', 'Curativo da noite');
    addDressing(date, '09:00', 'Curativo da manhã');
    const list = getDressings(date);
    expect(list.map((d) => d.time)).toEqual(['09:00', '20:00']);

    const id = list[0].id;
    toggleDressing(date, id);
    expect(getDressings(date).find((d) => d.id === id)?.done).toBe(true);

    deleteDressing(date, id);
    expect(getDressings(date)).toHaveLength(1);
  });

  it('keeps dressings isolated per day', () => {
    addDressing('2026-01-01', '09:00', 'Dia 1');
    addDressing('2026-01-02', '09:00', 'Dia 2');
    expect(getDressings('2026-01-01')).toHaveLength(1);
    expect(getDressings('2026-01-02')).toHaveLength(1);
  });
});

describe('weights', () => {
  it('adds newest weight first and deletes by (visible) index', () => {
    addWeight(75, '2026-01-01');
    addWeight(74.5, '2026-01-02');
    expect(getWeights().map((w) => w.kg)).toEqual([74.5, 75]);
    deleteWeight(0);
    expect(getWeights().map((w) => w.kg)).toEqual([75]);
  });

  it('soft-deletes (tombstones) instead of physically removing the entry, for sync safety', () => {
    addWeight(75, '2026-01-01');
    deleteWeight(0);
    expect(getWeights()).toHaveLength(0);
    const raw = rawGet<{ kg: number; deleted?: boolean; updatedAt?: number }[]>('ns_weights', []);
    expect(raw).toHaveLength(1);
    expect(raw[0].deleted).toBe(true);
    expect(raw[0].updatedAt).toBeDefined();
  });
});

describe('measurements & notes', () => {
  it('stores measurement entries, including a custom extra measurement', () => {
    addMeasurement({ date: '2026-01-01', waist: 90, hip: 108, extra: { peito: 92 } });
    expect(getMeasurements()).toHaveLength(1);
    expect(getMeasurements()[0].waist).toBe(90);
    expect(getMeasurements()[0].extra).toEqual({ peito: 92 });
  });

  it('edits a measurement in place (as far as the UI is concerned) without creating a duplicate', () => {
    addMeasurement({ date: '2026-01-01', waist: 90, hip: 108 });
    updateMeasurement(0, { date: '2026-01-01', waist: 88, hip: 106 });
    const list = getMeasurements();
    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({ waist: 88, hip: 106 });
  });

  it('deletes measurement entries', () => {
    addMeasurement({ date: '2026-01-01', waist: 90 });
    deleteMeasurement(0);
    expect(getMeasurements()).toHaveLength(0);
  });

  it('stores notes newest first', () => {
    addNote('primeiro dia', '2026-01-01');
    addNote('segundo dia', '2026-01-02');
    expect(getNotes().map((n) => n.text)).toEqual(['segundo dia', 'primeiro dia']);
  });
});

describe('settings', () => {
  it('falls back to defaults and merges patches, including nested objects', () => {
    expect(getSettings().waterGoalMl).toBe(1500);
    saveSettings({ waterGoalMl: 1800 });
    expect(getSettings().waterGoalMl).toBe(1800);
    expect(getSettings().goalWeightKg).toBe(65); // untouched default preserved

    saveSettings({ mounjaro: { startDate: '2025-08-01', endDatePlanned: '2026-02-01', resumedDate: '2026-04-01' } });
    expect(getSettings().mounjaro.resumedDate).toBe('2026-04-01');
  });
});

describe('backup export/import', () => {
  it('round-trips every category of data the app persists, with no duplication (EXPORT -> CLEAR -> IMPORT)', () => {
    addWeight(75, '2026-01-01');
    addMeasurement({ date: '2026-01-01', waist: 90 });
    setTrainingDone('2026-01-01', 'seg-normal', true);
    toggleExercise('2026-01-01', 'seg-normal', 'flexao_parede');
    logExerciseLoad('flexao_parede', { date: '2026-01-01', reps: 10 });
    toggleMeal('2026-01-01', 'pa1');
    setWater('2026-01-01', 5);
    addDressing('2026-01-01', '09:00', 'Curativo abdominal');
    addNote('Dia bom', '2026-01-01');
    saveSettings({ waterGoalMl: 1800 });

    const backup = exportBackup();
    localStorage.clear();
    expect(getWeights()).toHaveLength(0);

    importBackup(backup);

    expect(getWeights()).toHaveLength(1);
    expect(getMeasurements()).toHaveLength(1);
    const day = getDay('2026-01-01');
    expect(day.trainingDone).toEqual({ workoutId: 'seg-normal', done: true });
    expect(day.exercisesDone['seg-normal']).toEqual(['flexao_parede']);
    expect(day.meals.pa1).toBe(true);
    expect(day.water).toBe(5);
    expect(day.dressings).toHaveLength(1);
    expect(getExerciseLoads('flexao_parede')).toHaveLength(1);
    expect(getNotes()).toHaveLength(1);
    expect(getSettings().waterGoalMl).toBe(1800);

    // Importing the same backup again must not duplicate anything.
    importBackup(backup);
    expect(getWeights()).toHaveLength(1);
    expect(getNotes()).toHaveLength(1);
  });

  it('rejects a malformed backup instead of silently wiping data', () => {
    addWeight(75, '2026-01-01');
    // @ts-expect-error intentionally malformed input
    expect(() => importBackup({ notABackup: true })).toThrow();
    expect(getWeights()).toHaveLength(1);
  });

  it('never includes internal sync bookkeeping keys in a backup', () => {
    addWeight(75, '2026-01-01');
    const backup = exportBackup();
    expect(Object.keys(backup.data)).not.toContain('ns_meta');
    expect(Object.keys(backup.data)).not.toContain('ns_last_synced_at');
  });
});

describe('allKeys', () => {
  it('excludes internal bookkeeping keys from the syncable/exportable key set', () => {
    addWeight(75, '2026-01-01');
    rawSet('ns_last_synced_at', Date.now());
    expect(allKeys()).toContain('ns_weights');
    expect(allKeys()).not.toContain('ns_meta');
    expect(allKeys()).not.toContain('ns_last_synced_at');
  });
});

describe('exercise load tracking', () => {
  it('logs and lists loads newest first, and deletes by index', () => {
    logExerciseLoad('chair_squat', { date: '2026-01-01', reps: 10 });
    logExerciseLoad('chair_squat', { date: '2026-01-08', reps: 12 });
    expect(getExerciseLoads('chair_squat').map((l) => l.reps)).toEqual([12, 10]);

    deleteExerciseLoad('chair_squat', 0);
    expect(getExerciseLoads('chair_squat').map((l) => l.reps)).toEqual([10]);
  });

  it('supports duration and variation notes for exercises without reps', () => {
    logExerciseLoad('wall_sit', { date: '2026-01-01', seconds: 20, note: 'mais alto' });
    logExerciseLoad('wall_sit', { date: '2026-01-08', seconds: 30, note: 'completo' });
    const loads = getExerciseLoads('wall_sit');
    expect(loads[0]).toMatchObject({ seconds: 30, note: 'completo' });
    expect(loads[1]).toMatchObject({ seconds: 20, note: 'mais alto' });
  });

  it('allows week-over-week comparison — latest vs previous entry are both retrievable in order', () => {
    logExerciseLoad('chair_squat', { date: '2026-01-01', reps: 10 });
    logExerciseLoad('chair_squat', { date: '2026-01-08', reps: 13 });
    const [latest, previous] = getExerciseLoads('chair_squat');
    expect(latest.reps).toBe(13);
    expect(previous.reps).toBe(10);
    expect((latest.reps ?? 0) - (previous.reps ?? 0)).toBe(3);
  });
});

describe('change tracking (meta)', () => {
  it('records a touched timestamp on every write, used by the sync layer', () => {
    const before = Date.now();
    addWeight(75, '2026-01-01');
    const ts = touchedAt('ns_weights');
    expect(ts).toBeDefined();
    expect(ts as number).toBeGreaterThanOrEqual(before);
  });
});
