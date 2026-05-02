import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";

export default function Index() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Text style={[styles.title, { color: theme.text }]}>
        🎯 FocusOne
      </Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Test menu
      </Text>

      <Pressable
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={() => router.push("/(onboarding)")}
      >
        <Text style={styles.buttonText}>🎨 Open Onboarding</Text>
      </Pressable>

      <Pressable
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={() => router.push("/(auth)/login")}
      >
        <Text style={styles.buttonText}>🔐 Open Login</Text>
      </Pressable>

      <Pressable
        style={[styles.button, { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }]}
        onPress={toggleTheme}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>
          🌓 Toggle Theme
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});