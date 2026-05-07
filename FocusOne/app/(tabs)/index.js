import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { AppContext } from "../../contexts/AppContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  let goals = [];
  let selectedGoalId = null;
  let setSelectedGoalId = () => {};

  try {
    const context = useContext(AppContext);
    if (context) {
      goals = context.goals || [];
      selectedGoalId = context.selectedGoalId;
      setSelectedGoalId = context.setSelectedGoalId || (() => {});
    } else {
      goals = [
        { id: '1', title: 'Graduation Project', progress: 85, tasks: [{ title: 'UI Design', duration: 30, completed: false }] }
      ];
    }
  } catch (e) {}

  const { theme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();

  const displayName = user?.name || user?.email?.split("@")[0] || "Guest";

  const currentGoal = goals.length > 0
    ? (selectedGoalId ? goals.find(g => g.id === selectedGoalId) : goals[0])
    : { title: "Build My Project", progress: 0, tasks: [] };

  const incompleteTasks = currentGoal?.tasks?.filter(t => !t.completed).length || 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <Text style={[styles.greeting, { color: theme.text }]}>Hi, {displayName} 👋</Text>
          <Text style={[styles.subGreeting, { color: theme.textSecondary }]}>Focus on one thing today</Text>
        </View>

        <View style={[styles.progressCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.goalHeader}>
            <View style={styles.dot} />
            <Text style={[styles.goalTitle, { color: theme.text }]}>{currentGoal.title || "No Goal"}</Text>
          </View>
          <View style={styles.progressTextRow}>
            <Text style={{ color: theme.textSecondary }}>Progress</Text>
            <Text style={{ color: theme.primary, fontWeight: "bold" }}>{currentGoal.progress || 0}%</Text>
          </View>
          <View style={[styles.progressBarBackground, { backgroundColor: theme.surface }]}>
            <View style={[styles.progressBarFill, { backgroundColor: theme.primary, width: `${currentGoal.progress || 0}%` }]} />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Current Task</Text>

        <View style={[styles.taskCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.taskName, { color: theme.text }]}>
            {currentGoal?.tasks?.[0]?.title || "No Tasks"}
          </Text>
          <Text style={[styles.taskDesc, { color: theme.textSecondary }]}>
            {incompleteTasks} tasks remaining • {currentGoal?.tasks?.[0]?.duration || 25} min focus session
          </Text>
          <TouchableOpacity 
            style={[styles.startBtn, { backgroundColor: theme.primary }]} 
            onPress={() => router.push("/foucss")}
          >
            <Text style={styles.btnText}>Start Focus</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.quoteCard, { backgroundColor: "#E3F2FD" }]}>
          <Text style={styles.quoteText}>💡 "The secret of getting ahead is getting started."</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  headerSection: { marginBottom: 24 },
  greeting: { fontSize: 24, fontWeight: "bold" },
  subGreeting: { fontSize: 14, marginTop: 4 },
  progressCard: { padding: 16, borderWidth: 1, borderRadius: 12, marginBottom: 24 },
  goalHeader: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#FF5252", marginRight: 8 },
  goalTitle: { fontSize: 16, fontWeight: "600" },
  progressTextRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  progressBarBackground: { height: 8, borderRadius: 4, overflow: "hidden" },
  progressBarFill: { height: "100%" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  taskCard: { padding: 20, alignItems: "center", borderWidth: 1, borderRadius: 12, marginBottom: 24 },
  taskName: { fontSize: 20, fontWeight: "bold" },
  taskDesc: { fontSize: 14, marginBottom: 20 },
  startBtn: { width: "100%", padding: 15, alignItems: "center", borderRadius: 8 },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  quoteCard: { padding: 16, borderRadius: 12 },
  quoteText: { fontStyle: "italic", color: "#1976D2", textAlign: "center", fontSize: 13 },
});
