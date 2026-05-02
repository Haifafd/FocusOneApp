import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import Button from "../components/common/button";
import Input from "../components/common/input";
import Card from "../components/common/card";
import { typography, spacing } from "../constants/typography";

export default function TestScreen() {
  const { theme, activeMode, toggleTheme } = useTheme();
  const router = useRouter();
  const [text, setText] = useState("");

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={styles.container}
    >
      <Text style={[styles.title, { color: theme.text }]}>
        🎯 FocusOne — Test Screen
      </Text>

      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Current theme: {activeMode === "dark" ? "🌙 Dark" : "☀️ Light"}
      </Text>

      <Card style={{ marginVertical: spacing.lg }}>
        <Text style={[styles.cardText, { color: theme.text }]}>
          This is a test card ✨
        </Text>
        <Text style={[styles.cardText, { color: theme.textSecondary }]}>
          Uses the active theme
        </Text>
      </Card>

      <Input
        label="Try the input"
        placeholder="Type anything..."
        value={text}
        onChangeText={setText}
      />

      <Button
        title="🌓 Toggle Theme"
        onPress={toggleTheme}
        style={{ marginTop: spacing.md }}
      />

      <Button
        title="🔐 Go to Login"
        variant="outline"
        onPress={() => router.push("/(auth)/login")}
        style={{ marginTop: spacing.sm }}
      />

      <Button
        title="📝 Go to Register"
        variant="outline"
        onPress={() => router.push("/(auth)/register")}
        style={{ marginTop: spacing.sm }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    paddingTop: spacing["3xl"],
  },
  title: {
    fontSize: typography.size["2xl"],
    fontWeight: typography.weight.bold,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.size.base,
    marginBottom: spacing.lg,
  },
  cardText: {
    fontSize: typography.size.base,
    marginBottom: spacing.xs,
  },
});