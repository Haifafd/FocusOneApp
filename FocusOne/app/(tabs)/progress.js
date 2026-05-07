import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "../../src/contexts/ThemeContext";
import { useSessions } from "../../src/contexts/SessionsContext";
import Header from "../../src/components/ui/Header";
import Card from "../../src/components/ui/Card";
import EmptyState from "../../src/components/ui/EmptyState";
import WeeklyChart from "../../src/components/progress/WeeklyChart";
import { computeAchievements, formatMinutes } from "../../src/utils/achievements";
import { typography, spacing, radius } from "../../src/theme";

export default function Progress() {
  const { theme } = useTheme();
  const { sessions, todayCount, weekCount, weeklyChart, currentStreak, totalMinutes } = useSessions();

  const streakLabel = currentStreak > 0 ? `🔥 ${currentStreak}` : "—";
  const achievements = computeAchievements(sessions.length);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

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
        {/* Hero total focus time */}
        <Card variant="elevated" padding="lg" style={[styles.heroCard, { backgroundColor: theme.primarySoft }]}>
          <Text style={[styles.heroLabel, { color: theme.primaryDark, fontFamily: typography.family.semibold }]}>
            TOTAL FOCUS TIME
          </Text>
          <Text style={[styles.heroValue, { color: theme.primaryDark, fontFamily: typography.family.extrabold }]}>
            {formatMinutes(totalMinutes)}
          </Text>
          <Text style={[styles.heroSub, { color: theme.primaryDark }]}>
            across {sessions.length} {sessions.length === 1 ? "session" : "sessions"}
          </Text>
        </Card>

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

        <Card variant="elevated" padding="lg" style={{ marginBottom: spacing.lg }}>
          <View style={styles.achHeader}>
            <Text style={[styles.cardTitle, { color: theme.text, fontFamily: typography.family.semibold }]}>
              Achievements
            </Text>
            <Text style={[styles.achCount, { color: theme.textSecondary }]}>
              {unlockedCount}/{achievements.length}
            </Text>
          </View>
          <View style={styles.achGrid}>
            {achievements.map((ach) => (
              <View
                key={ach.id}
                style={[
                  styles.achTile,
                  {
                    backgroundColor: ach.unlocked ? theme.primarySoft : theme.surfaceMuted,
                    borderColor: ach.unlocked ? theme.primary : "transparent",
                  },
                ]}
              >
                <Text style={[styles.achEmoji, { opacity: ach.unlocked ? 1 : 0.3 }]}>{ach.emoji}</Text>
                <Text
                  style={[
                    styles.achTitle,
                    {
                      color: ach.unlocked ? theme.text : theme.textMuted,
                      fontFamily: typography.family.semibold,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {ach.title}
                </Text>
                <Text style={[styles.achGoal, { color: theme.textSecondary }]}>
                  {ach.unlocked ? "Unlocked" : `${ach.count} sessions`}
                </Text>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: 140 },
  streak: { fontSize: typography.size.base },
  heroCard: { marginBottom: spacing.lg, alignItems: "center", gap: spacing.xs },
  heroLabel: { fontSize: 11, letterSpacing: 1.5 },
  heroValue: { fontSize: typography.size["4xl"] },
  heroSub: { fontSize: typography.size.sm },
  statsRow: { flexDirection: "row", gap: spacing.md, marginBottom: spacing.lg },
  statCard: { flex: 1, alignItems: "center" },
  statNum: { fontSize: typography.size["3xl"], marginBottom: spacing.xs },
  statLabel: { fontSize: typography.size.xs, textAlign: "center" },
  cardTitle: { fontSize: typography.size.base, marginBottom: spacing.lg },
  achHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  achCount: { fontSize: typography.size.sm },
  achGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  achTile: {
    width: "31%",
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: "center",
    gap: 4,
  },
  achEmoji: { fontSize: 28 },
  achTitle: { fontSize: typography.size.xs, textAlign: "center" },
  achGoal: { fontSize: 10, textAlign: "center" },
});
