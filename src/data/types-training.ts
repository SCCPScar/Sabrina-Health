export type Equipment = 'peso do corpo' | 'elástico' | 'halteres leves' | 'cadeira' | 'parede';

/** Quanto o exercício exige do core/abdominal — usado para saber o que evitar perto das cirurgias. */
export type CoreIntensity = 'nenhuma' | 'leve' | 'moderada';

export interface Exercise {
  id: string;
  name: string;
  muscles: string[];
  equipment: Equipment;
  coreIntensity: CoreIntensity;
  desc: string;
  tip: string;
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: string; // ex: "10-12", "30s", "8 cada lado"
  restSeconds: number;
  note?: string;
}

export interface Workout {
  id: string;
  title: string;
  focus: string;
  exercises: WorkoutExercise[];
}

/**
 * Cada dia da semana tem sempre duas versões: `standard` (o treino normal em
 * casa) e `gentle` (versão suave de recuperação — mobilidade, respiração,
 * sem carga no core, pensada para as semanas à volta das cirurgias de
 * dezembro). A app deixa a escolha de qual seguir em cada dia à Sabrina.
 */
export interface TrainingDay {
  weekday: 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom';
  label: string;
  standard: Workout;
  gentle: Workout;
}
