import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../src/contexts/AuthContext";
import { storage, STORAGE_KEYS } from "../src/services/storage";

export default function Index() {
  const { user, isLoaded: authLoaded } = useAuth();
  const [onboardingDone, setOnboardingDone] = useState(null);

  useEffect(() => {
    storage.get(STORAGE_KEYS.ONBOARDING_DONE).then((v) => setOnboardingDone(!!v));
  }, []);

  if (!authLoaded || onboardingDone === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (!onboardingDone) return <Redirect href="/(onboarding)" />;
  if (!user) return <Redirect href="/(auth)/welcome" />;
  return <Redirect href="/(tabs)" />;
}
