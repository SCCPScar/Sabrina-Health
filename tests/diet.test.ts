import { describe, it, expect } from 'vitest';
import { MEALS } from '../src/data/diet';
import { dailyTotals } from '../src/lib/calories';

describe('diet data integrity', () => {
  it('has the 6 daily meal slots', () => {
    expect(MEALS.map((m) => m.id)).toEqual(['pa', 'lm', 'al', 'lt', 'ja', 'ce']);
  });

  it('every meal has at least 3 substitutable options', () => {
    for (const meal of MEALS) {
      expect(meal.options.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('every option describes a practical portion, never a gram weight', () => {
    for (const meal of MEALS) {
      for (const option of meal.options) {
        expect(option.desc).not.toMatch(/\d+\s*g\b/i);
      }
    }
  });

  it('option ids are unique across the whole plan', () => {
    const ids = MEALS.flatMap((m) => m.options.map((o) => o.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every option has positive, plausible macro values', () => {
    for (const meal of MEALS) {
      for (const option of meal.options) {
        expect(option.kcal).toBeGreaterThan(0);
        expect(option.protein).toBeGreaterThanOrEqual(0);
        expect(option.carbs).toBeGreaterThanOrEqual(0);
        expect(option.fat).toBeGreaterThanOrEqual(0);
      }
    }
  });
});

describe('dailyTotals', () => {
  it('sums kcal/protein/carbs/fat across the eaten options', () => {
    const eaten = [
      { kcal: 230, protein: 19, carbs: 20, fat: 8 },
      { kcal: 110, protein: 9, carbs: 6, fat: 5 }
    ];
    expect(dailyTotals(eaten)).toEqual({ kcal: 340, protein: 28, carbs: 26, fat: 13 });
  });

  it('returns all zeros for an empty day', () => {
    expect(dailyTotals([])).toEqual({ kcal: 0, protein: 0, carbs: 0, fat: 0 });
  });
});
