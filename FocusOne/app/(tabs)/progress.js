import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "../../src/contexts/ThemeContext";
import { useSessions } from "../../src/contexts/SessionsContext";
import Header from "../../src/components/ui/Header";
import Card from "../../src/components/ui/Card";
import EmptyState from "../../src/components/ui/EmptyState";
import WeeklyChart from "../../src/components/progress/WeeklyChart";
import { typography, spacing } from "../../src/theme";

export default function Progress() {
  const { theme } = useTheme();
  const { sessions, todayCount, weekCount, weeklyChart, currentStreak } = useSessions();

  const streakLabel = currentStreak > 0 ? `🔥 ${currentStreak}` : "—";

  if (sessions.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Header title="Progress" />
        <EmptyState
          icon="stats-chart-outline"
          title="No sessions yet"
          subtitle="Complete your first focus session to see your stats here."
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title="Progress"
        right={
          <Text style={[styles.streak, { color: theme.warning, fontFamily: typography.family.bold }]}>
            {streakLabel}
          </Text>
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <Card variant="elevated" padding="lg" style={styles.statCard}>
            <Text style={[styles.statNum, { color: theme.primary, fontFamily: typography.family.extrabold }]}>
              {todayCount}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Today&rsquo;s Sessions</Text>
          </Card>

          <Card variant="elevated" padding="lg" style={styles.statCard}>
            <Text style={[styles.statNum, { color: theme.success, fontFamily: typography.family.extrabold }]}>
              {weekCount}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Weekly Sessions</Text>
          </Card>
        </View>

        <Card variant="elevated" padding="lg" style={{ marginBottom: spacing.lg }}>
          <Text style={[styles.cardTitle, { color: theme.text, fontFamily: typography.family.semibold }]}>
            This Week
          </Text>
          <WeeklyChart data={weeklyChart} />
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: 120 },
  streak: { fontSize: typography.size.base },
  statsRow: { flexDirection: "row", gap: spacing.md, marginBottom: spacing.lg },
  statCard: { flex: 1, alignItems: "center" },
  statNum: { fontSize: typography.size["4xl"], marginBottom: spacing.xs },
  statLabel: { fontSize: typography.size.xs, textAlign: "center" },
  cardTitle: { fontSize: typography.size.base, marginBottom: spacing.lg },
});
