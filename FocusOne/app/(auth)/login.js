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
import { router } from 'expo-router';

// لما تخلص اللوقن
const handleLogin = async () => {
  // كال الـ API...
  router.replace('/(tabs)/'); // يروح للتابس ومايرجع للـ login
};
export default function LoginScreen() {
  const { theme } = useTheme();
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Simple validation
  const validate = () => {
    const newErrors = {};
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

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);

    const result = await login({ email, password });

    setLoading(false);

    if (result.success) {
      router.replace("/Homescreen");
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
            <Text style={[styles.title, { color: theme.text }]}>Log In</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Don&apos;t have an account?{" "}
              <Text
                style={{ color: theme.primary, fontWeight: "600" }}
                onPress={() => router.push("/(auth)/register")}
              >
                Sign up now
              </Text>
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
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
              title="Login"
              onPress={handleLogin}
              loading={loading}
              style={{ marginTop: spacing.lg }}
            />

            <Pressable
              onPress={() => router.push("/(auth)/register")}
              style={styles.linkContainer}
            >
              <Text style={[styles.link, { color: theme.primary }]}>
                Create a new account
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