import AsyncStorage from "@react-native-async-storage/async-storage";

// Wrapper بسيط حول AsyncStorage مع معالجة الأخطاء

export const storage = {
  // حفظ بيانات (تلقائياً تتحول لـ JSON)
  async set(key, value) {
    try {
      const json = JSON.stringify(value);
      await AsyncStorage.setItem(key, json);
      return true;
    } catch (e) {
      console.log(`خطأ في حفظ ${key}:`, e);
      return false;
    }
  },

  // قراءة بيانات
  async get(key) {
    try {
      const json = await AsyncStorage.getItem(key);
      return json ? JSON.parse(json) : null;
    } catch (e) {
      console.log(`خطأ في قراءة ${key}:`, e);
      return null;
    }
  },

  // حذف بيانات
  async remove(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (e) {
      console.log(`خطأ في حذف ${key}:`, e);
      return false;
    }
  },

  // مسح كل البيانات (مفيد لزر "Reset Data" في Settings)
  async clear() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (e) {
      console.log("خطأ في مسح البيانات:", e);
      return false;
    }
  },
};

// مفاتيح موحّدة للاستخدام في كل التطبيق
export const STORAGE_KEYS = {
  USER: "@focusone:user",
  GOALS: "@focusone:goals",
  TASKS: "@focusone:tasks",
  SESSIONS: "@focusone:sessions",
  NOTES: "@focusone:notes",
  SETTINGS: "@focusone:settings",
  THEME: "@focusone:theme_mode",
  ONBOARDING_DONE: "@focusone:onboarding_done",
};