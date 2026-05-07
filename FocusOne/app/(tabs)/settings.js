import { Switch, ScrollView, View, Text, Alert, Linking, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import { useTheme } from "../../src/contexts/ThemeContext";
import { useAuth } from "../../src/contexts/AuthContext";
import { useSettings } from "../../src/contexts/SettingsContext";
import { useGoals } from "../../src/contexts/GoalsContext";
import { useSessions } from "../../src/contexts/SessionsContext";
import { useNotes } from "../../src/contexts/NotesContext";
import { useToast } from "../../src/contexts/ToastContext";
import { useHaptics } from "../../src/hooks/useHaptics";
import { storage } from "../../src/services/storage";
import Header from "../../src/components/ui/Header";
import Section from "../../src/components/ui/Section";
import SettingItem from "../../src/components/settings/SettingItem";
import { typography, spacing } from "../../src/theme";

const DURATION_OPTIONS = [15, 25, 45, 60];

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { settings, updateSettings, refresh: refreshSettings } = useSettings();
  const { refresh: refreshGoals } = useGoals();
  const { refresh: refreshSessions } = useSessions();
  const { refresh: refreshNotes } = useNotes();
  const { show: toast } = useToast();
  const haptics = useHaptics();
  const router = useRouter();

  const pickDuration = () => {
    haptics.selection();
    Alert.alert(
      "Default Focus Duration",
      "Pick how long focus sessions last by default.",
      [
        ...DURATION_OPTIONS.map((m) => ({
          text: `${m} min`,
          onPress: () => updateSettings({ defaultDuration: m }),
        })),
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const handleNotificationToggle = async () => {
    haptics.selection();
    if (!settings.notificationsEnabled) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        haptics.error();
        Alert.alert(
          "Permission Denied",
          "Notifications are required to remind you about focus sessions.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }
    }
    await updateSettings({ notificationsEnabled: !settings.notificationsEnabled });
  };

  const handleResetData = () => {
    haptics.heavy();
    Alert.alert("Reset Data", "Are you sure? This will delete all goals, sessions, and notes.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await storage.clear();
          await Promise.all([refreshGoals(), refreshSessions(), refreshNotes(), refreshSettings()]);
          toast({ type: "success", message: "Data reset" });
          router.replace("/(onboarding)");
        },
      },
    ]);
  };

  const handleLogout = () => {
    haptics.medium();
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/welcome");
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Settings" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Section title="General">
          <SettingItem
            icon="time-outline"
            label="Default Focus Duration"
            onPress={pickDuration}
            rightElement={
              <Text style={[styles.rightText, { color: theme.textSecondary }]}>
                {settings.defaultDuration} min
              </Text>
            }
          />
          <SettingItem
            icon="notifications-outline"
            label="Notifications"
            rightElement={
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor="#fff"
              />
            }
          />
          <SettingItem
            icon="moon-outline"
            label="Dark Mode"
            rightElement={
              <Switch
                value={theme.mode === "dark"}
                onValueChange={() => {
                  toggleTheme();
                  haptics.selection();
                }}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor="#fff"
              />
            }
          />
          <SettingItem
            icon="volume-high-outline"
            label="Sound"
            last
            rightElement={
              <Switch
                value={settings.soundEnabled}
                onValueChange={(v) => {
                  updateSettings({ soundEnabled: v });
                  haptics.selection();
                }}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor="#fff"
              />
            }
          />
        </Section>

        <Section title="My Stuff">
          <SettingItem
            icon="document-text-outline"
            label="My Notes"
            onPress={() => {
              haptics.selection();
              router.push("/note");
            }}
            rightElement={<Ionicons name="chevron-forward" size={18} color={theme.textMuted} />}
            last
          />
        </Section>

        <Section title="Data">
          <SettingItem
            icon="trash-outline"
            label="Reset Data"
            labelColor={theme.danger}
            onPress={handleResetData}
            last
          />
        </Section>

        <Section title="Account">
          <SettingItem
            icon="person-outline"
            label={user?.email || "Guest"}
            rightElement={
              <Text style={[styles.rightText, { color: theme.textMuted }]} numberOfLines={1}>
                Profile
              </Text>
            }
          />
          <SettingItem
            icon="log-out-outline"
            label="Logout"
            labelColor={theme.danger}
            onPress={handleLogout}
            last
          />
        </Section>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg, paddingTop: spacing.lg },
  rightText: { fontSize: typography.size.sm },
});
