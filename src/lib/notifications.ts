import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { getSettings, getMedications } from './storage';

let checkInterval: ReturnType<typeof setInterval> | undefined;
const firedToday = new Set<string>();

/**
 * Two very different notification backends depending on where the Nova
 * Sabrina is running:
 *  - Wrapped as a native Android app (Capacitor): the browser Notification
 *    API isn't reliably available inside a WebView, so real system
 *    notifications go through @capacitor/local-notifications instead.
 *  - PWA / plain browser (installed via "Adicionar ao ecrã principal" or
 *    just open in Safari/Chrome): the standard Web Notification API.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    try {
      const result = await LocalNotifications.requestPermissions();
      return result.display === 'granted';
    } catch {
      return false;
    }
  }
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'default') {
    const perm = await Notification.requestPermission();
    return perm === 'granted';
  }
  return Notification.permission === 'granted';
}

let nativeNotificationId = 1;

async function notify(title: string, body: string) {
  if (Capacitor.isNativePlatform()) {
    try {
      const perm = await LocalNotifications.checkPermissions();
      if (perm.display !== 'granted') return;
      await LocalNotifications.schedule({
        notifications: [{ id: nativeNotificationId++, title, body, schedule: { at: new Date(Date.now() + 200) } }]
      });
    } catch {
      /* notification unavailable — reminder just doesn't show this time */
    }
    return;
  }
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  new Notification(title, { body, icon: `${import.meta.env.BASE_URL}icons/icon-192.png` });
}

/**
 * Loop de lembretes só em primeiro plano. Nem PWAs no iOS nem a app Android
 * embrulhada suportam lembretes agendados em segundo plano sem um servidor
 * de push dedicado — isto só dispara enquanto a Nova Sabrina está mesmo
 * aberta (ver aba Remédios para a explicação mostrada ao utilizador).
 */
export function startReminderLoop(): void {
  if (checkInterval) clearInterval(checkInterval);
  checkInterval = setInterval(() => {
    const settings = getSettings();
    if (!settings.notificationsEnabled) return;
    const now = new Date();
    const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const todayKey = `${now.toDateString()}_${hhmm}`;

    if (settings.reminderTimes.water.includes(hhmm) && !firedToday.has(`water_${todayKey}`)) {
      firedToday.add(`water_${todayKey}`);
      void notify('Nova Sabrina 💧', 'Hora de beber um copinho de água.');
    }
    if (settings.reminderTimes.meals.includes(hhmm) && !firedToday.has(`meal_${todayKey}`)) {
      firedToday.add(`meal_${todayKey}`);
      void notify('Nova Sabrina 🌸', 'Hora de uma refeição — sem pressa, regista o que comeres.');
    }
    if (settings.reminderTimes.training.includes(hhmm) && !firedToday.has(`train_${todayKey}`)) {
      firedToday.add(`train_${todayKey}`);
      void notify('Nova Sabrina 💪', 'Um bocadinho de movimento em casa, quando puderes.');
    }

    for (const med of getMedications()) {
      if (!med.times.includes(hhmm)) continue;
      const fireKey = `med_${med.id}_${todayKey}`;
      if (firedToday.has(fireKey)) continue;
      firedToday.add(fireKey);
      void notify('Nova Sabrina 💊', `Hora de tomar: ${med.name}${med.note ? ` (${med.note})` : ''}`);
    }
  }, 30_000);
}
