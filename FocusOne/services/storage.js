import AsyncStorage from "@react-native-async-storage/async-storage";

// Wrapper around AsyncStorage with error handling

export const storage = {
  // Save data (auto JSON conversion)
  async set(key, value) {
    try {
      const json = JSON.stringify(value);
      await AsyncStorage.setItem(key, json);
      return true;
    } catch (e) {
      console.log(`Error saving ${key}:`, e);
      return false;
    }
  },

  // Read data
  async get(key) {
    try {
      const json = await AsyncStorage.getItem(key);
      return json ? JSON.parse(json) : null;
    } catch (e) {
      console.log(`Error reading ${key}:`, e);
      return null;
    }
  },

  // Remove data
  async remove(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (e) {
      console.log(`Error removing ${key}:`, e);
      return false;
    }
  },

  // Clear all data (useful for "Reset Data" in Settings)
  async clear() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (e) {
      console.log("Error clearing data:", e);
      return false;
    }
  },
};

// Unified storage keys for the entire app
export const STORAGE_KEYS = {
  USER: "@focusone:user",            // Current logged-in user (session)
  USERS: "@focusone:users",          // List of all registered accounts
  GOALS: "@focusone:goals",
  TASKS: "@focusone:tasks",
  SESSIONS: "@focusone:sessions",
  NOTES: "@focusone:notes",
  SETTINGS: "@focusone:settings",
  THEME: "@focusone:theme_mode",
  ONBOARDING_DONE: "@focusone:onboarding_done",
};