import type { Tab } from '../nav';
import { todayISO, formatLong, greeting, daysUntil, WEEKDAY_KEYS } from '../../lib/dates';
import { getTrainingDay } from '../../data/training';
import { EXERCISES } from '../../data/exercises';
import { MEALS } from '../../data/diet';
import {
  getDay,
  toggleMeal,
  getWater,
  setWater,
  toggleExercise,
  setTrainingDone,
  getSettings
} from '../../lib/storage';
import { refreshActive, switchTab } from '../nav';
import { openTimerModal } from '../components/timer';
import { openExerciseModal } from '../components/exerciseModal';
import { showToast } from '../components/toast';

let trainingMode: 'standard' | 'gentle' = 'standard';

function computeProgress(date: string): { done: number; total: number } {
  const day = getDay(date);
  const settings = getSettings();
  const glassGoal = Math.max(1, Math.round(settings.waterGoalMl / 250));
  let done = 0;
  let total = 0;

  total += MEALS.length;
  done += MEALS.filter((m) => m.options.some((o) => day.meals[o.id])).length;

  total += 1;
  if (day.water >= glassGoal) done += 1;

  total += 1;
  if (day.trainingDone?.done) done += 1;

  return { done, total };
}

export const todayTab: Tab = {
  id: 'hoje',
  label: 'Hoje',
  icon: '☀️',
  render(root: HTMLElement) {
    const date = todayISO();
    const settings = getSettings();
    const day = getDay(date);
    const now = new Date();
    const weekdayKey = WEEKDAY_KEYS[now.getDay()] as ReturnType<typeof getTrainingDay>['weekday'];
    const trainingDay = getTrainingDay(weekdayKey);
    const workout = trainingDay[trainingMode];

    const { done, total } = computeProgress(date);
    const pct = total ? Math.round((done / total) * 100) : 0;
    const RING_C = 2 * Math.PI * 32;
    const offset = RING_C - (pct / 100) * RING_C;

    const glassGoal = Math.max(1, Math.round(settings.waterGoalMl / 250));
    const mlEach = Math.round(settings.waterGoalMl / glassGoal);

    const tripDays = daysUntil(settings.turkeyTripDate);
    const mounjaroActive = isMounjaroActive(settings);

    root.innerHTML = `
      <div class="ph">
        <h2>${greeting(now)}, ${settings.name}</h2>
        <div class="ph-title">Hoje</div>
        <div class="ph-sub">${formatLong(now)}</div>
      </div>

      ${tripCardHTML(tripDays)}
      ${mounjaroActive ? `<div class="alert"><span>💉</span><span>Mounjaro ativo — lembra-te de manter as proteínas e a água em dia.</span></div>` : ''}

      <div class="hero">
        <div class="hero-row">
          <div class="ring-wrap">
            <svg width="72" height="72" viewBox="0 0 72 72">
              <defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#e2879c"/><stop offset="1" stop-color="#8fa8c7"/>
              </linearGradient></defs>
              <circle class="ring-bg" cx="36" cy="36" r="32"/>
              <circle class="ring-fg" cx="36" cy="36" r="32" stroke-dasharray="${RING_C}" stroke-dashoffset="${offset}"/>
            </svg>
            <div class="ring-pct">${pct}%</div>
          </div>
          <div class="hero-txt">
            <strong>Progresso do dia</strong>
            <span>${done} de ${total} coisinhas feitas</span>
            <span>Vai ao teu ritmo — o que importa é a consistência 🌸</span>
          </div>
        </div>
      </div>

      <div class="wcard">
        <div class="wcard-top">
          <div class="wcard-lbl">💧 Água de hoje</div>
          <div class="wcard-ml" id="wml">${day.water * mlEach} / ${settings.waterGoalMl} ml</div>
        </div>
        <div class="glasses" id="glasses"></div>
        <div class="wbar"><div class="wbar-fill" style="width:${Math.min(100, (day.water / glassGoal) * 100)}%"></div></div>
        <div class="wbtns">
          <button class="wbtn" id="water-minus">− Copo</button>
          <button class="wbtn" id="water-plus">+ Copo</button>
        </div>
      </div>

      <section id="training-card">
        <div class="sec-title">
          <span>🏠 Treino de hoje — ${trainingDay.label}</span>
          <span class="pill">${workout.focus}</span>
        </div>
        <div class="modality-switch">
          <button class="modality-btn ${trainingMode === 'standard' ? 'active' : ''}" data-mode="standard">Normal</button>
          <button class="modality-btn ${trainingMode === 'gentle' ? 'active' : ''}" data-mode="gentle">🌸 Suave / Recuperação</button>
        </div>
        <div id="today-exercises"></div>
        <div class="sub-row" style="justify-content:space-between">
          <label style="display:flex;align-items:center;gap:8px;margin:0;text-transform:none;font-size:12.5px;color:var(--text-dim)">
            <span class="switch"><input type="checkbox" id="training-done" ${day.trainingDone?.done ? 'checked' : ''}/><span class="slider"></span></span>
            Marcar treino de hoje como feito
          </label>
        </div>
      </section>

      <section id="meals-card"></section>
    `;

    renderGlasses(root, day.water, glassGoal);
    renderExercises(root, workout, date);
    renderMeals(root, date, day);
    wireEvents(root, date, glassGoal, workout, weekdayKey);
  }
};

function tripCardHTML(days: number): string {
  const label = days > 1 ? `Faltam ${days} dias` : days === 1 ? 'Falta 1 dia' : days === 0 ? 'É hoje!' : 'Já foi';
  const sub = days >= 0 ? 'até à viagem para a Turquia ✈️' : 'desde a viagem para a Turquia';
  return `
    <div class="trip-card">
      <div class="trip-top">
        <div>
          <div class="trip-lbl">Turquia · 12/12</div>
          <div class="trip-days">${label}</div>
        </div>
        <div style="font-size:34px">✈️</div>
      </div>
      <div class="trip-sub">${sub}</div>
    </div>`;
}

function isMounjaroActive(settings: ReturnType<typeof getSettings>): boolean {
  const today = todayISO();
  const m = settings.mounjaro;
  if (m.resumedDate && m.resumedDate <= today) return true;
  return Boolean(m.startDate) && m.startDate <= today && (!m.endDatePlanned || today <= m.endDatePlanned);
}

function renderGlasses(root: HTMLElement, water: number, goal: number) {
  const el = root.querySelector('#glasses') as HTMLElement;
  let html = '';
  for (let i = 0; i < goal; i++) {
    html += `<div class="glass ${i < water ? 'full' : ''}" data-glass="${i}"></div>`;
  }
  el.innerHTML = html;
}

function renderExercises(root: HTMLElement, workout: ReturnType<typeof getTrainingDay>['standard'], date: string) {
  const el = root.querySelector('#today-exercises') as HTMLElement;
  const doneList = getDay(date).exercisesDone[workout.id] ?? [];
  el.innerHTML = workout.exercises
    .map((we) => {
      const ex = EXERCISES[we.exerciseId];
      if (!ex) return '';
      const isDone = doneList.includes(we.exerciseId);
      return `
      <div class="ex-row ${isDone ? 'done' : ''}" data-exercise="${we.exerciseId}">
        <div class="ex-main" data-select="${we.exerciseId}">
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

function renderMeals(root: HTMLElement, date: string, day: ReturnType<typeof getDay>) {
  const el = root.querySelector('#meals-card') as HTMLElement;
  el.innerHTML = MEALS.map((meal) => {
    const totalKcal = meal.options.reduce((s, o) => (day.meals[o.id] ? s + o.kcal : s), 0);
    const totalP = meal.options.reduce((s, o) => (day.meals[o.id] ? s + o.protein : s), 0);
    return `
    <div style="border-bottom:1px solid var(--border)">
      <div class="sec-title"><span>${meal.name} · ${meal.time}</span><span class="badge-k">~${meal.targetKcal} kcal</span></div>
      ${meal.options
        .map(
          (o) => `
        <div class="row ${day.meals[o.id] ? 'done' : ''}" data-meal="${meal.id}" data-option="${o.id}">
          <div class="chk">✓</div>
          <div class="rtxt"><strong>${o.emoji} ${o.label}</strong><small>${o.desc}</small></div>
        </div>`
        )
        .join('')}
      ${totalKcal > 0 ? `<div class="sub-row"><span class="badge-p">🥩 ${totalP}g prot</span><span class="badge-k">🔥 ${totalKcal} kcal</span></div>` : ''}
    </div>`;
  }).join('');
}

function wireEvents(
  root: HTMLElement,
  date: string,
  glassGoal: number,
  workout: ReturnType<typeof getTrainingDay>['standard'],
  weekdayKey: ReturnType<typeof getTrainingDay>['weekday']
) {
  root.querySelector('#water-plus')?.addEventListener('click', () => {
    const cur = getWater(date);
    if (cur < glassGoal + 4) setWater(date, cur + 1);
    refreshActive();
  });
  root.querySelector('#water-minus')?.addEventListener('click', () => {
    const cur = getWater(date);
    if (cur > 0) setWater(date, cur - 1);
    refreshActive();
  });
  root.querySelector('#glasses')?.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('[data-glass]');
    if (!target) return;
    const idx = Number(target.dataset.glass);
    const cur = getWater(date);
    setWater(date, idx < cur ? idx : idx + 1);
    refreshActive();
  });

  root.querySelectorAll('[data-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      trainingMode = (btn as HTMLElement).dataset.mode as 'standard' | 'gentle';
      refreshActive();
    });
  });

  root.querySelector('#today-exercises')?.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const infoBtn = target.closest<HTMLElement>('[data-info]');
    const timerBtn = target.closest<HTMLElement>('[data-timer]');
    const selectArea = target.closest<HTMLElement>('[data-select]');
    if (infoBtn) {
      const ex = EXERCISES[infoBtn.dataset.info as string];
      if (ex) openExerciseModal(ex);
      return;
    }
    if (timerBtn) {
      openTimerModal(Number(timerBtn.dataset.timer));
      return;
    }
    if (selectArea) {
      toggleExercise(date, workout.id, selectArea.dataset.select as string);
      refreshActive();
    }
  });

  root.querySelector('#training-done')?.addEventListener('change', (e) => {
    const checked = (e.target as HTMLInputElement).checked;
    setTrainingDone(date, workout.id, checked);
    if (checked) showToast('Treino de hoje registado! 💪');
    refreshActive();
  });

  root.querySelector('#meals-card')?.addEventListener('click', (e) => {
    const row = (e.target as HTMLElement).closest<HTMLElement>('[data-meal]');
    if (!row) return;
    toggleMeal(date, row.dataset.option as string);
    refreshActive();
  });

  void weekdayKey;
  // shortcut: tapping the hero opens Progresso for quick weight entry
  root.querySelector('.hero')?.addEventListener('click', () => switchTab('progresso'));
}
