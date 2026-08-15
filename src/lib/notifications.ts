import { getSettings } from './storage';

let checkInterval: ReturnType<typeof setInterval> | undefined;
const firedToday = new Set<string>();

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied';
  if (Notification.permission === 'default') return Notification.requestPermission();
  return Notification.permission;
}

function notify(title: string, body: string) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  new Notification(title, { body, icon: `${import.meta.env.BASE_URL}icons/icon-192.png` });
}

/**
 * Loop de lembretes só em primeiro plano. PWAs no iOS não suportam
 * temporizadores em segundo plano nem notificações agendadas sem um
 * servidor de push — isto só dispara enquanto a Nova Sabrina está mesmo
 * aberta em primeiro plano (ver aba Definições para a explicação mostrada).
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
      notify('Nova Sabrina 💧', 'Hora de beber um copinho de água.');
    }
    if (settings.reminderTimes.meals.includes(hhmm) && !firedToday.has(`meal_${todayKey}`)) {
      firedToday.add(`meal_${todayKey}`);
      notify('Nova Sabrina 🌸', 'Hora de uma refeição — sem pressa, regista o que comeres.');
    }
    if (settings.reminderTimes.training.includes(hhmm) && !firedToday.has(`train_${todayKey}`)) {
      firedToday.add(`train_${todayKey}`);
      notify('Nova Sabrina 💪', 'Um bocadinho de movimento em casa, quando puderes.');
    }
  }, 30_000);
}
