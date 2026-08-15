import type { Tab } from '../nav';
import { PLANNED_SURGERIES } from '../../data/surgery';
import { getDressings, addDressing, toggleDressing, deleteDressing, getSettings } from '../../lib/storage';
import { todayISO, daysUntil, formatShort } from '../../lib/dates';
import { refreshActive } from '../nav';
import { showToast } from '../components/toast';

export const surgeryTab: Tab = {
  id: 'cirurgia',
  label: 'Cirurgia',
  icon: '🩹',
  render(root: HTMLElement) {
    const date = todayISO();
    const settings = getSettings();
    const dressings = getDressings(date);
    const tripDays = daysUntil(settings.turkeyTripDate);

    root.innerHTML = `
      <div class="ph">
        <h2>Cirurgia &amp; Recuperação</h2>
        <div class="ph-title">Turquia, dezembro</div>
        <div class="ph-sub">${formatShort(settings.turkeyTripDate)} — ${tripDays >= 0 ? `faltam ${tripDays} dias` : 'já passou'}</div>
      </div>

      <div class="recovery-banner"><span>🌸</span><span>Esta aba é só para referência e organização — sem indicações clínicas. Fala sempre com a tua equipa médica para qualquer dúvida sobre cuidados pós-operatórios.</span></div>

      <section>
        <div class="sec-title">✨ Cirurgias previstas</div>
        <div id="surgery-list"></div>
      </section>

      <section>
        <div class="sec-title">🩹 Curativos de hoje</div>
        <div id="dressing-list"></div>
        <div class="form-row">
          <input class="finp" id="d-time" type="time" style="max-width:110px" value="09:00" />
          <input class="finp" id="d-label" type="text" placeholder="Ex: trocar penso abdominal" />
        </div>
        <div class="form-row" style="padding-top:0">
          <button class="btn block" id="d-add">+ Adicionar curativo</button>
        </div>
        <div style="padding:0 16px 12px;font-size:11px;color:var(--text-faint)">Regista aqui os horários dos curativos do dia e marca quando estiverem feitos.</div>
      </section>
    `;

    renderSurgeries(root);
    renderDressings(root, dressings);
    wireEvents(root, date);
  }
};

function renderSurgeries(root: HTMLElement) {
  const el = root.querySelector('#surgery-list') as HTMLElement;
  el.innerHTML = PLANNED_SURGERIES.map(
    (s) => `
    <div class="surgery-card">
      <div class="surgery-ic">${s.emoji}</div>
      <div class="surgery-txt"><strong>${s.name}</strong><small>${s.desc}</small></div>
    </div>`
  ).join('');
}

function renderDressings(root: HTMLElement, dressings: ReturnType<typeof getDressings>) {
  const el = root.querySelector('#dressing-list') as HTMLElement;
  if (!dressings.length) {
    el.innerHTML = '<div class="empty">Sem curativos agendados para hoje 🌸</div>';
    return;
  }
  el.innerHTML = dressings
    .map(
      (d) => `
    <div class="dressing-row">
      <div class="dressing-time">${d.time}</div>
      <div class="rtxt" style="flex:1"><strong style="${d.done ? 'text-decoration:line-through;color:var(--text-faint)' : ''}">${d.label}</strong></div>
      <label class="switch"><input type="checkbox" data-toggle-dressing="${d.id}" ${d.done ? 'checked' : ''}/><span class="slider"></span></label>
      <button class="log-del" data-del-dressing="${d.id}">✕</button>
    </div>`
    )
    .join('');
}

function wireEvents(root: HTMLElement, date: string) {
  root.querySelector('#d-add')?.addEventListener('click', () => {
    const time = (root.querySelector('#d-time') as HTMLInputElement).value || '09:00';
    const label = (root.querySelector('#d-label') as HTMLInputElement).value.trim();
    if (!label) return;
    addDressing(date, time, label);
    (root.querySelector('#d-label') as HTMLInputElement).value = '';
    showToast('Curativo adicionado 🩹');
    refreshActive();
  });

  root.querySelector('#dressing-list')?.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const del = target.closest<HTMLElement>('[data-del-dressing]');
    if (del) {
      deleteDressing(date, del.dataset.delDressing as string);
      refreshActive();
      return;
    }
    const toggle = target.closest<HTMLElement>('[data-toggle-dressing]');
    if (toggle) {
      toggleDressing(date, toggle.dataset.toggleDressing as string);
      refreshActive();
    }
  });
}
