import { View, StyleSheet } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { spacing, radius, shadows } from "../../theme";

export default function Card({ children, variant = "elevated", padding = "lg", style }) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.card,
        variant === "elevated" ? shadows.md : null,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          borderWidth: variant === "outlined" ? 1 : 0,
          padding: spacing[padding],
          shadowColor: theme.shadow,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({ card: { borderRadius: radius.lg } });
