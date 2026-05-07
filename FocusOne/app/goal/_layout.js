import { Stack } from "expo-router";

export default function GoalLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, presentation: "modal", animation: "slide_from_bottom" }}>
      <Stack.Screen name="new" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
