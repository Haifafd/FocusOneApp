import { useState } from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { typography, spacing, radius } from "../../theme";

export default function Input({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, error, multiline, style, ...rest }) {
  const { theme } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrap, style]}>
      {label && <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textMuted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.input,
          multiline && { minHeight: 100, textAlignVertical: "top" },
          {
            backgroundColor: theme.surface,
            color: theme.text,
            borderColor: error ? theme.danger : focused ? theme.primary : theme.border,
            fontFamily: typography.family.regular,
          },
        ]}
        {...rest}
      />
      {error && <Text style={[styles.err, { color: theme.danger }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  label: { fontSize: typography.size.sm, fontFamily: typography.family.medium, marginBottom: spacing.xs },
  input: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg, borderRadius: radius.md, borderWidth: 1.5, fontSize: typography.size.base, minHeight: 50 },
  err: { fontSize: typography.size.xs, marginTop: spacing.xs },
});
