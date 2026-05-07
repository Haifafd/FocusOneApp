import { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightTheme, darkTheme } from "../constants/colors";

const ThemeContext = createContext();
const STORAGE_KEY = "@focusone:theme_mode";

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme(); 
  const [mode, setMode] = useState("system"); // 'light' | 'dark' | 'system'
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) setMode(saved);
      } catch (e) {
        console.log("خطأ في تحميل الثيم:", e);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);


  const activeMode = mode === "system" ? systemScheme || "light" : mode;
  const theme = activeMode === "dark" ? darkTheme : lightTheme;

  const changeMode = async (newMode) => {
    setMode(newMode);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newMode);
    } catch (e) {
      console.log("خطأ في حفظ الثيم:", e);
    }
  };

  // التبديل بين Light و Dark
  const toggleTheme = () => {
    changeMode(activeMode === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider
      value={{ theme, mode, activeMode, changeMode, toggleTheme, isLoaded }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// Hook سهل الاستخدام
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}