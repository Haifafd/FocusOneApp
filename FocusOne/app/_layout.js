import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import { AuthProvider } from "../contexts/AuthContext";
import { AppProvider } from "../contexts/AppContext"; // ← أضفناه هنا

function RootLayoutNav() {
  const { theme, activeMode } = useTheme();

  return (
    <>
      <StatusBar style={activeMode === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>   {/* ← هنا أهم خطوة */}
          <RootLayoutNav />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
