import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import Button from "../components/common/button";
import Input from "../components/common/input";
import Card from "../components/common/card";
import { typography, spacing } from "../constants/typography";

export default function TestScreen() {
  const { theme, activeMode, toggleTheme } = useTheme();
  const [text, setText] = useState("");

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={styles.container}
    >
      <Text style={[styles.title, { color: theme.text }]}>
        🎯 FocusOne — اختبار الأساسيات
      </Text>

      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        الثيم الحالي: {activeMode === "dark" ? "🌙 ليلي" : "☀️ نهاري"}
      </Text>

      <Card style={{ marginVertical: spacing.lg }}>
        <Text style={[styles.cardText, { color: theme.text }]}>
          هذا كرت تجريبي ✨
        </Text>
        <Text style={[styles.cardText, { color: theme.textSecondary }]}>
          يستخدم نفس الثيم النشط
        </Text>
      </Card>

      <Input
        label="جربي الإدخال"
        placeholder="اكتبي أي شي..."
        value={text}
        onChangeText={setText}
      />

      <Button
        title="🌓 تبديل الثيم"
        onPress={toggleTheme}
        style={{ marginTop: spacing.md }}
      />

      <Button
        title="زر ثانوي"
        variant="secondary"
        onPress={() => {}}
        style={{ marginTop: spacing.sm }}
      />

      <Button
        title="زر بحدود"
        variant="outline"
        onPress={() => {}}
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