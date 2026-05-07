import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { typography, spacing } from "../../theme";

export default function Header({ title, showBack = false, right }) {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // Ensure a comfortable top inset even in modal screens where insets.top is 0.
  const topPadding = Math.max(insets.top, spacing.lg) + spacing.sm;
  return (
    <View style={[styles.wrap, { paddingTop: topPadding, backgroundColor: theme.background, borderBottomColor: theme.border }]}>
      <View style={styles.left}>
        {showBack && (
          <Pressable onPress={() => router.back()} hitSlop={20} style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={26} color={theme.text} />
          </Pressable>
        )}
      </View>
      <Text style={[styles.title, { color: theme.text, fontFamily: typography.family.bold }]} numberOfLines={1}>{title}</Text>
      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, minHeight: 56 },
  left: { width: 44, justifyContent: "center" },
  right: { width: 60, alignItems: "flex-end", justifyContent: "center" },
  iconBtn: { padding: 4 },
  title: { flex: 1, fontSize: typography.size.lg, textAlign: "center" },
});
