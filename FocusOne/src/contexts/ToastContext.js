import { createContext, useContext, useState, useCallback } from "react";
import { StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "./ThemeContext";
import { typography, spacing, radius, shadows } from "../theme";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const show = useCallback(({ type = "info", message, duration = 2500 }) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), duration);
  }, []);

  const colors = {
    success: { bg: theme.success, icon: "checkmark-circle" },
    error:   { bg: theme.danger, icon: "alert-circle" },
    warning: { bg: theme.warning, icon: "warning" },
    info:    { bg: theme.primary, icon: "information-circle" },
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={[styles.toast, shadows.lg, { backgroundColor: colors[toast.type].bg, top: insets.top + spacing.md }]}
        >
          <Ionicons name={colors[toast.type].icon} size={20} color="#fff" />
          <Animated.Text style={[styles.text, { fontFamily: typography.family.semibold }]} numberOfLines={2}>
            {toast.message}
          </Animated.Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be inside ToastProvider");
  return ctx;
};

const styles = StyleSheet.create({
  toast: { position: "absolute", left: spacing.lg, right: spacing.lg, padding: spacing.md, borderRadius: radius.md, flexDirection: "row", alignItems: "center", gap: 10, zIndex: 1000 },
  text: { color: "#fff", fontSize: 14, flex: 1 },
});
