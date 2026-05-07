import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { typography, spacing, radius } from "../../theme";

export default function Section({ title, children, style }) {
  const { theme } = useTheme();
  return (
    <View style={[{ marginBottom: spacing.xl }, style]}>
      {title && <Text style={[styles.title, { color: theme.textSecondary, fontFamily: typography.family.semibold }]}>{title.toUpperCase()}</Text>}
      <View style={[styles.body, { backgroundColor: theme.card }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 11, letterSpacing: 1.2, marginBottom: spacing.sm, marginLeft: spacing.sm },
  body: { borderRadius: radius.lg, overflow: "hidden" },
});
