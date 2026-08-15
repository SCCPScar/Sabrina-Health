import { describe, it, expect } from 'vitest';
import { mergeDayRecords, mergeEntryLists } from '../src/lib/merge';
import type { DayRecord, WeightEntry, DressingEntry } from '../src/lib/types';

function day(partial: Partial<DayRecord>): DayRecord {
  return { meals: {}, water: 0, exercisesDone: {}, trainingDone: null, dressings: [], ...partial };
}

function weight(kg: number, date: string, updatedAt: number, deleted = false): WeightEntry {
  return { kg, date, updatedAt, deleted };
}

function dressing(id: string, time: string, label: string, done: boolean): DressingEntry {
  return { id, time, label, done };
}

describe('mergeDayRecords', () => {
  it('unions checked meals from both sides instead of picking one', () => {
    const local = day({ meals: { pa1: true } });
    const remote = day({ meals: { lm2: true } });
    expect(mergeDayRecords(local, remote).meals).toEqual({ pa1: true, lm2: true });
  });

  it('never lets a merge un-check something either side marked done', () => {
    const local = day({ meals: { pa1: false } }); // explicitly unchecked locally
    const remote = day({ meals: { pa1: true } }); // checked on the other device
    expect(mergeDayRecords(local, remote).meals.pa1).toBe(true);
  });

  it('takes the max water count instead of overwriting', () => {
    const local = day({ water: 2 }); // telemóvel, offline, leitura desatualizada
    const remote = day({ water: 5 }); // PC, já enviou a atualização de água
    expect(mergeDayRecords(local, remote).water).toBe(5);
  });

  it('unions exercisesDone per workout without duplicating', () => {
    const local = day({ exercisesDone: { 'seg-normal': ['flexao_parede'] } });
    const remote = day({ exercisesDone: { 'seg-normal': ['flexao_parede', 'elevacao_lateral_leve'] } });
    const merged = mergeDayRecords(local, remote).exercisesDone['seg-normal'];
    expect(merged.sort()).toEqual(['elevacao_lateral_leve', 'flexao_parede']);
  });

  it('keeps a completed training marker from either side', () => {
    const local = day({ trainingDone: null });
    const remote = day({ trainingDone: { workoutId: 'seg-normal', done: true } });
    expect(mergeDayRecords(local, remote).trainingDone).toEqual({ workoutId: 'seg-normal', done: true });
  });

  it('unions dressing entries by id and never un-does a "feito" mark', () => {
    const local = day({ dressings: [dressing('d1', '09:00', 'Curativo abdominal', true)] });
    const remote = day({ dressings: [dressing('d1', '09:00', 'Curativo abdominal', false), dressing('d2', '20:00', 'Curativo perna', false)] });
    const merged = mergeDayRecords(local, remote).dressings;
    expect(merged).toHaveLength(2);
    expect(merged.find((d) => d.id === 'd1')?.done).toBe(true);
    expect(merged.find((d) => d.id === 'd2')?.done).toBe(false);
  });
});

describe('mergeEntryLists — additive union', () => {
  const keyFn = (e: WeightEntry) => `${e.date}_${e.kg}`;
  const dateFn = (e: WeightEntry) => e.date;

  it('unions entries added independently on each device', () => {
    const local = [weight(74.5, '2026-01-02', 100)];
    const remote = [weight(75, '2026-01-01', 100)];
    const merged = mergeEntryLists(local, remote, keyFn, dateFn);
    expect(merged).toHaveLength(2);
    expect(merged.map((e) => e.kg).sort()).toEqual([74.5, 75]);
  });

  it('deduplicates identical entries instead of doubling them', () => {
    const shared = [weight(75, '2026-01-01', 100)];
    const merged = mergeEntryLists(shared, shared, keyFn, dateFn);
    expect(merged).toHaveLength(1);
  });

  it('sorts the merged result newest-first', () => {
    const local = [weight(75, '2026-01-01', 100)];
    const remote = [weight(74, '2026-01-05', 100)];
    const merged = mergeEntryLists(local, remote, keyFn, dateFn);
    expect(merged.map((e) => e.date)).toEqual(['2026-01-05', '2026-01-01']);
  });
});

describe('mergeEntryLists — tombstoned deletes', () => {
  const keyFn = (e: WeightEntry) => `${e.date}_${e.kg}`;
  const dateFn = (e: WeightEntry) => e.date;

  it('a delete on one device is not resurrected by the other device’s stale copy', () => {
    const localAfterDelete = [weight(75, '2026-01-01', 200, true)];
    const remoteStillHasIt = [weight(75, '2026-01-01', 100, false)];
    const merged = mergeEntryLists(localAfterDelete, remoteStillHasIt, keyFn, dateFn);
    expect(merged).toHaveLength(1);
    expect(merged[0].deleted).toBe(true);
  });

  it('deletion wins regardless of which side is passed as "local" vs "remote" (symmetry)', () => {
    const deleted = [weight(75, '2026-01-01', 200, true)];
    const stale = [weight(75, '2026-01-01', 100, false)];
    expect(mergeEntryLists(deleted, stale, keyFn, dateFn)[0].deleted).toBe(true);
    expect(mergeEntryLists(stale, deleted, keyFn, dateFn)[0].deleted).toBe(true);
  });

  it('a genuinely newer re-add after a delete wins over the older delete', () => {
    const deletedThenReadded = [weight(75, '2026-01-01', 300, false)];
    const staleTombstone = [weight(75, '2026-01-01', 200, true)];
    const merged = mergeEntryLists(deletedThenReadded, staleTombstone, keyFn, dateFn);
    expect(merged[0].deleted).toBeFalsy();
  });

  it('treats entries with no updatedAt (pre-tombstone data) as oldest, never beating a real delete', () => {
    const legacyEntry = [{ date: '2026-01-01', kg: 75 } as WeightEntry];
    const delete1 = [weight(75, '2026-01-01', 200, true)];
    const merged = mergeEntryLists(legacyEntry, delete1, keyFn, dateFn);
    expect(merged[0].deleted).toBe(true);
  });
});
