import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { typography, spacing } from "../../theme";
import Button from "./Button";

export default function EmptyState({ icon = "document-outline", title, subtitle, ctaLabel, onCta }) {
  const { theme } = useTheme();
  return (
    <View style={styles.wrap}>
      <View style={[styles.iconWrap, { backgroundColor: theme.primarySoft }]}>
        <Ionicons name={icon} size={36} color={theme.primary} />
      </View>
      <Text style={[styles.title, { color: theme.text, fontFamily: typography.family.bold }]}>{title}</Text>
      {subtitle && <Text style={[styles.sub, { color: theme.textSecondary }]}>{subtitle}</Text>}
      {ctaLabel && onCta && <Button title={ctaLabel} onPress={onCta} style={{ marginTop: spacing.lg, minWidth: 200 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing["2xl"] },
  iconWrap: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center", marginBottom: spacing.lg },
  title: { fontSize: typography.size.xl, marginBottom: spacing.sm, textAlign: "center" },
  sub: { fontSize: typography.size.sm, textAlign: "center", lineHeight: 20, maxWidth: 280 },
});
