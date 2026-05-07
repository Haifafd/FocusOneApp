import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { ZoomIn, FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "../../src/contexts/ThemeContext";
import { useSessions } from "../../src/contexts/SessionsContext";
import Button from "../../src/components/ui/Button";
import { typography, spacing, radius } from "../../src/theme";

export default function FocusComplete() {
  const { theme } = useTheme();
  const router = useRouter();
  const { duration } = useLocalSearchParams();
  const { currentStreak } = useSessions();

  const minutes = duration || "25";
  const streakLabel = `${currentStreak} ${currentStreak === 1 ? "Day" : "Days"}`;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={["top", "bottom"]}>
      <View style={styles.content}>
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
      </View>

      <View style={styles.actions}>
        <Button title="📝  Add a Note" size="lg" onPress={() => router.replace("/note/new")} />
        <Button
          title="🏠  Back to Home"
          variant="outline"
          onPress={() => router.replace("/(tabs)")}
          style={{ marginTop: spacing.sm }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl, gap: spacing["2xl"] },
  checkCircle: { width: 110, height: 110, borderRadius: 55, alignItems: "center", justifyContent: "center" },
  heading: { alignItems: "center", gap: spacing.sm },
  title: { fontSize: typography.size["2xl"] },
  subtitle: { fontSize: typography.size.base, textAlign: "center", maxWidth: 300, lineHeight: 22 },
  statsRow: { flexDirection: "row", gap: spacing.md, width: "100%" },
  statBox: { flex: 1, padding: spacing.lg, borderRadius: radius.lg, alignItems: "center", gap: spacing.xs },
  statLabel: { fontSize: 10, letterSpacing: 1.2 },
  statValue: { fontSize: typography.size.xl },
  actions: { paddingHorizontal: spacing.xl, paddingBottom: spacing.lg, gap: spacing.sm },
});
