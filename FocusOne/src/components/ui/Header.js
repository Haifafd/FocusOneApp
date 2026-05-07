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
  return (
    <View style={[styles.wrap, { paddingTop: insets.top + spacing.sm, backgroundColor: theme.background, borderBottomColor: theme.border }]}>
      <View style={styles.left}>
        {showBack && (
          <Pressable onPress={() => router.back()} hitSlop={10}>
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
  wrap: { flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth },
  left: { width: 40 },
  right: { width: 40, alignItems: "flex-end" },
  title: { flex: 1, fontSize: typography.size.lg, textAlign: "center" },
});
