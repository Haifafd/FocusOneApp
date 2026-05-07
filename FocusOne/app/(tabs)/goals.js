import { View, FlatList, Pressable, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../../src/contexts/ThemeContext";
import { useGoals } from "../../src/contexts/GoalsContext";
import { useToast } from "../../src/contexts/ToastContext";
import { useHaptics } from "../../src/hooks/useHaptics";
import Header from "../../src/components/ui/Header";
import EmptyState from "../../src/components/ui/EmptyState";
import GoalCard from "../../src/components/goals/GoalCard";
import { typography, spacing } from "../../src/theme";

export default function Goals() {
  const { theme } = useTheme();
  const { goals, removeGoal, computeProgress } = useGoals();
  const { show: toast } = useToast();
  const haptics = useHaptics();
  const router = useRouter();

  const onAdd = () => {
    haptics.selection();
    router.push("/goal/new");
  };

  const onDelete = async (id) => {
    haptics.medium();
    await removeGoal(id);
    toast({ type: "success", message: "Goal deleted" });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title="Goals"
        right={
          <Pressable onPress={onAdd} hitSlop={10} style={styles.addBtn}>
            <Ionicons name="add" size={22} color={theme.primary} />
            <Text style={[styles.addText, { color: theme.primary, fontFamily: typography.family.semibold }]}>Add</Text>
          </Pressable>
        }
      />

      {goals.length === 0 ? (
        <EmptyState
          icon="flag-outline"
          title="No goals yet"
          subtitle="Create your first goal to start focusing on what matters."
          ctaLabel="Create Goal"
          onCta={onAdd}
        />
      ) : (
        <FlatList
          data={goals}
          keyExtractor={(g) => g.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <GoalCard goal={item} progress={computeProgress(item)} onDelete={onDelete} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 2 },
  addText: { fontSize: typography.size.base },
  list: { padding: spacing.lg, paddingBottom: 120 },
});
