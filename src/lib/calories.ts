/** Mifflin-St Jeor, feminino. Usado só como estimativa de referência — não é indicação médica. */
export function estimateTDEE(weightKg: number, heightCm: number, age: number, activityFactor = 1.3): number {
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  return Math.round(bmr * activityFactor);
}

export function dailyTotals(itemsEaten: { kcal: number; protein: number; carbs: number; fat: number }[]) {
  return itemsEaten.reduce(
    (acc, m) => ({
      kcal: acc.kcal + m.kcal,
      protein: acc.protein + m.protein,
      carbs: acc.carbs + m.carbs,
      fat: acc.fat + m.fat
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );
}
