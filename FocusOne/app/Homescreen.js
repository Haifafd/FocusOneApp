import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AppContext } from "../contexts/AppContext"; 
import { useTheme } from "../contexts/ThemeContext"; 
import { useAuth } from "../contexts/AuthContext";
import { typography, spacing, radius } from "../constants/typography"; 

const HomeScreen = () => {
  const { goals } = useContext(AppContext);
  const { theme } = useTheme();
  const { user } = useAuth();

  const displayName = user?.name || user?.email?.split('@')[0] || "Guest";

  const currentGoal = goals.length > 0 ? goals[0] : { title: "Build My Project", progress: 0 };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerSection}>
        <Text style={[styles.greeting, { color: theme.text }]}>Hi, {displayName} 👋</Text>
        <Text style={[styles.subGreeting, { color: theme.textSecondary }]}>Focus on one thing today</Text>
      </View>

      <View style={[styles.progressCard, { backgroundColor: theme.card, borderRadius: radius.lg, borderColor: theme.border }]}>
        <View style={styles.goalHeader}>
           <View style={[styles.dot, { backgroundColor: '#FF5252' }]} />
           <Text style={[styles.goalTitle, { color: theme.text }]}>{currentGoal.title}</Text>
        </View>
        
        <View style={styles.progressTextRow}>
          <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Progress</Text>
          <Text style={{ color: theme.primary, fontWeight: 'bold' }}>{currentGoal.progress}%</Text>
        </View>
        
        <View style={[styles.progressBarBackground, { backgroundColor: theme.surface }]}>
          <View style={[styles.progressBarFill, { backgroundColor: theme.primary, width: `${currentGoal.progress}%` }]} />
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Current Task</Text>

      <View style={[styles.taskCard, { backgroundColor: theme.card, borderRadius: radius.lg, borderColor: theme.border }]}>
        <Text style={[styles.taskName, { color: theme.text }]}>Homework</Text>
        <Text style={[styles.taskDesc, { color: theme.textSecondary }]}>25 min focus session</Text>
        
        <TouchableOpacity style={[styles.startBtn, { backgroundColor: theme.primary, borderRadius: radius.md }]}>
          <Text style={styles.btnText}>Start Focus</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.addTaskBtn, { borderColor: theme.primary, borderRadius: radius.md }]}>
          <Text style={[styles.addTaskText, { color: theme.primary }]}>+ Add Task</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.quoteCard, { backgroundColor: '#E3F2FD', borderRadius: radius.md }]}>
        <Text style={styles.quoteText}>
          💡 "The secret of getting ahead is getting started."
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.xl },
  headerSection: { marginTop: 20, marginBottom: spacing.xl },
  greeting: { fontSize: 24, fontWeight: 'bold' },
  subGreeting: { fontSize: 14, marginTop: 4 },
  progressCard: { padding: spacing.lg, borderWidth: 1, elevation: 2, marginBottom: spacing.xl },
  goalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  goalTitle: { fontSize: 16, fontWeight: '600' },
  progressTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressBarBackground: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: spacing.md },
  taskCard: { padding: spacing.xl, alignItems: 'center', borderWidth: 1, elevation: 2 },
  taskName: { fontSize: 20, fontWeight: 'bold' },
  taskDesc: { fontSize: 14, marginBottom: 20 },
  startBtn: { width: '100%', padding: 15, alignItems: 'center', marginBottom: 12 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  addTaskBtn: { width: '100%', padding: 15, alignItems: 'center', borderWidth: 1 },
  addTaskText: { fontWeight: '600' },
  quoteCard: { padding: spacing.md, marginTop: spacing.xl, marginBottom: 40 },
  quoteText: { fontStyle: 'italic', color: '#1976D2', textAlign: 'center', fontSize: 13 }
});

export default HomeScreen;
