import { Pressable, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { typography, spacing, radius } from "../../theme";

export default function Button({
  title,
  onPress,
  variant = "primary", // 'primary' | 'secondary' | 'outline'
  loading = false,
  disabled = false,
  style,
}) {
  const { theme } = useTheme();

  // تحديد ألوان الزر حسب النوع
  const getStyles = () => {
    switch (variant) {
      case "secondary":
        return {
          background: theme.surface,
          textColor: theme.text,
          border: "transparent",
        };
      case "outline":
        return {
          background: "transparent",
          textColor: theme.primary,
          border: theme.primary,
        };
      default: // primary
        return {
          background: theme.primary,
          textColor: "#FFFFFF",
          border: "transparent",
        };
    }
  };

  const colors = getStyles();
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
          opacity: isDisabled ? 0.5 : pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.textColor} />
      ) : (
        <Text style={[styles.text, { color: colors.textColor }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  text: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
  },
});