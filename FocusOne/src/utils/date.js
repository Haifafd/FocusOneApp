export const todayKey = () => new Date().toISOString().slice(0, 10);

export const dayKey = (dateStr) => new Date(dateStr).toISOString().slice(0, 10);

export const isWithinLastDays = (dateStr, days) => {
  const d = new Date(dateStr).getTime();
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return d >= cutoff;
};

export const startOfWeek = () => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sun
  const diff = now.getDate() - day;
  const start = new Date(now.setDate(diff));
  start.setHours(0, 0, 0, 0);
  return start;
};
