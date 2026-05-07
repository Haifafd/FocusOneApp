import { Stack } from "expo-router";

export default function FocusLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, presentation: "modal", animation: "slide_from_bottom" }}>
      <Stack.Screen name="[taskId]" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}
