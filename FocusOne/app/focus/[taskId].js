import { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet, Modal, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "../../src/contexts/ThemeContext";
import { useGoals } from "../../src/contexts/GoalsContext";
import { useSessions } from "../../src/contexts/SessionsContext";
import { useSettings } from "../../src/contexts/SettingsContext";
import { useHaptics } from "../../src/hooks/useHaptics";
import { useTimer } from "../../src/hooks/useTimer";
import { fetchQuote } from "../../src/services/quotes";
import Header from "../../src/components/ui/Header";
import Button from "../../src/components/ui/Button";
import ProgressRing from "../../src/components/ui/ProgressRing";
import { typography, spacing, radius } from "../../src/theme";

const DURATION_OPTIONS = [5, 15, 25, 45, 60];

export default function FocusSession() {
  const router = useRouter();
  const { taskId, duration: durationParam } = useLocalSearchParams();
  const { theme } = useTheme();
  const { goals } = useGoals();
  const { addSession } = useSessions();
  const { settings } = useSettings();
  const haptics = useHaptics();

  const initialDuration = Number(durationParam) || settings.defaultDuration;
  const [duration, setDuration] = useState(initialDuration);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [quote, setQuote] = useState("");

  const task = useMemo(() => {
    if (taskId === "quick" || !taskId) {
      return { id: null, title: "Quick Focus", goalId: null };
    }
    for (const g of goals) {
      const t = g.tasks?.find((tt) => tt.id === taskId);
      if (t) return { ...t, goalId: g.id };
    }
    return { id: taskId, title: "Focus Session", goalId: null };
  }, [goals, taskId]);

  const onComplete = async () => {
    haptics.success();
    await addSession({
      taskId: task.id,
      goalId: task.goalId,
      durationMinutes: duration,
    });
    router.replace({
      pathname: "/focus/complete",
      params: {
        duration: String(duration),
        taskTitle: task.title || "Focus Session",
      },
    });
  };

  const timer = useTimer({ totalSeconds: duration * 60, onComplete });

  // Ambient breathing animation behind the timer ring.
  const breath = useSharedValue(0.85);
  useEffect(() => {
    if (timer.isRunning) {
      breath.value = withRepeat(
        withTiming(1.05, { duration: 4000, easing: Easing.inOut(Easing.quad) }),
        -1,
        true
      );
    } else {
      breath.value = withTiming(0.9, { duration: 600 });
    }
  }, [timer.isRunning, breath]);

  const breathStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breath.value }],
    opacity: 0.55 + (breath.value - 0.9) * 1.2,
  }));

  useEffect(() => {
    fetchQuote().then(setQuote);
  }, []);

  const onPrimary = () => {
    if (timer.isRunning) {
      timer.pause();
      haptics.light();
    } else if (timer.isPaused) {
      timer.resume();
      haptics.light();
    } else {
      timer.start();
      haptics.light();
    }
  };

  const onStop = () => {
    if (!timer.isRunning && !timer.isPaused) {
      router.back();
      return;
    }
    Alert.alert("Stop session?", "Your progress for this session will be lost.", [
      { text: "Keep going", style: "cancel" },
      {
        text: "Stop",
        style: "destructive",
        onPress: () => {
          timer.stop();
          router.back();
        },
      },
    ]);
  };

  const onBack = () => {
    if (timer.isRunning) {
      onStop();
    } else {
      router.back();
    }
  };

  const setDurationAndReset = (mins) => {
    setDuration(mins);
    setPickerOpen(false);
    haptics.selection();
  };

  const primaryLabel = timer.isRunning ? "Pause" : timer.isPaused ? "Resume" : "Start";
  const ambientColors =
    theme.mode === "dark"
      ? ["rgba(99, 102, 241, 0.28)", "rgba(99, 102, 241, 0)"]
      : ["rgba(99, 102, 241, 0.22)", "rgba(99, 102, 241, 0)"];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View style={[styles.ambient, breathStyle]} pointerEvents="none">
        <LinearGradient
          colors={ambientColors}
          style={styles.ambientGradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </Animated.View>

      <Header
        title=""
        right={
          <Pressable onPress={onBack} hitSlop={10}>
            <Text style={[styles.cancelText, { color: theme.textSecondary, fontFamily: typography.family.medium }]}>
              Cancel
            </Text>
          </Pressable>
        }
      />

      <View style={styles.content}>
        <Text style={[styles.label, { color: theme.textSecondary, fontFamily: typography.family.semibold }]}>
          FOCUS SESSION
        </Text>
        <Text style={[styles.title, { color: theme.text, fontFamily: typography.family.bold }]}>
          {task.title}
        </Text>

        <Pressable onPress={() => !timer.isRunning && setPickerOpen(true)} style={styles.ringWrap}>
          <ProgressRing
            progress={timer.progress}
            size={260}
            strokeWidth={12}
            label={`${timer.minutes}:${timer.seconds}`}
            sublabel={timer.isRunning || timer.isPaused ? "" : "Tap to set time"}
          />
        </Pressable>

        {!!quote && (
          <Text style={[styles.quote, { color: theme.textSecondary }]} numberOfLines={3}>
            &ldquo;{quote}&rdquo;
          </Text>
        )}

        <View style={styles.actions}>
          <Button title={primaryLabel} size="lg" onPress={onPrimary} style={{ minWidth: 200 }} />
          {(timer.isRunning || timer.isPaused) && (
            <Button title="Stop" variant="ghost" onPress={onStop} />
          )}
        </View>
      </View>

      <Modal visible={pickerOpen} transparent animationType="fade" onRequestClose={() => setPickerOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setPickerOpen(false)}>
          <View style={[styles.sheet, { backgroundColor: theme.card }]}>
            <Text style={[styles.sheetTitle, { color: theme.text, fontFamily: typography.family.bold }]}>
              Set Focus Duration
            </Text>
            {DURATION_OPTIONS.map((mins) => (
              <Pressable
                key={mins}
                onPress={() => setDurationAndReset(mins)}
                style={({ pressed }) => [
                  styles.option,
                  { borderBottomColor: theme.border },
                  pressed && { backgroundColor: theme.surfaceMuted },
                ]}
              >
                <Text style={[styles.optionText, { color: mins === duration ? theme.primary : theme.text }]}>
                  {mins} min
                </Text>
                {mins === duration && (
                  <Text style={{ color: theme.primary, fontFamily: typography.family.bold }}>✓</Text>
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  ambient: { position: "absolute", top: 60, left: -40, right: -40, height: 460, alignItems: "center", justifyContent: "center" },
  ambientGradient: { width: "100%", height: "100%", borderRadius: 999 },
  content: { flex: 1, alignItems: "center", paddingHorizontal: spacing.xl, paddingTop: spacing.lg, gap: spacing.lg },
  cancelText: { fontSize: typography.size.sm },
  label: { fontSize: typography.size.xs, letterSpacing: 1.5 },
  title: { fontSize: typography.size["2xl"], textAlign: "center" },
  ringWrap: { marginTop: spacing.lg },
  quote: { fontSize: typography.size.sm, fontStyle: "italic", textAlign: "center", paddingHorizontal: spacing.md, lineHeight: 22 },
  actions: { alignItems: "center", gap: spacing.sm, marginTop: "auto", paddingBottom: spacing.xl },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  sheet: { borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing.lg, paddingBottom: spacing["2xl"] },
  sheetTitle: { fontSize: typography.size.lg, marginBottom: spacing.md, textAlign: "center" },
  option: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: spacing.md, paddingHorizontal: spacing.lg, borderBottomWidth: StyleSheet.hairlineWidth },
  optionText: { fontSize: typography.size.base },
});
