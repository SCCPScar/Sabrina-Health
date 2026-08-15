import type { Tab } from '../nav';
import { TRAINING_WEEK } from '../../data/training';
import { EXERCISES } from '../../data/exercises';
import type { Workout, TrainingDay } from '../../data/types-training';
import { getDay, toggleExercise, setTrainingDone, getSettings } from '../../lib/storage';
import { todayISO, daysUntil } from '../../lib/dates';
import { refreshActive } from '../nav';
import { openTimerModal } from '../components/timer';
import { openExerciseModal } from '../components/exerciseModal';
import { showToast } from '../components/toast';

type Mode = 'standard' | 'gentle';

const expanded = new Set<string>();
const modeByDay: Record<string, Mode> = {};

function dayMode(weekday: string): Mode {
  return modeByDay[weekday] ?? 'standard';
}

const PILL_COLORS: Record<string, string> = {
  seg: '#e2879c', ter: '#8fa8c7', qua: '#d9a65c', qui: '#c96c82', sex: '#8fa8c7', sab: '#e2879c', dom: '#8fb996'
};

export const trainingTab: Tab = {
  id: 'treino',
  label: 'Treino',
  icon: '🏠',
  render(root: HTMLElement) {
    const date = todayISO();
    const settings = getSettings();
    const tripDays = daysUntil(settings.turkeyTripDate);
    // Wrapped in a freshly-created child (rather than delegating straight on
    // `root`) because `root` itself is a persistent container reused across
    // renders — only its children are replaced each time. A listener
    // attached directly to `root` would never get cleaned up and would
    // stack on every re-render (every toggle/expand/complete action calls
    // refreshActive()), firing a single tap N times after N renders.
    root.innerHTML = `
      <div id="treino-content">
        <div class="ph">
          <h2>Treino</h2>
          <div class="ph-title">Só em casa</div>
          <div class="ph-sub">Toca no dia para abrir · ⏱ = descanso · ℹ️ = como fazer</div>
        </div>
        <div class="alert"><span>🏠</span><span>Sem ginásio, sem pressa — elástico, halteres leves, cadeira e o teu próprio corpo chegam perfeitamente.</span></div>
        ${
          tripDays <= 45 && tripDays >= -60
            ? `<div class="recovery-banner"><span>🌸</span><span>A viagem para a Turquia está a chegar (ou já passou). Sente-te à vontade para trocar qualquer dia para a versão <strong>Suave / Recuperação</strong> — nada aqui é obrigatório.</span></div>`
            : ''
        }
        <div id="week-days"></div>
      </div>
    `;

    renderWeek(root, date);
    wireEvents(root.querySelector('#treino-content') as HTMLElement, date);
  }
};

function renderWeek(root: HTMLElement, date: string) {
  const el = root.querySelector('#week-days') as HTMLElement;
  el.innerHTML = TRAINING_WEEK.map((day) => dayCardHTML(day, date)).join('');
}

function dayCardHTML(day: TrainingDay, date: string): string {
  const isOpen = expanded.has(day.weekday);
  const mode = dayMode(day.weekday);
  const workout = day[mode];
  const marker = getDay(date).trainingDone;
  const isTodayDone = marker?.workoutId === workout.id && marker.done;
  return `
    <div class="day-card ${isOpen ? 'open' : ''}" data-day="${day.weekday}">
      <div class="day-head" data-toggle="${day.weekday}">
        <div class="day-pill" style="background:${PILL_COLORS[day.weekday]}">${day.weekday.toUpperCase()}</div>
        <div class="day-info">
          <div class="day-nm">${day.label}${isTodayDone ? ' ✅' : ''}</div>
          <div class="day-focus">${workout.focus}</div>
        </div>
        <div class="icon-btn">${isOpen ? '−' : '+'}</div>
      </div>
      <div class="day-body">
        <div class="modality-switch">
          <button class="modality-btn ${mode === 'standard' ? 'active' : ''}" data-set-mode="${day.weekday}:standard">Normal</button>
          <button class="modality-btn ${mode === 'gentle' ? 'active' : ''}" data-set-mode="${day.weekday}:gentle">🌸 Suave</button>
        </div>
        ${exerciseListHTML(workout, date)}
        <div class="sub-row" style="justify-content:flex-end">
          <button class="btn sm ${isTodayDone ? 'ghost' : ''}" data-complete="${day.weekday}:${workout.id}">
            ${isTodayDone ? '✓ Treino concluído hoje' : 'Marcar como treino de hoje'}
          </button>
        </div>
      </div>
    </div>
  `;
}

function exerciseListHTML(workout: Workout, date: string): string {
  const doneList = getDay(date).exercisesDone[workout.id] ?? [];
  return workout.exercises
    .map((we) => {
      const ex = EXERCISES[we.exerciseId];
      if (!ex) return '';
      const isDone = doneList.includes(we.exerciseId);
      return `
      <div class="ex-row ${isDone ? 'done' : ''}" data-exercise="${we.exerciseId}">
        <div class="ex-main" data-select="${workout.id}:${we.exerciseId}">
          <strong>${ex.name}</strong>
          <small>${we.sets}x ${we.reps} · descanso ${we.restSeconds}s${we.note ? ' · ' + we.note : ''}</small>
        </div>
        <div class="ex-actions">
          <button class="icon-btn" data-info="${we.exerciseId}" title="Como executar">ℹ️</button>
          ${we.restSeconds > 0 ? `<button class="icon-btn" data-timer="${we.restSeconds}" title="Temporizador">⏱</button>` : ''}
        </div>
      </div>`;
    })
    .join('');
}

function wireEvents(root: HTMLElement, date: string) {
  root.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;

    const toggle = target.closest<HTMLElement>('[data-toggle]');
    if (toggle) {
      const key = toggle.dataset.toggle as string;
      if (expanded.has(key)) expanded.delete(key);
      else expanded.add(key);
      refreshActive();
      return;
    }

    const modeBtn = target.closest<HTMLElement>('[data-set-mode]');
    if (modeBtn) {
      const [weekday, mode] = (modeBtn.dataset.setMode as string).split(':');
      modeByDay[weekday] = mode as Mode;
      expanded.add(weekday);
      refreshActive();
      return;
    }

    const infoBtn = target.closest<HTMLElement>('[data-info]');
    if (infoBtn) {
      const ex = EXERCISES[infoBtn.dataset.info as string];
      if (ex) openExerciseModal(ex);
      return;
    }

    const timerBtn = target.closest<HTMLElement>('[data-timer]');
    if (timerBtn) {
      openTimerModal(Number(timerBtn.dataset.timer));
      return;
    }

    const selectArea = target.closest<HTMLElement>('[data-select]');
    if (selectArea) {
      const [workoutId, exerciseId] = (selectArea.dataset.select as string).split(':');
      toggleExercise(date, workoutId, exerciseId);
      refreshActive();
      return;
    }

    const completeBtn = target.closest<HTMLElement>('[data-complete]');
    if (completeBtn) {
      const [, workoutId] = (completeBtn.dataset.complete as string).split(':');
      const marker = getDay(date).trainingDone;
      const alreadyDone = marker?.workoutId === workoutId && marker.done;
      setTrainingDone(date, workoutId, !alreadyDone);
      if (!alreadyDone) showToast('Treino de hoje registado! 💪');
      refreshActive();
    }
  });
}
