import { memo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { typography, spacing } from "../../theme";

function SettingItem({ icon, label, rightElement, onPress, last, labelColor }) {
  const { theme } = useTheme();
  const Container = onPress ? Pressable : View;
  return (
    <Container
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        !last && { borderBottomColor: theme.border, borderBottomWidth: StyleSheet.hairlineWidth },
        pressed && onPress ? { backgroundColor: theme.surfaceMuted } : null,
      ]}
    >
      <View style={styles.left}>
        {icon && <Ionicons name={icon} size={20} color={labelColor || theme.text} style={styles.icon} />}
        <Text style={[styles.label, { color: labelColor || theme.text, fontFamily: typography.family.medium }]}>
          {label}
        </Text>
      </View>
      <View style={styles.right}>{rightElement}</View>
    </Container>
  );
}

export default memo(SettingItem);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 56,
  },
  left: { flexDirection: "row", alignItems: "center", flex: 1 },
  icon: { marginRight: spacing.md },
  label: { fontSize: typography.size.base },
  right: { flexDirection: "row", alignItems: "center" },
});
