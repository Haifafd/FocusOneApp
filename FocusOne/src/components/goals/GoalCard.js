import { memo } from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { typography, spacing, radius, shadows } from "../../theme";
import ProgressBar from "../ui/ProgressBar";

function GoalCard({ goal, progress, onDelete, onPress }) {
  const { theme } = useTheme();

  const confirmDelete = (e) => {
    // Stop the press from also opening the goal
    e?.stopPropagation?.();
    Alert.alert("Delete goal", `Delete "${goal.title}"? Tasks will be removed too.`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => onDelete(goal.id) },
    ]);
  };

  const taskCount = goal.tasks?.length || 0;
  const completedCount = goal.tasks?.filter((t) => t.completed).length || 0;

  return (
    <Pressable
      onPress={() => onPress?.(goal)}
      style={({ pressed }) => [
        styles.card,
        shadows.md,
        {
          backgroundColor: theme.card,
          shadowColor: theme.shadow,
          opacity: pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.99 : 1 }],
        },
      ]}
    >
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: theme.text, fontFamily: typography.family.bold }]} numberOfLines={1}>
            {goal.title}
          </Text>
          {!!goal.description && (
            <Text style={[styles.desc, { color: theme.textSecondary }]} numberOfLines={1}>
              {goal.description}
            </Text>
          )}
        </View>
        <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
      </View>

      <View style={styles.meta}>
        <Text style={[styles.metaText, { color: theme.textSecondary }]}>
          {completedCount}/{taskCount} {taskCount === 1 ? "task" : "tasks"}
        </Text>
        <Text style={[styles.metaText, { color: theme.primary, fontFamily: typography.family.semibold }]}>
          {progress}%
        </Text>
      </View>

      <ProgressBar progress={progress} />

      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <View style={styles.footerLeft}>
          <Ionicons name="create-outline" size={14} color={theme.textMuted} />
          <Text style={[styles.footerHint, { color: theme.textMuted }]}>Tap to edit</Text>
        </View>
        <Pressable hitSlop={10} onPress={confirmDelete} style={styles.trash}>
          <Ionicons name="trash-outline" size={18} color={theme.danger} />
        </Pressable>
      </View>
    </Pressable>
  );
}

export default memo(GoalCard);

const styles = StyleSheet.create({
  card: { marginBottom: spacing.md, padding: spacing.lg, borderRadius: radius.lg },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.sm },
  title: { fontSize: typography.size.lg, marginBottom: 2 },
  desc: { fontSize: typography.size.sm },
  meta: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.sm },
  metaText: { fontSize: typography.size.sm },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerLeft: { flexDirection: "row", alignItems: "center", gap: 4 },
  footerHint: { fontSize: typography.size.xs },
  trash: { padding: 4 },
});
