import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "../../src/contexts/ThemeContext";
import { useGoals } from "../../src/contexts/GoalsContext";
import { useSettings } from "../../src/contexts/SettingsContext";
import { useToast } from "../../src/contexts/ToastContext";
import { useHaptics } from "../../src/hooks/useHaptics";
import Header from "../../src/components/ui/Header";
import Card from "../../src/components/ui/Card";
import Input from "../../src/components/ui/Input";
import Button from "../../src/components/ui/Button";
import ProgressBar from "../../src/components/ui/ProgressBar";
import { typography, spacing, radius } from "../../src/theme";

export default function GoalDetail() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const {
    goals,
    isLoaded,
    updateGoal,
    removeGoal,
    addTask,
    updateTask,
    removeTask,
    toggleTask,
    computeProgress,
  } = useGoals();
  const { settings } = useSettings();
  const { show: toast } = useToast();
  const haptics = useHaptics();

  const goal = useMemo(() => goals.find((g) => g.id === id), [goals, id]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dirty, setDirty] = useState(false);

  // Inline overlay state for adding/editing a single task.
  const [taskEditor, setTaskEditor] = useState(null);
  // shape: null | { mode: "add" | "edit", taskId?, title, duration }

  useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setDescription(goal.description || "");
      setDirty(false);
    }
  }, [goal]);

  // Loading state — wait for goals to load before deciding "not found".
  if (!isLoaded) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Header title="Goal" />
        <View style={styles.center}>
          <ActivityIndicator color={theme.primary} />
        </View>
      </View>
    );
  }

  if (!goal) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Header
          title="Goal"
          right={
            <Pressable onPress={() => router.back()} hitSlop={20}>
              <Text style={[styles.headerAction, { color: theme.primary, fontFamily: typography.family.semibold }]}>Done</Text>
            </Pressable>
          }
        />
        <View style={styles.center}>
          <Text style={{ color: theme.textSecondary }}>Goal not found.</Text>
        </View>
      </View>
    );
  }

  const progress = computeProgress(goal);
  const tasks = goal.tasks || [];

  const saveGoal = async () => {
    if (!title.trim()) {
      haptics.error();
      toast({ type: "error", message: "Title cannot be empty" });
      return;
    }
    await updateGoal(goal.id, { title: title.trim(), description: description.trim() });
    haptics.success();
    toast({ type: "success", message: "Saved" });
    setDirty(false);
  };

  const handleDone = () => {
    if (dirty) {
      Alert.alert("Unsaved changes", "Save your edits first?", [
        { text: "Discard", style: "destructive", onPress: () => router.back() },
        {
          text: "Save",
          onPress: async () => {
            await saveGoal();
            router.back();
          },
        },
      ]);
    } else {
      router.back();
    }
  };

  const onDeleteGoal = () => {
    haptics.medium();
    Alert.alert("Delete goal", `Delete "${goal.title}" and all its tasks?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await removeGoal(goal.id);
          toast({ type: "success", message: "Goal deleted" });
          router.back();
        },
      },
    ]);
  };

  const onToggleTask = async (taskId) => {
    haptics.light();
    await toggleTask(goal.id, taskId);
  };

  const onStartTask = (task) => {
    haptics.selection();
    router.push({
      pathname: "/focus/[taskId]",
      params: { taskId: task.id, duration: String(task.duration) },
    });
  };

  const openAdd = () => {
    haptics.selection();
    setTaskEditor({ mode: "add", title: "", duration: String(settings.defaultDuration) });
  };
  const openEdit = (task) => {
    haptics.selection();
    setTaskEditor({
      mode: "edit",
      taskId: task.id,
      title: task.title,
      duration: String(task.duration),
    });
  };

  const saveTaskEditor = async () => {
    if (!taskEditor) return;
    if (!taskEditor.title.trim()) {
      haptics.error();
      toast({ type: "error", message: "Task title required" });
      return;
    }
    const dur = Math.max(1, Number(taskEditor.duration) || settings.defaultDuration);
    if (taskEditor.mode === "add") {
      await addTask(goal.id, { title: taskEditor.title, duration: dur });
      toast({ type: "success", message: "Task added" });
    } else {
      await updateTask(goal.id, taskEditor.taskId, { title: taskEditor.title, duration: dur });
      toast({ type: "success", message: "Task updated" });
    }
    haptics.success();
    setTaskEditor(null);
  };

  const onDeleteTask = (task) => {
    haptics.medium();
    Alert.alert("Delete task", `Delete "${task.title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await removeTask(goal.id, task.id);
          toast({ type: "success", message: "Task deleted" });
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title="Edit Goal"
        right={
          <Pressable onPress={handleDone} hitSlop={20}>
            <Text style={[styles.headerAction, { color: theme.primary, fontFamily: typography.family.semibold }]}>Done</Text>
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
          showsVerticalScrollIndicator={false}
        >
          <Card variant="elevated" padding="lg" style={{ marginBottom: spacing.lg }}>
            <View style={styles.progressRow}>
              <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>Progress</Text>
              <Text style={[styles.progressValue, { color: theme.primary, fontFamily: typography.family.bold }]}>
                {progress}%
              </Text>
            </View>
            <ProgressBar progress={progress} />
          </Card>

          <Text style={[styles.sectionTitle, { color: theme.textSecondary, fontFamily: typography.family.semibold }]}>
            GOAL DETAILS
          </Text>
          <Input
            label="Title"
            value={title}
            onChangeText={(t) => {
              setTitle(t);
              setDirty(true);
            }}
            placeholder="What do you want to achieve?"
          />
          <Input
            label="Description"
            value={description}
            onChangeText={(t) => {
              setDescription(t);
              setDirty(true);
            }}
            placeholder="Why does this matter?"
            multiline
          />

          <Button
            title={dirty ? "Save Changes" : "Saved ✓"}
            onPress={saveGoal}
            disabled={!dirty}
            style={{ marginBottom: spacing.lg }}
          />

          <View style={styles.tasksHeader}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary, fontFamily: typography.family.semibold }]}>
              TASKS · {tasks.length}
            </Text>
            <Pressable onPress={openAdd} hitSlop={10} style={styles.addBtn}>
              <Ionicons name="add-circle" size={22} color={theme.primary} />
              <Text style={[styles.addText, { color: theme.primary, fontFamily: typography.family.semibold }]}>
                Add Task
              </Text>
            </Pressable>
          </View>

          {tasks.length === 0 ? (
            <Text style={[styles.noTasks, { color: theme.textMuted }]}>
              No tasks yet. Tap “Add Task” to create one.
            </Text>
          ) : (
            <Text style={[styles.hintLine, { color: theme.textMuted }]}>
              Tap a task to edit · Tap the play icon to start a focus session.
            </Text>
          )}

          {tasks.map((task) => (
            <Card key={task.id} variant="outlined" padding="md" style={{ marginBottom: spacing.sm }}>
              <View style={styles.taskRow}>
                <Pressable onPress={() => onToggleTask(task.id)} hitSlop={10} style={styles.checkBtn}>
                  <Ionicons
                    name={task.completed ? "checkmark-circle" : "ellipse-outline"}
                    size={26}
                    color={task.completed ? theme.success : theme.border}
                  />
                </Pressable>

                <Pressable onPress={() => openEdit(task)} style={styles.taskBody}>
                  <Text
                    style={[
                      styles.taskTitle,
                      {
                        color: task.completed ? theme.textMuted : theme.text,
                        fontFamily: typography.family.medium,
                        textDecorationLine: task.completed ? "line-through" : "none",
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {task.title}
                  </Text>
                  <Text style={[styles.taskMeta, { color: theme.textSecondary }]}>{task.duration} min</Text>
                </Pressable>

                {!task.completed && (
                  <Pressable onPress={() => onStartTask(task)} hitSlop={8} style={styles.taskAction}>
                    <Ionicons name="play-circle" size={28} color={theme.primary} />
                  </Pressable>
                )}
                <Pressable onPress={() => onDeleteTask(task)} hitSlop={8} style={styles.taskAction}>
                  <Ionicons name="trash-outline" size={20} color={theme.danger} />
                </Pressable>
              </View>
            </Card>
          ))}

          <Pressable onPress={onDeleteGoal} style={styles.deleteGoalBtn}>
            <Ionicons name="trash-outline" size={18} color={theme.danger} />
            <Text style={[styles.deleteGoalText, { color: theme.danger, fontFamily: typography.family.semibold }]}>
              Delete this goal
            </Text>
          </Pressable>

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {taskEditor && (
        <Pressable style={styles.overlay} onPress={() => setTaskEditor(null)}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.overlayInner}
          >
            <Pressable style={[styles.sheet, { backgroundColor: theme.card }]} onPress={() => {}}>
              <Text style={[styles.sheetTitle, { color: theme.text, fontFamily: typography.family.bold }]}>
                {taskEditor.mode === "add" ? "New Task" : "Edit Task"}
              </Text>

              <Input
                label="Title"
                placeholder="What's the task?"
                value={taskEditor.title}
                onChangeText={(t) => setTaskEditor((m) => ({ ...m, title: t }))}
                autoFocus
              />
              <Input
                label="Duration (minutes)"
                placeholder={String(settings.defaultDuration)}
                value={taskEditor.duration}
                onChangeText={(t) => setTaskEditor((m) => ({ ...m, duration: t }))}
                keyboardType="number-pad"
              />

              <View style={styles.sheetActions}>
                <Button title="Cancel" variant="ghost" onPress={() => setTaskEditor(null)} style={{ flex: 1 }} />
                <Button title="Save" onPress={saveTaskEditor} style={{ flex: 1 }} />
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  headerAction: { fontSize: typography.size.base, padding: 4 },
  progressRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.sm },
  progressLabel: { fontSize: typography.size.sm },
  progressValue: { fontSize: typography.size.sm },
  sectionTitle: { fontSize: 11, letterSpacing: 1.2, marginBottom: spacing.sm, marginLeft: spacing.xs },
  tasksHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.md,
  },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingVertical: 4 },
  addText: { fontSize: typography.size.sm },
  noTasks: { fontSize: typography.size.sm, textAlign: "center", paddingVertical: spacing.lg, fontStyle: "italic" },
  hintLine: { fontSize: typography.size.xs, marginBottom: spacing.sm, paddingHorizontal: spacing.xs, fontStyle: "italic" },
  taskRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  checkBtn: { padding: 2 },
  taskBody: { flex: 1, gap: 2 },
  taskTitle: { fontSize: typography.size.base },
  taskMeta: { fontSize: typography.size.xs },
  taskAction: { padding: 4 },
  deleteGoalBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  deleteGoalText: { fontSize: typography.size.sm },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    zIndex: 9999,
  },
  overlayInner: { width: "100%" },
  sheet: { borderRadius: radius.xl, padding: spacing.lg, gap: spacing.sm },
  sheetTitle: { fontSize: typography.size.lg, marginBottom: spacing.sm, textAlign: "center" },
  sheetActions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm },
});
