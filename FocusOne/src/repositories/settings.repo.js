import { storage, STORAGE_KEYS } from "../services/storage";

const DEFAULTS = {
  defaultDuration: 25,
  notificationsEnabled: false,
  soundEnabled: true,
};

export const settingsRepo = {
  async get() {
    const stored = await storage.get(STORAGE_KEYS.SETTINGS);
    return { ...DEFAULTS, ...(stored || {}) };
  },
  async update(patch) {
    const current = await this.get();
    const next = { ...current, ...patch };
    await storage.set(STORAGE_KEYS.SETTINGS, next);
    return next;
  },
};
