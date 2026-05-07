import { useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../src/contexts/ThemeContext";
import { useGoals } from "../../src/contexts/GoalsContext";
import { useSettings } from "../../src/contexts/SettingsContext";
import { useToast } from "../../src/contexts/ToastContext";
import { useHaptics } from "../../src/hooks/useHaptics";
import Header from "../../src/components/ui/Header";
import Input from "../../src/components/ui/Input";
import { typography, spacing } from "../../src/theme";

export default function NewGoal() {
  const { theme } = useTheme();
  const { addGoal } = useGoals();
  const { settings } = useSettings();
  const { show: toast } = useToast();
  const haptics = useHaptics();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [duration, setDuration] = useState(String(settings.defaultDuration));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    if (!title.trim()) {
      setErrors({ title: "Title is required" });
      haptics.error();
      return;
    }
    setSaving(true);
    const taskDuration = Math.max(1, Number(duration) || settings.defaultDuration);
    const tasks = [
      {
        title: taskTitle.trim() || title.trim(),
        duration: taskDuration,
      },
    ];
    await addGoal({ title, description, tasks });
    setSaving(false);
    haptics.success();
    toast({ type: "success", message: "Goal created" });
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title="New Goal"
        showBack
        right={
          <Pressable onPress={onSave} hitSlop={10} disabled={saving}>
            <Text style={[styles.save, { color: saving ? theme.textMuted : theme.primary, fontFamily: typography.family.semibold }]}>
              Save
            </Text>
          </Pressable>
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Input
            label="Title"
            placeholder="e.g. Master React Native"
            value={title}
            onChangeText={(t) => {
              setTitle(t);
              if (errors.title) setErrors({});
            }}
            error={errors.title}
            autoFocus
          />

          <Input
            label="Description (optional)"
            placeholder="What does success look like?"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Input
            label="First Task"
            placeholder="(uses goal title if empty)"
            value={taskTitle}
            onChangeText={setTaskTitle}
          />

          <Input
            label="Focus Duration (minutes)"
            placeholder={String(settings.defaultDuration)}
            value={duration}
            onChangeText={setDuration}
            keyboardType="number-pad"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg },
  save: { fontSize: typography.size.base },
});
