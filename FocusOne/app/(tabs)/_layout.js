import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import FloatingTabBar from "../../src/components/ui/FloatingTabBar";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, focused, size }) => {
          const iconMap = {
            index: focused ? "home" : "home-outline",
            goals: focused ? "flag" : "flag-outline",
            progress: focused ? "stats-chart" : "stats-chart-outline",
            settings: focused ? "settings" : "settings-outline",
          };
          return <Ionicons name={iconMap[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="goals" options={{ title: "Goals" }} />
      <Tabs.Screen name="progress" options={{ title: "Progress" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
