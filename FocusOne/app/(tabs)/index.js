import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useTheme } from "../../src/contexts/ThemeContext";
import { useAuth } from "../../src/contexts/AuthContext";
import { useGoals } from "../../src/contexts/GoalsContext";
import { useSessions } from "../../src/contexts/SessionsContext";
import { useSettings } from "../../src/contexts/SettingsContext";
import { fetchQuote } from "../../src/services/quotes";
import { greeting } from "../../src/utils/format";
import Header from "../../src/components/ui/Header";
import Card from "../../src/components/ui/Card";
import Button from "../../src/components/ui/Button";
import ProgressBar from "../../src/components/ui/ProgressBar";
import EmptyState from "../../src/components/ui/EmptyState";
import { typography, spacing, radius } from "../../src/theme";

export default function Home() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { goals, computeProgress } = useGoals();
  const { currentStreak } = useSessions();
  const { settings } = useSettings();
  const router = useRouter();
  const [quote, setQuote] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchQuote().then((q) => {
      if (!cancelled) setQuote(q);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const displayName = user?.name || user?.email?.split("@")[0] || "there";
  const streakBadge = currentStreak > 0 ? `🔥 ${currentStreak}` : "";

  if (goals.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Header
          title=""
          right={streakBadge ? <Text style={[styles.streak, { color: theme.warning }]}>{streakBadge}</Text> : null}
        />
        <EmptyState
          icon="flag-outline"
          title={`${greeting()}, ${displayName} 👋`}
          subtitle="Create your first goal to start focusing on what matters today."
          ctaLabel="Create Goal"
          onCta={() => router.push("/goal/new")}
        />
      </View>
    );
  }

  const currentGoal = goals[0];
  const progress = computeProgress(currentGoal);
  const incompleteTasks = currentGoal.tasks?.filter((t) => !t.completed) || [];
  const currentTask = incompleteTasks[0] || currentGoal.tasks?.[0];
  const focusDuration = currentTask?.duration || settings.defaultDuration;

  const startFocus = () => {
    const taskId = currentTask?.id || "quick";
    router.push({ pathname: "/focus/[taskId]", params: { taskId, duration: String(focusDuration) } });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title=""
        right={streakBadge ? <Text style={[styles.streak, { color: theme.warning }]}>{streakBadge}</Text> : null}
      />

      <Animated.ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400).delay(0)}>
          <Text style={[styles.greeting, { color: theme.text, fontFamily: typography.family.bold }]}>
            {greeting()}, {displayName} 👋
          </Text>
          <Text style={[styles.sub, { color: theme.textSecondary }]}>Focus on one thing today.</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(100)}>
          <Card variant="elevated" padding="lg" style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.dot, { backgroundColor: theme.primary }]} />
              <Text style={[styles.cardTitle, { color: theme.text, fontFamily: typography.family.semibold }]} numberOfLines={1}>
                {currentGoal.title}
              </Text>
            </View>
            <View style={styles.progressRow}>
              <Text style={{ color: theme.textSecondary, fontSize: typography.size.sm }}>Progress</Text>
              <Text style={{ color: theme.primary, fontFamily: typography.family.bold, fontSize: typography.size.sm }}>
                {progress}%
              </Text>
            </View>
            <ProgressBar progress={progress} />
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(200)}>
          <Card variant="elevated" padding="lg" style={styles.card}>
            <Text style={[styles.taskName, { color: theme.text, fontFamily: typography.family.bold }]}>
              {currentTask?.title || "No tasks"}
            </Text>
            <Text style={[styles.taskMeta, { color: theme.textSecondary }]}>
              {incompleteTasks.length} {incompleteTasks.length === 1 ? "task" : "tasks"} remaining • {focusDuration} min focus
            </Text>
            <Button title="Start Focus" size="lg" onPress={startFocus} style={{ width: "100%" }} />
          </Card>
        </Animated.View>

        {!!quote && (
          <Animated.View entering={FadeInDown.duration(400).delay(300)}>
            <View style={[styles.quoteCard, { backgroundColor: theme.primarySoft }]}>
              <Text style={[styles.quoteText, { color: theme.primaryDark, fontFamily: typography.family.medium }]}>
                💡  &ldquo;{quote}&rdquo;
              </Text>
            </View>
          </Animated.View>
        )}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: 120, gap: spacing.md },
  streak: { fontSize: typography.size.base, fontWeight: "700" },
  greeting: { fontSize: typography.size["2xl"] },
  sub: { fontSize: typography.size.sm, marginTop: spacing.xs, marginBottom: spacing.md },
  card: { gap: spacing.md },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  dot: { width: 10, height: 10, borderRadius: 5 },
  cardTitle: { flex: 1, fontSize: typography.size.base },
  progressRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  taskName: { fontSize: typography.size.xl, marginBottom: spacing.xs },
  taskMeta: { fontSize: typography.size.sm, marginBottom: spacing.lg },
  quoteCard: { padding: spacing.lg, borderRadius: radius.lg },
  quoteText: { fontSize: typography.size.sm, fontStyle: "italic", lineHeight: 22, textAlign: "center" },
});
