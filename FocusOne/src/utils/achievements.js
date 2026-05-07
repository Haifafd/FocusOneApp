export const MILESTONES = [
  { id: "first", count: 1, title: "First Focus", emoji: "🎯" },
  { id: "five", count: 5, title: "Getting Started", emoji: "🌱" },
  { id: "ten", count: 10, title: "On a Roll", emoji: "🔥" },
  { id: "twentyfive", count: 25, title: "Quarter Century", emoji: "💪" },
  { id: "fifty", count: 50, title: "Half a Hundred", emoji: "🏆" },
  { id: "hundred", count: 100, title: "Century Club", emoji: "🎖️" },
];

export const computeAchievements = (sessionCount) =>
  MILESTONES.map((m) => ({ ...m, unlocked: sessionCount >= m.count }));

// Returns the milestone unlocked exactly at this count (for celebration toasts).
export const milestoneAt = (count) => MILESTONES.find((m) => m.count === count) || null;

export const formatMinutes = (mins) => {
  if (!mins) return "0m";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};
