import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { AppContext } from "../contexts/AppContext";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { typography, spacing, radius } from "../constants/typography";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const { goals } = useContext(AppContext);
  const { theme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();

  const displayName = user?.name || user?.email?.split("@")[0] || "Guest";
  const currentGoal =
    goals && goals.length > 0 ? goals[0] : { title: "Build My Project", progress: 0 };

  const navigateTo = (path) => {
    // استخدم replace عشان ما يتراكم التاريخ لو تبين
    router.replace(path);
  };

  return (
    <View style={[styles.screenContainer, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scroll}>
        <View style={styles.headerSection}>
          <Text style={[styles.greeting, { color: theme.text }]}>
            Hi, {displayName} 👋
          </Text>
          <Text style={[styles.subGreeting, { color: theme.textSecondary }]}>
            Focus on one thing today
          </Text>
        </View>

        <View
          style={[
            styles.progressCard,
            { backgroundColor: theme.card, borderRadius: radius.lg, borderColor: theme.border },
          ]}
        >
          <View style={styles.goalHeader}>
            <View style={[styles.dot, { backgroundColor: "#FF5252" }]} />
            <Text style={[styles.goalTitle, { color: theme.text }]}>{currentGoal.title}</Text>
          </View>

          <View style={styles.progressTextRow}>
            <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Progress</Text>
            <Text style={{ color: theme.primary, fontWeight: "bold" }}>
              {currentGoal.progress}%
            </Text>
          </View>

          <View style={[styles.progressBarBackground, { backgroundColor: theme.surface }]}>
            <View
              style={[
                styles.progressBarFill,
                { backgroundColor: theme.primary, width: `${currentGoal.progress}%` },
              ]}
            />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Current Task</Text>

        <View
          style={[
            styles.taskCard,
            { backgroundColor: theme.card, borderRadius: radius.lg, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.taskName, { color: theme.text }]}>Homework</Text>
          <Text style={[styles.taskDesc, { color: theme.textSecondary }]}>25 min focus session</Text>

          <TouchableOpacity
            style={[styles.startBtn, { backgroundColor: theme.primary, borderRadius: radius.md }]}
            onPress={() => {
              // مثال: ابدأ جلسة تركيز — عدّلي حسب لوجيكك
              router.push("/foucss");
            }}
          >
            <Text style={styles.btnText}>Start Focus</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.addTaskBtn, { borderColor: theme.primary, borderRadius: radius.md }]}
            onPress={() => router.push("/tasks/new")}
          >
            <Text style={[styles.addTaskText, { color: theme.primary }]}>+ Add Task</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.quoteCard, { backgroundColor: "#E3F2FD", borderRadius: radius.md }]}>
          <Text style={styles.quoteText}>💡 "The secret of getting ahead is getting started."</Text>
        </View>

        {/* مسافة تحت عشان ما يختفي المحتوى ورا التاب بار */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* TAB BAR مكرر هنا عشان تطلع داخل الصفحة مثل اللي في Settings */}
      <View style={[styles.tabBar, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <TabButton icon="🏠" label="Home" active={true} onPress={() => navigateTo("/Homescreen")} theme={theme} />
        <TabButton icon="🏳️" label="Goals" active={false} onPress={() => navigateTo("/GoalsScreen")} theme={theme} />
        <TabButton icon="📊" label="Progress" active={false} onPress={() => navigateTo("/ProgressScreen")} theme={theme} />
        <TabButton icon="⚙️" label="Settings" active={false} onPress={() => navigateTo("/Settings")} theme={theme} />
      </View>
    </View>
  );
}

const TabButton = ({ icon, label, active, onPress, theme }) => (
  <TouchableOpacity style={styles.tabItem} onPress={onPress}>
    <Text style={{ fontSize: 20, color: active ? theme.primary : theme.textSecondary }}>{icon}</Text>
    <Text style={[styles.tabLabel, { color: active ? theme.primary : theme.textSecondary }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  screenContainer: { flex: 1 },
  scroll: { flex: 1 },
  headerSection: { marginTop: 20, marginBottom: spacing.xl, paddingHorizontal: spacing.xl },
  greeting: { fontSize: 24, fontWeight: "bold" },
  subGreeting: { fontSize: 14, marginTop: 4 },
  progressCard: { padding: spacing.lg, borderWidth: 1, elevation: 2, marginBottom: spacing.xl, marginHorizontal: spacing.xl },
  goalHeader: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  goalTitle: { fontSize: 16, fontWeight: "600" },
  progressTextRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  progressBarBackground: { height: 8, borderRadius: 4, overflow: "hidden" },
  progressBarFill: { height: "100%" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: spacing.md, marginHorizontal: spacing.xl },
  taskCard: { padding: spacing.xl, alignItems: "center", borderWidth: 1, elevation: 2, marginHorizontal: spacing.xl },
  taskName: { fontSize: 20, fontWeight: "bold" },
  taskDesc: { fontSize: 14, marginBottom: 20 },
  startBtn: { width: "100%", padding: 15, alignItems: "center", marginBottom: 12 },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  addTaskBtn: { width: "100%", padding: 15, alignItems: "center", borderWidth: 1 },
  addTaskText: { fontWeight: "600" },
  quoteCard: { padding: spacing.md, marginTop: spacing.xl, marginBottom: 40, marginHorizontal: spacing.xl },
  quoteText: { fontStyle: "italic", color: "#1976D2", textAlign: "center", fontSize: 13 },

  tabBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    height: 80,
    justifyContent: "space-around",
    paddingTop: 10,
    borderTopWidth: 1,
  },
  tabItem: { alignItems: "center" },
  tabLabel: { fontSize: 10, marginTop: 4 },
});
