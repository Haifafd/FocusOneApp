import React, { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../src/contexts/ThemeContext";
import { useGoals } from "../../src/contexts/GoalsContext";

export default function Goals() {
  const { theme } = useTheme();
  const { goals, addGoal, removeGoal, computeProgress } = useGoals();

  const [screen, setScreen] = useState("GoalsList");
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDescription, setGoalDescription] = useState("");

  const saveGoal = async () => {
    if (goalTitle.trim() === "") {
      Alert.alert("تنبيه", "الرجاء كتابة عنوان الهدف");
      return;
    }

    try {
      await addGoal({ title: goalTitle, description: goalDescription });
      setGoalTitle("");
      setGoalDescription("");
      setScreen("GoalsList");
      Alert.alert("تم الحفظ", "تمت إضافة الهدف بنجاح");
    } catch {
      Alert.alert("خطأ", "فشل الحفظ");
    }
  };

  const handleDelete = async (id) => {
    await removeGoal(id);
  };

  const GoalsList = () => (
    <View style={{ flex: 1 }}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Your Goals</Text>

        <TouchableOpacity onPress={() => setScreen("AddGoal")}>
          <Text style={[styles.addText, { color: theme.primary }]}>+ Add Goal</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.gridPadding}>
        {goals.map((item) => {
          const progress = computeProgress(item);
          const taskCount = item.tasks?.length || 0;
          return (
            <View
              key={item.id}
              style={[styles.goalCard, { backgroundColor: theme.card, shadowColor: theme.shadow }]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitleText, { color: theme.text }]}>{item.title}</Text>

                {!!item.description && (
                  <Text style={[styles.cardSubText, { color: theme.textSecondary }]}>
                    {item.description}
                  </Text>
                )}

                <Text style={[styles.cardSubText, { color: theme.textSecondary }]}>
                  {taskCount} Tasks • {progress}% Complete
                </Text>
              </View>

              <View style={[styles.circleContainer, { borderColor: theme.primary }]}>
                <Text style={[styles.circleText, { color: theme.primary }]}>{progress}%</Text>
              </View>

              <TouchableOpacity onPress={() => handleDelete(item.id)} style={{ marginLeft: 15 }}>
                <Ionicons name="trash-outline" size={20} color={theme.danger} />
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );

  const AddGoal = () => (
    <View style={{ flex: 1 }}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={() => setScreen("GoalsList")}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.text }]}>New Goal</Text>

        <TouchableOpacity onPress={saveGoal}>
          <Text style={[styles.saveBtn, { color: theme.primary }]}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputArea}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>GOAL TITLE</Text>

        <TextInput
          placeholder="e.g. Master React Native"
          placeholderTextColor={theme.textSecondary}
          style={[
            styles.textInput,
            { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border },
          ]}
          value={goalTitle}
          onChangeText={setGoalTitle}
          autoFocus
        />

        <Text style={[styles.label, { color: theme.textSecondary }]}>DESCRIPTION</Text>

        <TextInput
          placeholder="Define what success looks like..."
          placeholderTextColor={theme.textSecondary}
          style={[
            styles.descBox,
            { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border },
          ]}
          value={goalDescription}
          onChangeText={setGoalDescription}
          multiline
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: theme.background }]}>
      {screen === "GoalsList" ? <GoalsList /> : <AddGoal />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, paddingTop: 55 },
  headerTitle: { fontSize: 22, fontWeight: "bold" },
  addText: { fontSize: 16, fontWeight: "bold" },
  saveBtn: { fontSize: 18, fontWeight: "bold" },
  gridPadding: { padding: 20 },
  goalCard: { borderRadius: 20, padding: 20, marginBottom: 15, flexDirection: "row", alignItems: "center", shadowOpacity: 0.08, shadowRadius: 10, elevation: 2 },
  cardTitleText: { fontSize: 18, fontWeight: "bold" },
  cardSubText: { fontSize: 12, marginTop: 5 },
  circleContainer: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, justifyContent: "center", alignItems: "center" },
  circleText: { fontSize: 11, fontWeight: "bold" },
  inputArea: { padding: 25 },
  label: { fontSize: 12, fontWeight: "bold", marginBottom: 10, marginTop: 20 },
  textInput: { padding: 15, borderRadius: 12, fontSize: 16, borderWidth: 1 },
  descBox: { padding: 15, borderRadius: 12, height: 100, borderWidth: 1 },
});
