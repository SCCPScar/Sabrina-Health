import { describe, it, expect, beforeEach } from 'vitest';
import { reconcile } from '../src/lib/sync';
import { rawSet, getWeights, deleteWeight, addWeight } from '../src/lib/storage';
import { markTouched, touchedAt } from '../src/lib/meta';
import type { WeightEntry } from '../src/lib/types';

// These exercise sync.ts's reconcile() directly against seeded localStorage,
// simulating what happens when this device processes one row pulled from
// Supabase — the exact decision tree fullSync() drives, without needing a
// live network connection to stand up "two real devices".

beforeEach(() => {
  localStorage.clear();
});

function seedWeights(entries: WeightEntry[], touchedAtTs: number) {
  rawSet('ns_weights', entries);
  markTouched('ns_weights', touchedAtTs);
}

describe('reconcile — delete made while online (no conflict window)', () => {
  it('a delete pushed and then immediately reconciled against its own stale echo stays deleted', () => {
    seedWeights([{ date: '2026-01-01', kg: 75, updatedAt: 100 }], 100);

    deleteWeight(0);
    expect(getWeights()).toHaveLength(0);
    const deletedTs = touchedAt('ns_weights') as number;
    expect(deletedTs).toBeGreaterThan(100);

    const result = reconcile('ns_weights', [{ date: '2026-01-01', kg: 75, updatedAt: 100 }], 100, 100);

    expect(result.applied).toBe(false);
    expect(getWeights()).toHaveLength(0);
  });
});

describe('reconcile — delete offline, reconnect later', () => {
  it('does not resurrect the entry when the remote pull still has the old, unchanged copy', () => {
    seedWeights([{ date: '2026-01-01', kg: 75, updatedAt: 100 }], 100);

    markTouched('ns_weights', 200);
    const raw = JSON.parse(localStorage.getItem('ns_weights') as string) as WeightEntry[];
    raw[0] = { ...raw[0], deleted: true, updatedAt: 200 };
    rawSet('ns_weights', raw);

    const result = reconcile('ns_weights', [{ date: '2026-01-01', kg: 75, updatedAt: 100 }], 100, 100);

    expect(result.applied).toBe(false);
    expect(getWeights()).toHaveLength(0);
  });

  it('a second device that never touched the key cleanly adopts the propagated delete', () => {
    seedWeights([{ date: '2026-01-01', kg: 75, updatedAt: 100 }], 100);

    const result = reconcile('ns_weights', [{ date: '2026-01-01', kg: 75, updatedAt: 100, deleted: true }], 200, 100);

    expect(result.applied).toBe(true);
    rawSet('ns_weights', result.value as WeightEntry[]);
    expect(getWeights()).toHaveLength(0);
  });
});

describe('reconcile — concurrent conflict (both sides changed since last sync)', () => {
  it('a delete on one device survives a merge against an unrelated concurrent addition on the other', () => {
    seedWeights([{ date: '2026-01-01', kg: 75, updatedAt: 100 }], 100);

    const raw = JSON.parse(localStorage.getItem('ns_weights') as string) as WeightEntry[];
    raw[0] = { ...raw[0], deleted: true, updatedAt: 200 };
    rawSet('ns_weights', raw);
    markTouched('ns_weights', 200);

    const remoteRow: WeightEntry[] = [
      { date: '2026-01-01', kg: 75, updatedAt: 100 },
      { date: '2026-01-08', kg: 74.2, updatedAt: 250 }
    ];

    const result = reconcile('ns_weights', remoteRow, 250, 100);

    expect(result.isMerge).toBe(true);
    const merged = result.value as WeightEntry[];
    const jan1 = merged.find((e) => e.date === '2026-01-01');
    const jan8 = merged.find((e) => e.date === '2026-01-08');
    expect(jan1?.deleted).toBe(true);
    expect(jan8).toBeDefined();
  });

  it('a normal (non-delete) concurrent edit still merges as an additive union', () => {
    seedWeights([{ date: '2026-01-01', kg: 75, updatedAt: 100 }], 100);
    addWeight(74.8, '2026-01-10');

    const remoteRow: WeightEntry[] = [
      { date: '2026-01-01', kg: 75, updatedAt: 100 },
      { date: '2026-01-12', kg: 74.5, updatedAt: 300 }
    ];

    const result = reconcile('ns_weights', remoteRow, 300, 100);
    expect(result.isMerge).toBe(true);
    const merged = result.value as WeightEntry[];
    expect(merged.map((e) => e.date).sort()).toEqual(['2026-01-01', '2026-01-10', '2026-01-12']);
  });
});

describe('reconcile — first pull onto a brand new device', () => {
  it('adopts remote data wholesale when the device has nothing local yet', () => {
    const result = reconcile('ns_weights', [{ date: '2026-01-01', kg: 75, updatedAt: 100 }], 100, 0);
    expect(result.applied).toBe(true);
    expect(result.isMerge).toBe(false);
  });
});
