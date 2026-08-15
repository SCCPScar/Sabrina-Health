import type { Tab } from '../nav';
import { MEALS } from '../../data/diet';
import { SUPPLEMENTS, DIET_NOTES } from '../../data/types-diet';
import { getDay, toggleMeal, addNote } from '../../lib/storage';
import { todayISO } from '../../lib/dates';
import { refreshActive } from '../nav';
import { showToast } from '../components/toast';

export const dietTab: Tab = {
  id: 'alimentacao',
  label: 'Comer',
  icon: '🌾',
  render(root: HTMLElement) {
    const date = todayISO();
    const day = getDay(date);

    root.innerHTML = `
      <div class="ph">
        <h2>Alimentação</h2>
        <div class="ph-title">Sem pesar nada</div>
        <div class="ph-sub">Chávenas, colheres e unidades — escolhe o que te apetecer</div>
      </div>

      <div class="alert"><span>🌾</span><span>Todas as opções de uma refeição são equivalentes entre si — escolhe sempre a que tiveres em casa ou te apetecer mais.</span></div>

      <section id="meals-card"></section>

      <section>
        <div class="sec-title">📝 Nota rápida sobre hoje</div>
        <div class="form-row">
          <input class="finp" id="diet-note" type="text" placeholder="Ex: sem fome hoje, saltei o lanche…" />
          <button class="fsave" id="diet-note-save">Guardar</button>
        </div>
        <div style="padding:0 16px 12px;font-size:11px;color:var(--text-faint)">Fica guardada no teu diário — vê tudo na aba Progresso.</div>
      </section>

      <section>
        <div class="sec-title">💊 Suplementos</div>
        <div id="supp-list"></div>
      </section>

      <section>
        <div class="sec-title">💡 Notas</div>
        <div style="padding:12px 16px;font-size:12.5px;color:var(--text-dim);line-height:1.7">
          ${DIET_NOTES.map((n) => `<div style="margin-bottom:8px">🌸 ${n}</div>`).join('')}
        </div>
      </section>
    `;

    renderMeals(root, date, day);
    renderSupplements(root);
    wireEvents(root, date);
  }
};

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

function renderSupplements(root: HTMLElement) {
  const el = root.querySelector('#supp-list') as HTMLElement;
  el.innerHTML = SUPPLEMENTS.map(
    (s) => `
    <div class="row" style="cursor:default">
      <div class="rtxt"><strong>${s.name}</strong><small>${s.note}</small></div>
    </div>`
  ).join('');
}

function wireEvents(root: HTMLElement, date: string) {
  root.querySelector('#meals-card')?.addEventListener('click', (e) => {
    const row = (e.target as HTMLElement).closest<HTMLElement>('[data-meal]');
    if (!row) return;
    toggleMeal(date, row.dataset.option as string);
    refreshActive();
  });

  root.querySelector('#diet-note-save')?.addEventListener('click', () => {
    const input = root.querySelector('#diet-note') as HTMLInputElement;
    if (!input.value.trim()) return;
    addNote(input.value.trim(), date);
    showToast('Nota guardada 🌸');
    input.value = '';
  });
}
