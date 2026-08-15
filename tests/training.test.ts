import { describe, it, expect } from 'vitest';
import { TRAINING_WEEK, getTrainingDay } from '../src/data/training';
import { EXERCISES } from '../src/data/exercises';

describe('training data integrity', () => {
  it('has exactly 7 days, one per weekday', () => {
    expect(TRAINING_WEEK).toHaveLength(7);
    expect(new Set(TRAINING_WEEK.map((d) => d.weekday)).size).toBe(7);
  });

  it('every day has both a standard and a gentle version with at least one exercise', () => {
    for (const day of TRAINING_WEEK) {
      expect(day.standard.exercises.length).toBeGreaterThan(0);
      expect(day.gentle.exercises.length).toBeGreaterThan(0);
    }
  });

  it('every exerciseId referenced by a workout exists in the EXERCISES catalog', () => {
    for (const day of TRAINING_WEEK) {
      for (const workout of [day.standard, day.gentle]) {
        for (const we of workout.exercises) {
          expect(EXERCISES[we.exerciseId], `${we.exerciseId} referenced by ${workout.id} is missing from EXERCISES`).toBeDefined();
        }
      }
    }
  });

  it('workout ids are unique across the whole week', () => {
    const ids = TRAINING_WEEK.flatMap((d) => [d.standard.id, d.gentle.id]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gentle versions never include exercises with moderate core intensity', () => {
    for (const day of TRAINING_WEEK) {
      for (const we of day.gentle.exercises) {
        const ex = EXERCISES[we.exerciseId];
        expect(ex.coreIntensity, `${ex.name} in ${day.gentle.id} has core intensity too high for a recovery day`).not.toBe('moderada');
      }
    }
  });

  it('getTrainingDay looks up the right day by weekday key', () => {
    expect(getTrainingDay('qua').label).toBe('Quarta-feira');
    expect(getTrainingDay('dom').label).toBe('Domingo');
  });
});
