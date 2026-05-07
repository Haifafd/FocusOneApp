import { useState, useMemo } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../src/contexts/ThemeContext";
import { useAuth } from "../../src/contexts/AuthContext";
import { useToast } from "../../src/contexts/ToastContext";
import { useHaptics } from "../../src/hooks/useHaptics";
import { passwordIssues, isValidEmail } from "../../src/utils/validation";
import Input from "../../src/components/ui/Input";
import Button from "../../src/components/ui/Button";
import { typography, spacing } from "../../src/theme";

const PASSWORD_RULES = ["At least 8 characters", "One uppercase letter", "One number"];

export default function RegisterScreen() {
  const { theme } = useTheme();
  const { register } = useAuth();
  const { show: toast } = useToast();
  const haptics = useHaptics();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const issues = useMemo(() => passwordIssues(password), [password]);
  const passwordsMatch = password === confirmPassword;
  const submitDisabled = issues.length > 0 || !passwordsMatch || !name.trim() || !email.trim();

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    else if (name.trim().length < 2) newErrors.name = "Name is too short";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!isValidEmail(email)) newErrors.email = "Please enter a valid email";
    if (issues.length > 0) newErrors.password = "Password does not meet requirements";
    if (!passwordsMatch) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) {
      haptics.error();
      return;
    }
    setLoading(true);
    const result = await register({ name, email, password });
    setLoading(false);

    if (result.success) {
      haptics.success();
      toast({ type: "success", message: "Account created!" });
      router.replace("/(tabs)");
    } else {
      haptics.error();
      toast({ type: "error", message: result.error });
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Already have an account?{" "}
              <Text
                style={{ color: theme.primary, fontWeight: "600" }}
                onPress={() => router.push("/(auth)/login")}
              >
                Log in
              </Text>
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Name"
              placeholder="Your full name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors({ ...errors, name: null });
              }}
              error={errors.name}
            />

            <Input
              label="Email"
              placeholder="example@email.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              keyboardType="email-address"
              error={errors.email}
            />

            <Input
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              secureTextEntry
              error={errors.password}
            />

            {password.length > 0 && (
              <View style={styles.rules}>
                {PASSWORD_RULES.map((rule) => {
                  const unmet = issues.includes(rule);
                  return (
                    <Text
                      key={rule}
                      style={[styles.ruleText, { color: unmet ? theme.danger : theme.success }]}
                    >
                      {unmet ? "○" : "✓"}  {rule}
                    </Text>
                  );
                })}
              </View>
            )}

            <Input
              label="Confirm Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
              }}
              secureTextEntry
              error={errors.confirmPassword}
            />

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={loading}
              disabled={submitDisabled}
              style={{ marginTop: spacing.lg }}
            />

            <Pressable
              onPress={() => router.push("/(auth)/login")}
              style={styles.linkContainer}
            >
              <Text style={[styles.link, { color: theme.primary }]}>Back to login</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flexGrow: 1, justifyContent: "center", padding: spacing.xl },
  header: { marginBottom: spacing["2xl"] },
  title: { fontSize: typography.size["3xl"], fontWeight: typography.weight.bold, marginBottom: spacing.xs },
  subtitle: { fontSize: typography.size.sm },
  form: { width: "100%" },
  rules: { marginTop: -spacing.sm, marginBottom: spacing.md, paddingHorizontal: spacing.xs },
  ruleText: { fontSize: typography.size.xs, marginBottom: 2 },
  linkContainer: { marginTop: spacing.lg, alignItems: "center" },
  link: { fontSize: typography.size.sm, fontWeight: typography.weight.medium },
});
