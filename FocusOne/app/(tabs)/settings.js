import { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Switch,
  Alert,
  Linking,
  StyleSheet,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
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
import { formatMinutes } from "../../src/utils/achievements";
import Header from "../../src/components/ui/Header";
import { typography, spacing, radius, shadows } from "../../src/theme";

const APP_VERSION = "1.0.0";
const DURATION_OPTIONS = [15, 25, 45, 60];

const getInitials = (user) => {
  if (!user) return "?";
  const source = (user.name || user.email || "").trim();
  if (!source) return "?";
  const parts = source.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
};

export default function Settings() {
  const { theme, mode, changeMode } = useTheme();
  const { user, logout } = useAuth();
  const { settings, updateSettings, refresh: refreshSettings } = useSettings();
  const { refresh: refreshGoals } = useGoals();
  const { sessions, currentStreak, totalMinutes, refresh: refreshSessions } = useSessions();
  const { notes, refresh: refreshNotes } = useNotes();
  const { show: toast } = useToast();
  const haptics = useHaptics();
  const router = useRouter();

  const initials = useMemo(() => getInitials(user), [user]);
  const displayName = user?.name || user?.email?.split("@")[0] || "Guest";

  const pickDuration = () => {
    haptics.selection();
    Alert.alert("Default Focus Duration", "Pick how long focus sessions last by default.", [
      ...DURATION_OPTIONS.map((m) => ({
        text: `${m} min${m === settings.defaultDuration ? "  ✓" : ""}`,
        onPress: () => updateSettings({ defaultDuration: m }),
      })),
      { text: "Cancel", style: "cancel" },
    ]);
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
    Alert.alert(
      "Reset All Data",
      "Are you sure? This will delete all goals, sessions, notes, and achievements.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Everything",
          style: "destructive",
          onPress: async () => {
            await storage.clear();
            await Promise.all([refreshGoals(), refreshSessions(), refreshNotes(), refreshSettings()]);
            toast({ type: "success", message: "Data reset" });
            router.replace("/(onboarding)");
          },
        },
      ]
    );
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

  const setTheme = (next) => {
    haptics.selection();
    changeMode(next);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Settings" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile card */}
        <Animated.View entering={FadeInDown.duration(400)}>
          <View style={[styles.profileCard, shadows.md, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
            <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
              <Text style={[styles.avatarText, { color: theme.onPrimary, fontFamily: typography.family.bold }]}>
                {initials}
              </Text>
            </View>
            <Text style={[styles.profileName, { color: theme.text, fontFamily: typography.family.bold }]} numberOfLines={1}>
              {displayName}
            </Text>
            <Text style={[styles.profileEmail, { color: theme.textSecondary }]} numberOfLines={1}>
              {user?.email || ""}
            </Text>

            <View style={[styles.statStrip, { borderColor: theme.border }]}>
              <Stat label="Sessions" value={String(sessions.length)} color={theme.primary} theme={theme} />
              <Divider theme={theme} />
              <Stat label="Streak" value={currentStreak ? `${currentStreak}d` : "—"} color={theme.warning} theme={theme} />
              <Divider theme={theme} />
              <Stat label="Focus" value={formatMinutes(totalMinutes)} color={theme.success} theme={theme} />
            </View>
          </View>
        </Animated.View>

        {/* Appearance */}
        <Animated.View entering={FadeInDown.duration(400).delay(80)}>
          <SectionLabel theme={theme}>APPEARANCE</SectionLabel>
          <View style={[styles.themeSelector, { backgroundColor: theme.surfaceMuted }]}>
            {[
              { key: "system", label: "Auto", icon: "phone-portrait-outline" },
              { key: "light", label: "Light", icon: "sunny-outline" },
              { key: "dark", label: "Dark", icon: "moon-outline" },
            ].map((opt) => {
              const active = mode === opt.key;
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => setTheme(opt.key)}
                  style={[
                    styles.themeOption,
                    active && { backgroundColor: theme.card, ...shadows.sm, shadowColor: theme.shadow },
                  ]}
                >
                  <Ionicons
                    name={opt.icon}
                    size={18}
                    color={active ? theme.primary : theme.textMuted}
                  />
                  <Text
                    style={[
                      styles.themeLabel,
                      {
                        color: active ? theme.primary : theme.textSecondary,
                        fontFamily: active ? typography.family.bold : typography.family.medium,
                      },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* Focus section */}
        <Animated.View entering={FadeInDown.duration(400).delay(160)}>
          <SectionLabel theme={theme}>FOCUS</SectionLabel>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Row
              theme={theme}
              icon="time-outline"
              iconBg="rgba(99, 102, 241, 0.12)"
              iconColor={theme.primary}
              label="Default Duration"
              onPress={pickDuration}
              right={
                <Text style={[styles.rightText, { color: theme.textSecondary, fontFamily: typography.family.semibold }]}>
                  {settings.defaultDuration} min
                </Text>
              }
            />
            <Divider theme={theme} indent />
            <Row
              theme={theme}
              icon="notifications-outline"
              iconBg="rgba(245, 158, 11, 0.15)"
              iconColor={theme.warning}
              label="Notifications"
              right={
                <Switch
                  value={settings.notificationsEnabled}
                  onValueChange={handleNotificationToggle}
                  trackColor={{ false: theme.border, true: theme.primary }}
                  thumbColor="#fff"
                />
              }
            />
            <Divider theme={theme} indent />
            <Row
              theme={theme}
              icon="volume-high-outline"
              iconBg="rgba(59, 130, 246, 0.15)"
              iconColor={theme.info}
              label="Sound"
              last
              right={
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
          </View>
        </Animated.View>

        {/* Content section */}
        <Animated.View entering={FadeInDown.duration(400).delay(240)}>
          <SectionLabel theme={theme}>CONTENT</SectionLabel>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Row
              theme={theme}
              icon="document-text-outline"
              iconBg="rgba(16, 185, 129, 0.15)"
              iconColor={theme.success}
              label="My Notes"
              onPress={() => {
                haptics.selection();
                router.push("/note");
              }}
              last
              right={
                <View style={styles.rightRow}>
                  <View style={[styles.badge, { backgroundColor: theme.surfaceMuted }]}>
                    <Text style={[styles.badgeText, { color: theme.textSecondary }]}>{notes.length}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
                </View>
              }
            />
          </View>
        </Animated.View>

        {/* Danger section */}
        <Animated.View entering={FadeInDown.duration(400).delay(320)}>
          <SectionLabel theme={theme}>DATA</SectionLabel>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Row
              theme={theme}
              icon="trash-outline"
              iconBg="rgba(239, 68, 68, 0.12)"
              iconColor={theme.danger}
              label="Reset All Data"
              labelColor={theme.danger}
              onPress={handleResetData}
              last
              right={<Ionicons name="chevron-forward" size={18} color={theme.textMuted} />}
            />
          </View>
        </Animated.View>

        {/* Account */}
        <Animated.View entering={FadeInDown.duration(400).delay(400)}>
          <SectionLabel theme={theme}>ACCOUNT</SectionLabel>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Row
              theme={theme}
              icon="log-out-outline"
              iconBg="rgba(107, 114, 128, 0.15)"
              iconColor={theme.textSecondary}
              label="Logout"
              labelColor={theme.danger}
              onPress={handleLogout}
              last
              right={<Ionicons name="chevron-forward" size={18} color={theme.textMuted} />}
            />
          </View>
        </Animated.View>

        {/* Footer */}
        <Animated.View entering={FadeInDown.duration(400).delay(480)} style={styles.footer}>
          <Text style={[styles.footerBrand, { color: theme.textMuted, fontFamily: typography.family.semibold }]}>
            FocusOne
          </Text>
          <Text style={[styles.footerVersion, { color: theme.textMuted }]}>v{APP_VERSION}</Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function SectionLabel({ children, theme }) {
  return (
    <Text style={[styles.sectionLabel, { color: theme.textSecondary, fontFamily: typography.family.semibold }]}>
      {children}
    </Text>
  );
}

function Stat({ label, value, color, theme }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color, fontFamily: typography.family.extrabold }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.textMuted }]}>{label}</Text>
    </View>
  );
}

function Divider({ theme, indent = false }) {
  return <View style={[styles.divider, { backgroundColor: theme.border, marginLeft: indent ? 64 : 0 }]} />;
}

function Row({ theme, icon, iconBg, iconColor, label, labelColor, right, onPress, last }) {
  const content = (
    <>
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <Text
        style={[
          styles.rowLabel,
          { color: labelColor || theme.text, fontFamily: typography.family.medium },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
      <View style={styles.rowRight}>{right}</View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.row,
          last && { borderBottomWidth: 0 },
          pressed ? { backgroundColor: theme.surfaceMuted } : null,
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={[styles.row, last && { borderBottomWidth: 0 }]}>{content}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: 140 },

  // Profile card
  profileCard: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  avatarText: { fontSize: 26 },
  profileName: { fontSize: typography.size.xl, marginBottom: 2 },
  profileEmail: { fontSize: typography.size.sm, marginBottom: spacing.lg },

  statStrip: {
    flexDirection: "row",
    width: "100%",
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  stat: { flex: 1, alignItems: "center", gap: 2 },
  statValue: { fontSize: typography.size.xl },
  statLabel: { fontSize: 10, letterSpacing: 1, textTransform: "uppercase" },

  // Section
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 1.4,
    marginLeft: spacing.sm,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },

  // Theme selector segmented control
  themeSelector: {
    flexDirection: "row",
    padding: 4,
    borderRadius: radius.full,
    marginBottom: spacing.lg,
  },
  themeOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  themeLabel: { fontSize: typography.size.sm },

  // Generic card
  card: {
    borderRadius: radius.lg,
    overflow: "hidden",
    marginBottom: spacing.lg,
  },

  // Row
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 56,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "transparent",
    gap: spacing.md,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: { flex: 1, fontSize: typography.size.base },
  rowRight: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  rightText: { fontSize: typography.size.sm },
  rightRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  badge: {
    minWidth: 26,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { fontSize: typography.size.xs, fontWeight: "600" },

  divider: { height: StyleSheet.hairlineWidth },

  // Footer
  footer: {
    alignItems: "center",
    marginTop: spacing.xl,
    gap: 2,
  },
  footerBrand: { fontSize: typography.size.sm, letterSpacing: 1 },
  footerVersion: { fontSize: typography.size.xs },
});
