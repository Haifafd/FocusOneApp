import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Linking,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../src/contexts/ThemeContext";
import { useAuth } from "../../src/contexts/AuthContext";
import { useSettings } from "../../src/contexts/SettingsContext";
import { useGoals } from "../../src/contexts/GoalsContext";
import { useSessions } from "../../src/contexts/SessionsContext";
import { useNotes } from "../../src/contexts/NotesContext";
import { storage } from "../../src/services/storage";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const { settings, updateSettings, refresh: refreshSettings } = useSettings();
  const { refresh: refreshGoals } = useGoals();
  const { refresh: refreshSessions } = useSessions();
  const { refresh: refreshNotes } = useNotes();
  const router = useRouter();

  const handleNotificationToggle = async () => {
    if (!settings.notificationsEnabled) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Notifications Enabled 🔔",
          body: "We will remind you of your next focus session.",
        },
        trigger: null,
      });
    }

    await updateSettings({ notificationsEnabled: !settings.notificationsEnabled });
  };

  const handleResetData = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert("Reset Data", "Are you sure you want to delete all focus data?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await storage.clear();
          await Promise.all([refreshGoals(), refreshSessions(), refreshNotes(), refreshSettings()]);
          Alert.alert("Success", "Data has been reset");
        },
      },
    ]);
  };

  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* GENERAL */}
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>GENERAL</Text>

          <View style={[styles.sectionCard, { backgroundColor: theme.card }]}>
            <SettingRow
              icon="⏱️"
              label="Default Focus Duration"
              rightElement={
                <Text style={[styles.rightText, { color: theme.textSecondary }]}>
                  {settings.defaultDuration} min  {">"}
                </Text>
              }
              theme={theme}
            />

            <SettingRow
              icon="🔔"
              label="Notifications"
              rightElement={
                <Switch
                  value={settings.notificationsEnabled}
                  onValueChange={handleNotificationToggle}
                  trackColor={{ false: theme.border, true: theme.primary }}
                  thumbColor="#fff"
                />
              }
              theme={theme}
            />

            <SettingRow
              icon="🌙"
              label="Dark Mode"
              last
              rightElement={
                <Switch
                  value={theme.mode === "dark"}
                  onValueChange={() => {
                    toggleTheme();
                    Haptics.selectionAsync();
                  }}
                  trackColor={{ false: theme.border, true: theme.primary }}
                  thumbColor="#fff"
                />
              }
              theme={theme}
            />
          </View>

          {/* DATA MANAGEMENT */}
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>DATA MANAGEMENT</Text>

          <View style={[styles.sectionCard, { backgroundColor: theme.card }]}>
            <TouchableOpacity onPress={handleResetData}>
              <SettingRow
                icon="🗑️"
                label="Reset Data"
                labelStyle={{ color: theme.danger || "#ff4444" }}
                last
                theme={theme}
              />
            </TouchableOpacity>
          </View>

          {/* ACCOUNT */}
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>ACCOUNT</Text>

          <View style={[styles.sectionCard, { backgroundColor: theme.card }]}>
            <TouchableOpacity onPress={handleLogout}>
              <SettingRow
                icon="🚪"
                label="Logout"
                labelStyle={{ color: theme.danger || "#ff4444" }}
                last
                theme={theme}
              />
            </TouchableOpacity>
          </View>

          <Text style={[styles.footerNote, { color: theme.textSecondary }]}>
            Resetting your data will permanently delete all tasks and focus history.
          </Text>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const SettingRow = ({ icon, label, rightElement, last, labelStyle, theme }) => (
  <View
    style={[styles.row, !last && { borderBottomColor: theme.border, borderBottomWidth: 1 }]}
  >
    <View style={styles.rowLeft}>
      <Text style={[styles.rowIcon, { color: theme.text }]}>{icon}</Text>
      <Text style={[styles.rowLabel, { color: theme.text }, labelStyle]}>{label}</Text>
    </View>
    {rightElement}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 20 },

  sectionTitle: { fontSize: 12, fontWeight: "bold", marginBottom: 10, marginTop: 20 },
  sectionCard: { borderRadius: 12, overflow: "hidden" },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    minHeight: 60,
  },
  rowLeft: { flexDirection: "row", alignItems: "center" },
  rowIcon: { fontSize: 18, marginRight: 15 },
  rowLabel: { fontSize: 16, fontWeight: "500" },
  rightText: { fontSize: 14 },

  footerNote: { fontSize: 12, marginTop: 15, lineHeight: 18 },
});
