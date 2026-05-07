import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useTheme } from "../../src/contexts/ThemeContext";
import { useHaptics } from "../../src/hooks/useHaptics";
import Button from "../../src/components/ui/Button";
import ProgressRing from "../../src/components/ui/ProgressRing";
import { typography, spacing } from "../../src/theme";

export default function Welcome() {
  const { theme } = useTheme();
  const router = useRouter();
  const haptics = useHaptics();

  const goRegister = () => {
    haptics.selection();
    router.push("/(auth)/register");
  };
  const goLogin = () => {
    haptics.selection();
    router.push("/(auth)/login");
  };

  const gradientColors =
    theme.mode === "dark"
      ? [theme.background, "rgba(99, 102, 241, 0.18)", theme.background]
      : ["#EEF2FF", theme.background, "#FAF5FF"];

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <LinearGradient colors={gradientColors} style={StyleSheet.absoluteFill} locations={[0, 0.55, 1]} />
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <View style={styles.content}>
          <View style={styles.brand}>
            <ProgressRing
              progress={100}
              size={180}
              strokeWidth={14}
              label="F"
              sublabel="FocusOne"
            />
          </View>

          <View style={styles.heading}>
            <Text style={[styles.title, { color: theme.text, fontFamily: typography.family.extrabold }]}>
              One goal at a time.
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Cut the noise. Focus on what matters today.
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button title="Get Started" size="lg" onPress={goRegister} />
          <Button
            title="I already have an account"
            variant="ghost"
            onPress={goLogin}
            style={{ marginTop: spacing.sm }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  content: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.xl, gap: spacing["2xl"] },
  brand: { alignItems: "center", justifyContent: "center" },
  heading: { alignItems: "center", gap: spacing.sm },
  title: { fontSize: typography.size["3xl"], textAlign: "center" },
  subtitle: { fontSize: typography.size.base, textAlign: "center", maxWidth: 320, lineHeight: 22 },
  actions: { paddingHorizontal: spacing.xl, paddingBottom: spacing.lg, gap: spacing.sm },
});
