import { Pressable, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { typography, spacing, radius, shadows } from "../../theme";

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  style,
}) {
  const { theme } = useTheme();
  const isDisabled = disabled || loading;

  const variantStyles = {
    primary:   { bg: theme.primary, text: theme.onPrimary, border: "transparent", shadow: shadows.sm },
    secondary: { bg: theme.surfaceMuted, text: theme.text, border: "transparent", shadow: null },
    outline:   { bg: "transparent", text: theme.primary, border: theme.primary, shadow: null },
    ghost:     { bg: "transparent", text: theme.primary, border: "transparent", shadow: null },
    danger:    { bg: theme.danger, text: "#fff", border: "transparent", shadow: shadows.sm },
  }[variant];

  const sizeStyles = {
    sm: { paddingV: spacing.sm, paddingH: spacing.lg, fontSize: typography.size.sm, minHeight: 38 },
    md: { paddingV: spacing.md, paddingH: spacing.xl, fontSize: typography.size.base, minHeight: 50 },
    lg: { paddingV: spacing.lg, paddingH: spacing["2xl"], fontSize: typography.size.lg, minHeight: 58 },
  }[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.btn,
        variantStyles.shadow,
        {
          backgroundColor: variantStyles.bg,
          borderColor: variantStyles.border,
          paddingVertical: sizeStyles.paddingV,
          paddingHorizontal: sizeStyles.paddingH,
          minHeight: sizeStyles.minHeight,
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
          transform: [{ scale: pressed && !isDisabled ? 0.98 : 1 }],
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.text} />
      ) : (
        <>
          {icon}
          <Text style={{ color: variantStyles.text, fontSize: sizeStyles.fontSize, fontFamily: typography.family.semibold }}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { borderRadius: radius.lg, borderWidth: 1.5, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
});
