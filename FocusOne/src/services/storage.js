import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage = {
  async get(key) {
    try {
      const v = await AsyncStorage.getItem(key);
      return v ? JSON.parse(v) : null;
    } catch (e) {
      console.warn(`storage.get(${key})`, e);
      return null;
    }
  },
  async set(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn(`storage.set(${key})`, e);
      return false;
    }
  },
  async remove(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
  async clear() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch {
      return false;
    }
  },
};

export const STORAGE_KEYS = {
  USER: "@focusone:user",
  USERS: "@focusone:users",
  GOALS: "@focusone:goals",
  SESSIONS: "@focusone:sessions",
  NOTES: "@focusone:notes",
  SETTINGS: "@focusone:settings",
  THEME: "@focusone:theme_mode",
  ONBOARDING_DONE: "@focusone:onboarding_done",
};
