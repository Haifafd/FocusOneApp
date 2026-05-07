import { storage, STORAGE_KEYS } from "../services/storage";
import { generateId } from "../utils/ids";

export const goalsRepo = {
  async list() {
    return (await storage.get(STORAGE_KEYS.GOALS)) || [];
  },

  async create(input) {
    const goals = await this.list();
    const goal = {
      id: generateId(),
      title: input.title.trim(),
      description: (input.description || "").trim(),
      priority: input.priority || "medium",
      tasks: (input.tasks || []).map((t) => ({
        id: generateId(),
        title: t.title,
        duration: t.duration || 25,
        completed: false,
      })),
      createdAt: new Date().toISOString(),
    };
    await storage.set(STORAGE_KEYS.GOALS, [goal, ...goals]);
    return goal;
  },

  async update(id, patch) {
    const goals = await this.list();
    const updated = goals.map((g) => (g.id === id ? { ...g, ...patch } : g));
    await storage.set(STORAGE_KEYS.GOALS, updated);
    return updated.find((g) => g.id === id);
  },

  async remove(id) {
    const goals = await this.list();
    await storage.set(STORAGE_KEYS.GOALS, goals.filter((g) => g.id !== id));
  },

  async toggleTask(goalId, taskId) {
    const goals = await this.list();
    const updated = goals.map((g) => {
      if (g.id !== goalId) return g;
      return {
        ...g,
        tasks: g.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        ),
      };
    });
    await storage.set(STORAGE_KEYS.GOALS, updated);
  },

  computeProgress(goal) {
    if (!goal.tasks?.length) return 0;
    const done = goal.tasks.filter((t) => t.completed).length;
    return Math.round((done / goal.tasks.length) * 100);
  },
};
