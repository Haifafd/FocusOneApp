import React, { useState } from "react";
import { 
  StyleSheet, View, Text, Switch, TouchableOpacity, 
  SafeAreaView, Alert, Linking, ScrollView 
} from "react-native";
import * as Notifications from "expo-notifications";
import * as Haptics from "expo-haptics";
import { useTheme } from "../contexts/ThemeContext";

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();

  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);

  const handleNotificationToggle = async () => {
    if (!isNotificationsEnabled) {
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
            { text: "Open Settings", onPress: () => Linking.openSettings() }
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

    setIsNotificationsEnabled(!isNotificationsEnabled);
  };

  const handleResetData = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      "Reset Data",
      "Are you sure you want to delete all focus data?",
      [{ text: "Cancel" }, { text: "Delete", style: "destructive" }]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView>
        <View style={styles.content}>

          {/* GENERAL */}
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>GENERAL</Text>

          <View style={[styles.sectionCard, { backgroundColor: theme.surface }]}>
            <SettingRow 
              icon="⏱️"
              label="Default Focus Duration"
              rightElement={<Text style={[styles.rightText, { color: theme.textSecondary }]}>25 min {'>'}</Text>}
              theme={theme}
            />

            <SettingRow 
              icon="🔔"
              label="Notifications"
              rightElement={
                <Switch
                  value={isNotificationsEnabled}
                  onValueChange={handleNotificationToggle}
                  trackColor={{ true: theme.primary }}
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
                />
              }
              theme={theme}
            />
          </View>

          {/* DATA MANAGEMENT */}
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>DATA MANAGEMENT</Text>

          <View style={[styles.sectionCard, { backgroundColor: theme.surface }]}>
            <TouchableOpacity onPress={handleResetData}>
              <SettingRow 
                icon="🗑️"
                label="Reset Data"
                labelStyle={{ color: theme.danger }}
                last
                theme={theme}
              />
            </TouchableOpacity>
          </View>

          <Text style={[styles.footerNote, { color: theme.textSecondary }]}>
            Resetting your data will permanently delete all tasks and focus history.
          </Text>

        </View>
      </ScrollView>

      {/* TAB BAR */}
      <View style={[styles.tabBar, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <TabItem icon="🏠" label="Home" active={false} theme={theme} />
        <TabItem icon="🏳️" label="Goals" active={false} theme={theme} />
        <TabItem icon="📊" label="Progress" active={false} theme={theme} />
        <TabItem icon="⚙️" label="Settings" active={true} theme={theme} />
      </View>
    </SafeAreaView>
  );
}

const SettingRow = ({ icon, label, rightElement, last, labelStyle, theme }) => (
  <View style={[
    styles.row, 
    !last && { borderBottomColor: theme.border, borderBottomWidth: 1 }
  ]}>
    <View style={styles.rowLeft}>
      <Text style={[styles.rowIcon, { color: theme.text }]}>{icon}</Text>
      <Text style={[styles.rowLabel, { color: theme.text }, labelStyle]}>{label}</Text>
    </View>
    {rightElement}
  </View>
);

const TabItem = ({ icon, label, active, theme }) => (
  <View style={styles.tabItem}>
    <Text style={{ fontSize: 20, color: active ? theme.primary : theme.textSecondary }}>{icon}</Text>
    <Text style={[
      styles.tabLabel, 
      { color: active ? theme.primary : theme.textSecondary }
    ]}>
      {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
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

  tabBar: {
    flexDirection: "row",
    height: 80,
    justifyContent: "space-around",
    paddingTop: 10,
    borderTopWidth: 1,
  },
  tabItem: { alignItems: "center" },
  tabLabel: { fontSize: 10, marginTop: 4 },
});
