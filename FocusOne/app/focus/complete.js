import { useMemo, useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { ZoomIn, FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "../../src/contexts/ThemeContext";
import { useSessions } from "../../src/contexts/SessionsContext";
import { useNotes } from "../../src/contexts/NotesContext";
import { useToast } from "../../src/contexts/ToastContext";
import { useHaptics } from "../../src/hooks/useHaptics";
import { milestoneAt } from "../../src/utils/achievements";
import Button from "../../src/components/ui/Button";
import Input from "../../src/components/ui/Input";
import { typography, spacing, radius } from "../../src/theme";

export default function FocusComplete() {
  const { theme } = useTheme();
  const router = useRouter();
  const { duration, taskTitle } = useLocalSearchParams();
  const { sessions, currentStreak } = useSessions();
  const { addNote } = useNotes();
  const { show: toast } = useToast();
  const haptics = useHaptics();

  const minutes = duration || "25";
  const streakLabel = `${currentStreak} ${currentStreak === 1 ? "Day" : "Days"}`;
  const taskName = taskTitle || "Focus Session";

  // Find a milestone that was just unlocked at the current session count.
  const milestone = useMemo(() => milestoneAt(sessions.length), [sessions.length]);

  const [reflection, setReflection] = useState("");
  const [saving, setSaving] = useState(false);

  const saveReflection = async () => {
    if (!reflection.trim()) {
      router.replace("/(tabs)");
      return;
    }
    setSaving(true);
    await addNote({
      title: `${taskName} · ${minutes}m`,
      content: reflection.trim(),
    });
    haptics.success();
    toast({ type: "success", message: "Reflection saved" });
    router.replace("/(tabs)");
  };

  const skip = () => {
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            entering={ZoomIn.duration(450)}
            style={[styles.checkCircle, { backgroundColor: theme.primary }]}
          >
            <Ionicons name="checkmark" size={56} color={theme.onPrimary} />
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.heading}>
            <Text style={[styles.title, { color: theme.text, fontFamily: typography.family.bold }]}>
              Session Complete
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Great work! You finished your focus session.
            </Text>
          </Animated.View>

          {milestone && (
            <Animated.View
              entering={FadeInDown.duration(450).delay(280)}
              style={[styles.milestone, { backgroundColor: theme.primarySoft, borderColor: theme.primary }]}
            >
              <Text style={styles.milestoneEmoji}>{milestone.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.milestoneTitle, { color: theme.primaryDark, fontFamily: typography.family.bold }]}>
                  Achievement unlocked!
                </Text>
                <Text style={[styles.milestoneSub, { color: theme.text, fontFamily: typography.family.semibold }]}>
                  {milestone.title} · {milestone.count} sessions
                </Text>
              </View>
            </Animated.View>
          )}

          <Animated.View entering={FadeInDown.duration(400).delay(300)} style={styles.statsRow}>
            <View style={[styles.statBox, { backgroundColor: theme.surfaceMuted }]}>
              <Text style={[styles.statLabel, { color: theme.textSecondary, fontFamily: typography.family.semibold }]}>
                DURATION
              </Text>
              <Text style={[styles.statValue, { color: theme.primary, fontFamily: typography.family.extrabold }]}>
                {minutes}:00
              </Text>
            </View>

            <View style={[styles.statBox, { backgroundColor: theme.surfaceMuted }]}>
              <Text style={[styles.statLabel, { color: theme.textSecondary, fontFamily: typography.family.semibold }]}>
                STREAK
              </Text>
              <Text style={[styles.statValue, { color: theme.warning, fontFamily: typography.family.extrabold }]}>
                {streakLabel}
              </Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(380)} style={styles.reflectCard}>
            <View style={styles.reflectHeader}>
              <Ionicons name="sparkles-outline" size={18} color={theme.primary} />
              <Text style={[styles.reflectTitle, { color: theme.text, fontFamily: typography.family.bold }]}>
                Reflect on this session
              </Text>
            </View>
            <Text style={[styles.reflectHint, { color: theme.textSecondary }]}>
              Optional · Saves as a note you can revisit later.
            </Text>
            <Input
              placeholder="What did you accomplish?"
              value={reflection}
              onChangeText={setReflection}
              multiline
            />
          </Animated.View>
        </ScrollView>

        <View style={styles.actions}>
          <Button
            title={reflection.trim() ? "Save Reflection" : "Done"}
            size="lg"
            loading={saving}
            onPress={saveReflection}
          />
          {reflection.trim().length > 0 && (
            <Button title="Skip" variant="ghost" onPress={skip} style={{ marginTop: spacing.xs }} />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: spacing.xl, alignItems: "center", gap: spacing.lg, paddingBottom: spacing.lg },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.lg,
  },
  heading: { alignItems: "center", gap: spacing.xs },
  title: { fontSize: typography.size["2xl"] },
  subtitle: { fontSize: typography.size.base, textAlign: "center", maxWidth: 300, lineHeight: 22 },
  milestone: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    width: "100%",
  },
  milestoneEmoji: { fontSize: 36 },
  milestoneTitle: { fontSize: typography.size.xs, letterSpacing: 1.2, marginBottom: 2 },
  milestoneSub: { fontSize: typography.size.base },
  statsRow: { flexDirection: "row", gap: spacing.md, width: "100%" },
  statBox: { flex: 1, padding: spacing.lg, borderRadius: radius.lg, alignItems: "center", gap: spacing.xs },
  statLabel: { fontSize: 10, letterSpacing: 1.2 },
  statValue: { fontSize: typography.size.xl },
  reflectCard: { width: "100%" },
  reflectHeader: { flexDirection: "row", alignItems: "center", gap: spacing.xs, marginBottom: spacing.xs },
  reflectTitle: { fontSize: typography.size.base },
  reflectHint: { fontSize: typography.size.xs, marginBottom: spacing.sm },
  actions: { paddingHorizontal: spacing.xl, paddingBottom: spacing.lg, gap: 0 },
});
