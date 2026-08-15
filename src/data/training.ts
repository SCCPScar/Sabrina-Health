// Plano de treino semanal da Nova Sabrina — só em casa.
// Cada dia tem uma versão normal (`standard`) e uma versão suave de
// recuperação (`gentle`), sem qualquer trabalho agressivo de core, pensada
// para as semanas antes e depois das cirurgias de dezembro. A escolha de
// qual seguir em cada dia fica sempre com a Sabrina — a app nunca obriga.
import type { TrainingDay, Workout, WorkoutExercise } from './types-training';

function ex(exerciseId: string, sets: number, reps: string, restSeconds: number, note?: string): WorkoutExercise {
  return { exerciseId, sets, reps, restSeconds, note };
}

function workout(id: string, title: string, focus: string, exercises: WorkoutExercise[]): Workout {
  return { id, title, focus, exercises };
}

export const TRAINING_WEEK: TrainingDay[] = [
  {
    weekday: 'seg',
    label: 'Segunda-feira',
    standard: workout('seg-normal', 'Braços e Ombros', 'Braços · Ombros · Postura', [
      ex('flexao_parede', 3, '10-12', 45),
      ex('elevacao_lateral_leve', 3, '12', 40),
      ex('rosca_biceps_elastico', 3, '12', 40),
      ex('extensao_triceps_cadeira', 3, '10', 45),
      ex('wall_angel', 2, '10', 30)
    ]),
    gentle: workout('seg-suave', 'Braços — Versão Suave', 'Mobilidade · Recuperação', [
      ex('shoulder_roll', 2, '10 cada sentido', 20),
      ex('arm_circle_leve', 2, '10 cada sentido', 20),
      ex('alongamento_lateral', 2, '20s cada lado', 15),
      ex('respiracao_diafragmatica', 1, '1-2 min', 0)
    ])
  },
  {
    weekday: 'ter',
    label: 'Terça-feira',
    standard: workout('ter-normal', 'Pernas e Glúteos', 'Quadríceps · Glúteos', [
      ex('chair_squat', 3, '10-12', 50),
      ex('glute_bridge_suave', 3, '12', 45),
      ex('standing_leg_lift', 3, '10 cada lado', 40),
      ex('wall_sit', 3, '20-30s', 45),
      ex('calf_raise_casa', 3, '15', 30)
    ]),
    gentle: workout('ter-suave', 'Pernas — Versão Suave', 'Circulação · Mobilidade', [
      ex('ankle_pump', 2, '15', 15),
      ex('heel_slide', 2, '8 cada perna', 20),
      ex('hip_circle', 2, '6 cada sentido', 20),
      ex('respiracao_diafragmatica', 1, '1-2 min', 0)
    ])
  },
  {
    weekday: 'qua',
    label: 'Quarta-feira',
    standard: workout('qua-normal', 'Core Suave e Equilíbrio', 'Core profundo · Equilíbrio', [
      ex('bird_dog', 3, '8 cada lado', 40),
      ex('dead_bug_suave', 3, '8 cada lado', 40),
      ex('pelvic_tilt', 2, '12', 30),
      ex('seated_march', 3, '20', 30),
      ex('gentle_twist_seated', 2, '10 cada lado', 25)
    ]),
    gentle: workout('qua-suave', 'Core — Versão Muito Suave', 'Ativação leve · Respiração', [
      ex('pelvic_tilt', 2, '10', 30),
      ex('cat_cow', 2, '8', 25),
      ex('ankle_pump', 2, '15', 15),
      ex('respiracao_diafragmatica', 1, '1-2 min', 0)
    ])
  },
  {
    weekday: 'qui',
    label: 'Quinta-feira',
    standard: workout('qui-normal', 'Costas e Postura', 'Costas · Postura', [
      ex('remada_elastico', 3, '12', 45, 'Sem elástico, usa uma toalha esticada'),
      ex('seated_row_elastico', 3, '12', 40),
      ex('superman_leve', 3, '10', 40),
      ex('wall_angel', 2, '10', 30),
      ex('cat_cow', 2, '10', 20)
    ]),
    gentle: workout('qui-suave', 'Costas — Versão Suave', 'Postura · Alívio de tensão', [
      ex('cat_cow', 2, '8', 25),
      ex('shoulder_roll', 2, '10 cada sentido', 20),
      ex('neck_stretch', 2, '15s cada lado', 15),
      ex('respiracao_diafragmatica', 1, '1-2 min', 0)
    ])
  },
  {
    weekday: 'sex',
    label: 'Sexta-feira',
    standard: workout('sex-normal', 'Pernas, Glúteos e Cardio Leve', 'Glúteos · Cardio sem impacto', [
      ex('step_touch', 3, '30s', 30),
      ex('lateral_step_elastico', 3, '10 cada lado', 40),
      ex('step_up_degrau', 3, '10 cada lado', 40),
      ex('glute_bridge_suave', 3, '12', 40),
      ex('marcha_lugar', 2, '1 min', 20)
    ]),
    gentle: workout('sex-suave', 'Pernas — Versão Suave', 'Circulação · Mobilidade', [
      ex('marcha_lugar', 2, '1 min', 20),
      ex('ankle_pump', 2, '15', 15),
      ex('hip_circle', 2, '6 cada sentido', 20),
      ex('alongamento_posterior', 2, '20s cada lado', 15)
    ])
  },
  {
    weekday: 'sab',
    label: 'Sábado',
    standard: workout('sab-normal', 'Corpo Inteiro Suave', 'Full body · Baixo impacto', [
      ex('chair_squat', 3, '10', 45),
      ex('flexao_parede', 3, '10', 40),
      ex('remada_elastico', 3, '12', 40, 'Sem elástico, usa uma toalha esticada'),
      ex('bird_dog', 2, '8 cada lado', 35),
      ex('step_touch', 2, '30s', 25)
    ]),
    gentle: workout('sab-suave', 'Corpo Inteiro — Versão Suave', 'Mobilidade geral', [
      ex('shoulder_roll', 2, '10 cada sentido', 20),
      ex('hip_circle', 2, '6 cada sentido', 20),
      ex('cat_cow', 2, '8', 25),
      ex('respiracao_diafragmatica', 1, '1-2 min', 0)
    ])
  },
  {
    weekday: 'dom',
    label: 'Domingo',
    standard: workout('dom-normal', 'Mobilidade e Alongamento', 'Descanso ativo', [
      ex('cat_cow', 3, '10', 20),
      ex('alongamento_lateral', 2, '20s cada lado', 15),
      ex('alongamento_posterior', 2, '20s cada lado', 15),
      ex('neck_stretch', 2, '15s cada lado', 15),
      ex('respiracao_diafragmatica', 1, '2 min', 0)
    ]),
    gentle: workout('dom-suave', 'Domingo — Só Descanso', 'Respiração e descanso total', [
      ex('respiracao_diafragmatica', 1, '3-5 min', 0),
      ex('ankle_pump', 2, '15', 15),
      ex('neck_stretch', 2, '15s cada lado', 15)
    ])
  }
];

export function getTrainingDay(weekday: TrainingDay['weekday']): TrainingDay {
  return TRAINING_WEEK.find((d) => d.weekday === weekday) ?? TRAINING_WEEK[0];
}
