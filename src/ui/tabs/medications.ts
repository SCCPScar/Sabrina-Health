import type { Tab } from '../nav';
import {
  getMedications,
  addMedication,
  updateMedication,
  deleteMedication,
  toggleMedTaken,
  isMedTaken,
  getSettings,
  saveSettings
} from '../../lib/storage';
import { SUPPLEMENTS } from '../../data/types-diet';
import { todayISO } from '../../lib/dates';
import { requestNotificationPermission } from '../../lib/notifications';
import { refreshActive } from '../nav';
import { showToast } from '../components/toast';

let editingMedId: string | null = null;

function parseTimes(raw: string): string[] {
  const times = raw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
  return [...new Set(times)].sort();
}

export const medicationsTab: Tab = {
  id: 'remedios',
  label: 'Remédios',
  icon: '💊',
  render(root: HTMLElement) {
    const date = todayISO();
    const settings = getSettings();
    const meds = getMedications();
    const editing = editingMedId ? meds.find((m) => m.id === editingMedId) : undefined;

    root.innerHTML = `
      <div class="ph">
        <h2>Remédios</h2>
        <div class="ph-title">Medicação &amp; lembretes</div>
        <div class="ph-sub">Água ao longo do dia e a tua medicação, sem te preocupares em decorar horários</div>
      </div>

      <section>
        <div class="sec-title">🔔 Notificações</div>
        <div class="row" style="cursor:default">
          <div class="rtxt"><strong>Ativar lembretes</strong><small>Água e medicação, enquanto a app estiver aberta</small></div>
          <label class="switch"><input type="checkbox" id="notif-toggle" ${settings.notificationsEnabled ? 'checked' : ''}/><span class="slider"></span></label>
        </div>
        <div class="alert" style="margin:10px 14px">
          <span>🍏</span>
          <span>No iPhone (Safari/PWA), os lembretes só disparam com a app aberta em primeiro plano — o iOS não permite notificações agendadas em segundo plano sem um servidor de push dedicado. Deixa a app aberta em fundo quando quiseres garantir o lembrete.</span>
        </div>
      </section>

      <section>
        <div class="sec-title">💧 Lembretes de água</div>
        <div class="chip-row" id="water-chips"></div>
        <div class="form-row" style="padding-top:0">
          <input class="finp" id="water-time" type="time" style="max-width:130px" value="12:00" />
          <button class="fsave" id="water-add">+ Adicionar horário</button>
        </div>
      </section>

      <section>
        <div class="sec-title">
          <span>💊 Medicação e suplementos</span>
          ${editing ? '<span class="pill">✏️ A editar</span>' : ''}
        </div>
        <div id="med-list"></div>
        <div id="med-suggestions"></div>
        <div class="form-row">
          <input class="finp" id="med-name" type="text" placeholder="Nome (ex: Vitamina B12)" value="${editing?.name ?? ''}" />
        </div>
        <div class="form-row" style="padding-top:0">
          <input class="finp" id="med-note" type="text" placeholder="Dose (ex: 1 comprimido)" value="${editing?.note ?? ''}" />
        </div>
        <div class="form-row" style="padding-top:0">
          <input class="finp" id="med-times" type="text" placeholder="Horários, ex: 08:00, 20:00" value="${editing?.times.join(', ') ?? ''}" />
        </div>
        <div class="form-row" style="padding-top:0">
          <button class="btn block" id="med-save">${editing ? '✓ Guardar alterações' : '+ Adicionar medicação'}</button>
          ${editing ? '<button class="btn ghost" id="med-cancel">Cancelar</button>' : ''}
        </div>
      </section>
    `;

    renderWaterChips(root, settings.reminderTimes.water);
    renderMedList(root, meds, date);
    renderSuggestions(root, meds);
    wireEvents(root, date);
  }
};

function renderWaterChips(root: HTMLElement, times: string[]) {
  const el = root.querySelector('#water-chips') as HTMLElement;
  if (!times.length) {
    el.innerHTML = '<div class="empty" style="padding:8px 0">Sem lembretes de água configurados.</div>';
    return;
  }
  el.innerHTML = [...times]
    .sort()
    .map((t) => `<span class="chip">💧 ${t} <button class="chip-del" data-del-water="${t}">✕</button></span>`)
    .join('');
}

function renderMedList(root: HTMLElement, meds: ReturnType<typeof getMedications>, date: string) {
  const el = root.querySelector('#med-list') as HTMLElement;
  if (!meds.length) {
    el.innerHTML = '<div class="empty">Ainda sem medicação registada 🌸</div>';
    return;
  }
  el.innerHTML = meds
    .map(
      (m) => `
    <div class="med-card">
      <div class="med-head">
        <div style="cursor:pointer;flex:1" data-edit-med="${m.id}">
          <div class="med-name">${m.name}</div>
          ${m.note ? `<div class="med-note">${m.note}</div>` : ''}
        </div>
        <button class="icon-btn" data-del-med="${m.id}" title="Remover">🗑</button>
      </div>
      <div class="med-times">
        ${m.times
          .map((t) => {
            const taken = isMedTaken(date, m.id, t);
            return `<button class="med-time-chk ${taken ? 'taken' : ''}" data-toggle-med="${m.id}::${t}">${taken ? '✓' : ''} ${t}</button>`;
          })
          .join('')}
      </div>
    </div>`
    )
    .join('');
}

function renderSuggestions(root: HTMLElement, meds: ReturnType<typeof getMedications>) {
  const el = root.querySelector('#med-suggestions') as HTMLElement;
  const existingNames = new Set(meds.map((m) => m.name.toLowerCase()));
  const suggestions = SUPPLEMENTS.filter((s) => !existingNames.has(s.name.toLowerCase()));
  if (!suggestions.length) {
    el.innerHTML = '';
    return;
  }
  el.innerHTML = `
    <div style="padding:0 16px 6px;font-size:11px;color:var(--text-faint)">Sugestões comuns pós-bariátrica — toca para preencher o formulário:</div>
    <div class="chip-row" style="padding-top:0">
      ${suggestions
        .map((s) => `<button class="suggest-chip" data-suggest="${s.name}" data-suggest-note="${s.note}">+ ${s.name}</button>`)
        .join('')}
    </div>`;
}

function wireEvents(root: HTMLElement, date: string) {
  root.querySelector('#notif-toggle')?.addEventListener('change', async (e) => {
    const checked = (e.target as HTMLInputElement).checked;
    if (checked) await requestNotificationPermission();
    saveSettings({ notificationsEnabled: checked });
    showToast(checked ? 'Lembretes ativados 🔔' : 'Lembretes desativados');
  });

  root.querySelector('#water-add')?.addEventListener('click', () => {
    const input = root.querySelector('#water-time') as HTMLInputElement;
    if (!input.value) return;
    const settings = getSettings();
    const next = [...new Set([...settings.reminderTimes.water, input.value])].sort();
    saveSettings({ reminderTimes: { ...settings.reminderTimes, water: next } });
    showToast('Horário adicionado 💧');
    refreshActive();
  });

  root.querySelector('#water-chips')?.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-del-water]');
    if (!btn) return;
    const settings = getSettings();
    const next = settings.reminderTimes.water.filter((t) => t !== btn.dataset.delWater);
    saveSettings({ reminderTimes: { ...settings.reminderTimes, water: next } });
    refreshActive();
  });

  root.querySelector('#med-save')?.addEventListener('click', () => {
    const name = (root.querySelector('#med-name') as HTMLInputElement).value.trim();
    const note = (root.querySelector('#med-note') as HTMLInputElement).value.trim();
    const times = parseTimes((root.querySelector('#med-times') as HTMLInputElement).value);
    if (!name || !times.length) {
      showToast('Preenche o nome e pelo menos um horário (ex: 08:00)');
      return;
    }
    if (editingMedId) {
      updateMedication(editingMedId, { name, note: note || undefined, times });
      showToast('Medicação atualizada 💊');
      editingMedId = null;
    } else {
      addMedication({ name, note: note || undefined, times });
      showToast('Medicação adicionada 💊');
    }
    refreshActive();
  });

  root.querySelector('#med-cancel')?.addEventListener('click', () => {
    editingMedId = null;
    refreshActive();
  });

  root.querySelector('#med-list')?.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;

    const delBtn = target.closest<HTMLElement>('[data-del-med]');
    if (delBtn) {
      if (!confirm('Remover esta medicação da lista?')) return;
      deleteMedication(delBtn.dataset.delMed as string);
      if (editingMedId === delBtn.dataset.delMed) editingMedId = null;
      refreshActive();
      return;
    }

    const editArea = target.closest<HTMLElement>('[data-edit-med]');
    if (editArea) {
      editingMedId = editArea.dataset.editMed as string;
      refreshActive();
      return;
    }

    const timeBtn = target.closest<HTMLElement>('[data-toggle-med]');
    if (timeBtn) {
      const [medId, time] = (timeBtn.dataset.toggleMed as string).split('::');
      toggleMedTaken(date, medId, time);
      refreshActive();
    }
  });

  root.querySelector('#med-suggestions')?.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-suggest]');
    if (!btn) return;
    (root.querySelector('#med-name') as HTMLInputElement).value = btn.dataset.suggest as string;
    (root.querySelector('#med-note') as HTMLInputElement).value = btn.dataset.suggestNote as string;
    (root.querySelector('#med-times') as HTMLInputElement).value = '08:00';
    (root.querySelector('#med-name') as HTMLInputElement).focus();
  });
}
