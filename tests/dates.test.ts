import { describe, it, expect } from 'vitest';
import { daysUntil, toISO } from '../src/lib/dates';

describe('daysUntil', () => {
  it('counts whole calendar days to a future date', () => {
    const from = new Date(2026, 7, 15); // 15 agosto 2026
    expect(daysUntil('2026-12-12', from)).toBe(119);
  });

  it('returns 0 for today, ignoring the time of day', () => {
    const from = new Date(2026, 7, 15, 23, 45);
    expect(daysUntil('2026-08-15', from)).toBe(0);
  });

  it('returns a negative number once the date has passed', () => {
    const from = new Date(2026, 11, 20); // 20 dezembro
    expect(daysUntil('2026-12-12', from)).toBe(-8);
  });
});

describe('toISO', () => {
  it('formats a Date as YYYY-MM-DD in local time', () => {
    expect(toISO(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});
