import { memo } from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { typography, spacing } from "../../theme";
import Card from "../ui/Card";
import ProgressBar from "../ui/ProgressBar";

function GoalCard({ goal, progress, onDelete }) {
  const { theme } = useTheme();

  const confirmDelete = () => {
    Alert.alert("Delete goal", `Delete "${goal.title}"? Tasks will be removed too.`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => onDelete(goal.id) },
    ]);
  };

  const taskCount = goal.tasks?.length || 0;

  return (
    <Card variant="elevated" padding="lg" style={styles.card}>
      <View style={styles.header}>
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
        <Pressable hitSlop={10} onPress={confirmDelete}>
          <Ionicons name="trash-outline" size={20} color={theme.danger} />
        </Pressable>
      </View>

      <View style={styles.meta}>
        <Text style={[styles.metaText, { color: theme.textSecondary }]}>
          {taskCount} {taskCount === 1 ? "task" : "tasks"}
        </Text>
        <Text style={[styles.metaText, { color: theme.primary, fontFamily: typography.family.semibold }]}>
          {progress}%
        </Text>
      </View>

      <ProgressBar progress={progress} />
    </Card>
  );
}

export default memo(GoalCard);

const styles = StyleSheet.create({
  card: { marginBottom: spacing.md },
  header: { flexDirection: "row", alignItems: "flex-start", marginBottom: spacing.md, gap: spacing.md },
  title: { fontSize: typography.size.lg, marginBottom: 2 },
  desc: { fontSize: typography.size.sm },
  meta: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.sm },
  metaText: { fontSize: typography.size.sm },
});
