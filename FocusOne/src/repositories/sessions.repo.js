import { storage, STORAGE_KEYS } from "../services/storage";
import { generateId } from "../utils/ids";
import { todayKey, isWithinLastDays } from "../utils/date";

export const sessionsRepo = {
  async list() {
    return (await storage.get(STORAGE_KEYS.SESSIONS)) || [];
  },

  async create({ taskId, goalId, durationMinutes }) {
    const sessions = await this.list();
    const session = {
      id: generateId(),
      taskId: taskId || null,
      goalId: goalId || null,
      durationMinutes,
      completedAt: new Date().toISOString(),
    };
    await storage.set(STORAGE_KEYS.SESSIONS, [session, ...sessions]);
    return session;
  },

  countToday(sessions) {
    const t = todayKey();
    return sessions.filter((s) => s.completedAt.slice(0, 10) === t).length;
  },

  countWeek(sessions) {
    return sessions.filter((s) => isWithinLastDays(s.completedAt, 7)).length;
  },

  weeklyChart(sessions) {
    // Returns 7-element array, Sun → Sat
    const chart = [0, 0, 0, 0, 0, 0, 0];
    const now = new Date();
    sessions.forEach((s) => {
      const d = new Date(s.completedAt);
      const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
      if (diff < 7) {
        const dayIndex = d.getDay();
        chart[dayIndex]++;
      }
    });
    return chart;
  },

  computeStreak(sessions) {
    if (!sessions.length) return 0;
    const days = new Set(sessions.map((s) => s.completedAt.slice(0, 10)));
    let streak = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    while (true) {
      const k = cursor.toISOString().slice(0, 10);
      if (days.has(k)) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else if (streak === 0 && k === todayKey()) {
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  },
};
