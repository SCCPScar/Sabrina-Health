import type { Tab } from '../nav';
import { getSettings, saveSettings, exportBackup, importBackup } from '../../lib/storage';
import { isCloudConfigured, getSession, signInWithEmail, signOut, fullSync } from '../../lib/sync';
import { refreshActive } from '../nav';
import { showToast } from '../components/toast';

export const settingsTab: Tab = {
  id: 'ajustes',
  label: 'Definições',
  icon: '⚙️',
  render(root: HTMLElement) {
    const settings = getSettings();

    root.innerHTML = `
      <div class="ph">
        <h2>Definições</h2>
        <div class="ph-title">O teu perfil</div>
        <div class="ph-sub">Tudo o que a app precisa de saber sobre ti</div>
      </div>

      <section>
        <div class="sec-title">🌸 Perfil</div>
        <div class="meds-grid">
          <div><label>Nome</label><input class="finp" id="s-name" type="text" value="${settings.name}" /></div>
          <div><label>Idade</label><input class="finp" id="s-age" type="number" value="${settings.age}" /></div>
          <div><label>Altura (cm)</label><input class="finp" id="s-height" type="number" value="${settings.heightCm}" /></div>
          <div><label>Peso atual (kg)</label><input class="finp" id="s-current-weight" type="number" step="0.5" value="${settings.currentWeightKg}" /></div>
          <div><label>Peso objetivo (kg)</label><input class="finp" id="s-goalweight" type="number" step="0.5" value="${settings.goalWeightKg}" /></div>
          <div><label>Cirurgia bariátrica</label><input class="finp" id="s-bariatric" type="date" value="${settings.bariatricSurgeryDate ?? ''}" /></div>
        </div>
        <div class="form-row" style="padding-top:0">
          <button class="btn block" id="s-save-profile">Guardar perfil</button>
        </div>
      </section>

      <section>
        <div class="sec-title">💉 Mounjaro</div>
        <div class="meds-grid">
          <div><label>Início</label><input class="finp" id="s-mj-start" type="date" value="${settings.mounjaro.startDate}" /></div>
          <div><label>Fim previsto</label><input class="finp" id="s-mj-end" type="date" value="${settings.mounjaro.endDatePlanned}" /></div>
        </div>
        <div class="meds-grid" style="grid-template-columns:1fr">
          <div><label>Retomou em (se aplicável)</label><input class="finp" id="s-mj-resumed" type="date" value="${settings.mounjaro.resumedDate ?? ''}" /></div>
        </div>
        <div class="form-row" style="padding-top:0">
          <button class="btn block" id="s-save-mj">Guardar Mounjaro</button>
        </div>
      </section>

      <section>
        <div class="sec-title">✈️ Viagem à Turquia</div>
        <div class="meds-grid" style="grid-template-columns:1fr">
          <div><label>Data da viagem</label><input class="finp" id="s-trip" type="date" value="${settings.turkeyTripDate}" /></div>
        </div>
        <div class="form-row" style="padding-top:0">
          <button class="btn block" id="s-save-trip">Guardar data</button>
        </div>
      </section>

      <section>
        <div class="sec-title">🎯 Metas diárias</div>
        <div class="meds-grid">
          <div><label>Água diária (ml)</label><input class="finp" id="s-water" type="number" step="50" value="${settings.waterGoalMl}" /></div>
          <div><label>Meta calórica (kcal)</label><input class="finp" id="s-kcal" type="number" step="10" value="${settings.calorieGoal}" /></div>
          <div><label>Meta proteína (g)</label><input class="finp" id="s-protein" type="number" step="5" value="${settings.proteinGoal}" /></div>
        </div>
        <div class="form-row" style="padding-top:0">
          <button class="btn block" id="s-save-goals">Guardar metas</button>
        </div>
      </section>

      <section>
        <div class="sec-title">🔔 Notificações</div>
        <div style="padding:12px 16px;font-size:12.5px;color:var(--text-dim);line-height:1.6">
          Os lembretes de água e de medicação agora vivem na aba <strong>💊 Remédios</strong> — é lá que ativas as notificações e defines os horários.
        </div>
      </section>

      <section>
        <div class="sec-title">☁️ Conta e sincronização</div>
        <div id="cloud-section"></div>
      </section>

      <section>
        <div class="sec-title">💾 Backup</div>
        <div style="padding:12px 16px 4px;font-size:12.5px;color:var(--text-dim)">Exporta os teus dados de vez em quando — é a tua rede de segurança, mesmo com sincronização cloud ativa.</div>
        <div class="form-row">
          <button class="btn ghost" id="s-export">📤 Exportar backup (.json)</button>
        </div>
        <div class="form-row" style="padding-top:0">
          <button class="btn ghost" id="s-import-btn">📥 Importar backup</button>
          <input type="file" id="s-import-file" accept="application/json" style="display:none" />
        </div>
      </section>

      <section>
        <div class="sec-title">♿ Acessibilidade</div>
        <div class="row" style="cursor:default">
          <div class="rtxt"><strong>Reduzir animações</strong><small>Respeita prefers-reduced-motion do sistema por defeito</small></div>
          <label class="switch"><input type="checkbox" id="s-motion" ${settings.reducedMotion ? 'checked' : ''}/><span class="slider"></span></label>
        </div>
      </section>

      <div style="text-align:center;padding:20px;font-size:11px;color:var(--text-faint)">Nova Sabrina · feito com carinho para ti 🌸</div>
    `;

    renderCloudSection(root);
    wireEvents(root);
  }
};

function renderCloudSection(root: HTMLElement) {
  const el = root.querySelector('#cloud-section') as HTMLElement;
  if (!isCloudConfigured) {
    el.innerHTML = `
      <div style="padding:12px 16px;font-size:12.5px;color:var(--text-dim);line-height:1.6">
        Sincronização cloud ainda não está configurada neste deployment. A app funciona 100% offline com
        localStorage. Para sincronizar entre dispositivos, define <code>VITE_SUPABASE_URL</code> e
        <code>VITE_SUPABASE_ANON_KEY</code> — instruções completas no README.
      </div>`;
    return;
  }

  getSession().then((session) => {
    if (session) {
      el.innerHTML = `
        <div style="padding:12px 16px;font-size:13px">Sessão iniciada como <strong>${session.user.email}</strong></div>
        <div class="form-row">
          <button class="btn" id="s-sync-now">🔄 Sincronizar agora</button>
        </div>
        <div class="form-row" style="padding-top:0">
          <button class="btn ghost" id="s-signout">Terminar sessão</button>
        </div>
        <div id="sync-status" style="padding:0 16px 12px;font-size:12px;color:var(--text-faint)"></div>
      `;
      el.querySelector('#s-sync-now')?.addEventListener('click', async () => {
        const status = el.querySelector('#sync-status') as HTMLElement;
        status.textContent = 'A sincronizar…';
        const result = await fullSync();
        status.textContent = result.ok
          ? `Sincronizado — ${result.pushed} enviado(s), ${result.pulled} recebido(s).`
          : `Falhou: ${result.reason}`;
      });
      el.querySelector('#s-signout')?.addEventListener('click', async () => {
        // main.ts's onAuthChange listener owns the "sessão terminada" toast
        // and the global refresh; this local refresh just avoids a beat of
        // lag on the tab that's already open.
        await signOut();
        refreshActive();
      });
    } else {
      el.innerHTML = `
        <div style="padding:12px 16px;font-size:12.5px;color:var(--text-dim)">
          Sem palavra-passe: recebes um link de acesso por email.
        </div>
        <div class="form-row">
          <input class="finp" id="s-email" type="email" placeholder="teu@email.com" />
          <button class="fsave" id="s-signin">Enviar link</button>
        </div>
        <div id="signin-status" style="padding:0 16px 12px;font-size:12px;color:var(--text-faint)"></div>
      `;
      el.querySelector('#s-signin')?.addEventListener('click', async () => {
        const input = el.querySelector('#s-email') as HTMLInputElement;
        const status = el.querySelector('#signin-status') as HTMLElement;
        if (!input.value) return;
        status.textContent = 'A enviar…';
        const result = await signInWithEmail(input.value);
        status.textContent = result.ok ? 'Link enviado — verifica o teu email.' : `Erro: ${result.error}`;
      });
    }
  });
}

function wireEvents(root: HTMLElement) {
  root.querySelector('#s-save-profile')?.addEventListener('click', () => {
    saveSettings({
      name: (root.querySelector('#s-name') as HTMLInputElement).value.trim() || 'Sabrina',
      age: Number((root.querySelector('#s-age') as HTMLInputElement).value) || 48,
      heightCm: Number((root.querySelector('#s-height') as HTMLInputElement).value) || 160,
      currentWeightKg: Number((root.querySelector('#s-current-weight') as HTMLInputElement).value) || 75,
      goalWeightKg: Number((root.querySelector('#s-goalweight') as HTMLInputElement).value) || 65,
      bariatricSurgeryDate: (root.querySelector('#s-bariatric') as HTMLInputElement).value || ''
    });
    showToast('Perfil guardado 🌸');
    refreshActive();
  });

  root.querySelector('#s-save-mj')?.addEventListener('click', () => {
    saveSettings({
      mounjaro: {
        startDate: (root.querySelector('#s-mj-start') as HTMLInputElement).value,
        endDatePlanned: (root.querySelector('#s-mj-end') as HTMLInputElement).value,
        resumedDate: (root.querySelector('#s-mj-resumed') as HTMLInputElement).value || ''
      }
    });
    showToast('Mounjaro atualizado 💉');
    refreshActive();
  });

  root.querySelector('#s-save-trip')?.addEventListener('click', () => {
    const v = (root.querySelector('#s-trip') as HTMLInputElement).value;
    if (!v) return;
    saveSettings({ turkeyTripDate: v });
    showToast('Data da viagem guardada ✈️');
    refreshActive();
  });

  root.querySelector('#s-save-goals')?.addEventListener('click', () => {
    saveSettings({
      waterGoalMl: Number((root.querySelector('#s-water') as HTMLInputElement).value) || 1500,
      calorieGoal: Number((root.querySelector('#s-kcal') as HTMLInputElement).value) || 1100,
      proteinGoal: Number((root.querySelector('#s-protein') as HTMLInputElement).value) || 89
    });
    showToast('Metas guardadas 🌱');
  });

  root.querySelector('#s-motion')?.addEventListener('change', (e) => {
    saveSettings({ reducedMotion: (e.target as HTMLInputElement).checked });
  });

  root.querySelector('#s-export')?.addEventListener('click', () => {
    const backup = exportBackup();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nova-sabrina-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup exportado 📤');
  });

  root.querySelector('#s-import-btn')?.addEventListener('click', () => {
    (root.querySelector('#s-import-file') as HTMLInputElement).click();
  });

  root.querySelector('#s-import-file')?.addEventListener('change', async (e) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!confirm('Importar este backup vai substituir os dados existentes com o mesmo tipo (peso, medidas, treinos, etc). Continuar?')) {
      input.value = '';
      return;
    }
    try {
      const text = await file.text();
      importBackup(JSON.parse(text));
      showToast('Backup importado ✅');
      refreshActive();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Não foi possível importar este ficheiro.');
    }
    input.value = '';
  });
}
