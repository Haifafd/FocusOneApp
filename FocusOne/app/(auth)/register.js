import { useState } from "react";
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
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { typography, spacing } from "../../constants/typography";

export default function RegisterScreen() {
  const { theme } = useTheme();
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name is too short";
    }
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);

    const result = await register({ name, email, password });

    setLoading(false);

    if (result.success) {
      router.replace("/(tabs)/home");
    } else {
      setErrors({ general: result.error });
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
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>
              Create Account
            </Text>
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

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Name"
              placeholder="Your full name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors({ ...errors, name: null });
                if (errors.general) setErrors({ ...errors, general: null });
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
                if (errors.general) setErrors({ ...errors, general: null });
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
                if (errors.general) setErrors({ ...errors, general: null });
              }}
              secureTextEntry
              error={errors.password}
            />

            {/* General error message */}
            {errors.general && (
              <Text
                style={[
                  styles.generalError,
                  { color: theme.danger },
                ]}
              >
                {errors.general}
              </Text>
            )}

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={loading}
              style={{ marginTop: spacing.lg }}
            />

            <Pressable
              onPress={() => router.push("/(auth)/login")}
              style={styles.linkContainer}
            >
              <Text style={[styles.link, { color: theme.primary }]}>
                Back to login
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.xl,
  },
  header: {
    marginBottom: spacing["2xl"],
  },
  title: {
    fontSize: typography.size["3xl"],
    fontWeight: typography.weight.bold,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.size.sm,
  },
  form: {
    width: "100%",
  },
  generalError: {
    fontSize: typography.size.sm,
    textAlign: "center",
    marginTop: spacing.sm,
    fontWeight: typography.weight.medium,
  },
  linkContainer: {
    marginTop: spacing.lg,
    alignItems: "center",
  },
  link: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
});