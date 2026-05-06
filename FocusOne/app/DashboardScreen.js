import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AppContext } from "../contexts/AppContext";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { spacing, radius } from "../constants/typography";

const HomeScreen = ({ navigation }) => {
  const { goals } = useContext(AppContext);
  const { theme } = useTheme();
  const { user } = useAuth();

  const displayName = user?.name || user?.email?.split('@')[0] || "Guest";
  const currentGoal = goals.length > 0 ? goals[0] : {
    title: "Build My Project",
    progress: 0,
    tasks: [{ title: "Homework", duration: 25 }]
  };

  const currentTask =
    currentGoal.tasks?.find((task) => !task.completed) ||
    currentGoal.tasks?.[0] ||
    { title: "Homework", duration: 25 };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={[styles.greeting, { color: theme.text }]}>
        Hi, {displayName} 👋
      </Text>

      <Text style={[styles.subGreeting, { color: theme.textSecondary }]}>
        Focus on one thing today
      </Text>

      <View style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          borderRadius: radius.lg,
        }
      ]}>
        <Text style={[styles.goalMain, { color: theme.text }]}>
          {currentGoal.title}
        </Text>

        <View style={styles.rowBetween}>
          <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>
            Progress
          </Text>
          <Text style={[styles.progressValue, { color: theme.primary }]}>
            {currentGoal.progress}%
          </Text>
        </View>

        <View style={[styles.progressBar, { backgroundColor: theme.surface }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: theme.primary,
                width: `${currentGoal.progress}%`,
              },
            ]}
          />
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Current Task
      </Text>

      <View style={[
        styles.card,
        styles.taskCard,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          borderRadius: radius.lg,
        }
      ]}>
        <Text style={[styles.taskTitle, { color: theme.text }]}>
          {currentTask.title}
        </Text>

        <Text style={[styles.taskSub, { color: theme.textSecondary }]}>
          {currentTask.duration} min focus session
        </Text>

        <TouchableOpacity
          style={[
            styles.startBtn,
            {
              backgroundColor: theme.primary,
              borderRadius: radius.md,
            },
          ]}
          onPress={() => navigation.navigate('FocusSession', { task: currentTask })}
        >
          <Text style={styles.btnText}>Start Focus</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.addTaskBtn,
            {
              borderColor: theme.primary,
              borderRadius: radius.md,
            },
          ]}
          onPress={() => navigation.navigate('Goals')}
        >
          <Text style={[styles.addTaskText, { color: theme.primary }]}>
            + Add Task
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: spacing.xl, paddingBottom: 120 },
  greeting: { fontSize: 24, fontWeight: 'bold', marginTop: 20 },
  subGreeting: { fontSize: 14, marginTop: 4, marginBottom: spacing.xl },

  card: {
    padding: spacing.lg,
    borderWidth: 1,
    elevation: 2,
    marginBottom: spacing.xl,
  },

  goalMain: { fontSize: 20, fontWeight: '800', marginBottom: 12 },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressLabel: { fontSize: 13 },
  progressValue: { fontWeight: '800' },
  progressBar: {
    width: '100%',
    height: 9,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: { height: '100%' },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },

  taskCard: { alignItems: 'center' },
  taskTitle: { fontSize: 28, fontWeight: '800' },
  taskSub: { marginTop: 8, fontSize: 15, marginBottom: 20 },

  startBtn: {
    width: '100%',
    padding: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  addTaskBtn: {
    width: '100%',
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
  },
  addTaskText: { fontWeight: '600' },
});

export default HomeScreen;
