import React, { useState, useEffect } from 'react';
import { 
  Text, View, ScrollView, StyleSheet, SafeAreaView, 
  TouchableOpacity, TextInput, Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "../../contexts/ThemeContext";

export default function FocusOneApp() {

  const { theme } = useTheme();

  // الشاشة الحالية
  const [screen, setScreen] = useState('GoalsList'); 

  // قائمة الأهداف
  const [goals, setGoals] = useState([]);

  // 🟦 عنوان الهدف
  const [goalTitle, setGoalTitle] = useState('');

  // 🟩 الوصف (المشكلة اللي كنتِ تواجهينها)
  const [goalDescription, setGoalDescription] = useState('');

  // تحميل الأهداف من AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await AsyncStorage.getItem('@focus_goals');
        if (stored) {
          setGoals(JSON.parse(stored));
        } else {
          setGoals([
            { id: '1', title: 'Read 12 Books', description: 'Read one book each month', tasks: '12 Tasks', progress: '60%' },
            { id: '2', title: 'Learn Swift UI', description: 'Complete 20 lessons', tasks: '20 Tasks', progress: '45%' }
          ]);
        }
      } catch (e) { console.log("Load error"); }
    };
    loadData();
  }, []);

  // حفظ هدف جديد
  const saveGoal = async () => {

    if (goalTitle.trim() === "") {
      Alert.alert("تنبيه", "الرجاء كتابة عنوان الهدف");
      return;
    }

    // 🟩 إضافة الوصف هنا
    const newEntry = { 
      id: Date.now().toString(), 
      title: goalTitle, 
      description: goalDescription, 
      tasks: '0 Tasks', 
      progress: '0%' 
    };

    const updatedList = [newEntry, ...goals];

    try {
      await AsyncStorage.setItem('@focus_goals', JSON.stringify(updatedList));
      setGoals(updatedList);

      // 🟩 إعادة تعيين الحقول
      setGoalTitle('');
      setGoalDescription('');

      setScreen('GoalsList');
      Alert.alert("تم الحفظ", "تمت إضافة الهدف بنجاح");

    } catch (e) { 
      Alert.alert("خطأ", "فشل الحفظ"); 
    }
  };

  // حذف هدف
  const deleteGoal = async (id) => {
    const filtered = goals.filter(item => item.id !== id);
    setGoals(filtered);
    await AsyncStorage.setItem('@focus_goals', JSON.stringify(filtered));
  };

  // شاشة عرض الأهداف
  const GoalsList = () => (
    <View style={{flex: 1}}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Your Goals</Text>

        <TouchableOpacity onPress={() => setScreen('AddGoal')}>
           <Text style={[styles.addText, { color: theme.primary }]}>+ Add Goal</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.gridPadding}>
        {goals.map((item) => (
          <View 
            key={item.id} 
            style={[
              styles.goalCard, 
              { backgroundColor: theme.card, shadowColor: theme.shadow }
            ]}
          >
            <View style={{flex: 1}}>
              <Text style={[styles.cardTitleText, { color: theme.text }]}>{item.title}</Text>

              {/* 🟩 عرض الوصف */}
              <Text style={[styles.cardSubText, { color: theme.textSecondary }]}>
                {item.description}
              </Text>

              <Text style={[styles.cardSubText, { color: theme.textSecondary }]}>
                {item.tasks} • {item.progress} Complete
              </Text>
            </View>

            <View style={[styles.circleContainer, { borderColor: theme.primary }]}>
              <Text style={[styles.circleText, { color: theme.primary }]}>{item.progress}</Text>
            </View>

            <TouchableOpacity onPress={() => deleteGoal(item.id)} style={{marginLeft: 15}}>
              <Ionicons name="trash-outline" size={20} color={theme.danger} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  // شاشة إضافة هدف
  const AddGoal = () => (
    <View style={{flex: 1}}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={() => setScreen('GoalsList')}>
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
            { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }
          ]}
          value={goalTitle}
          onChangeText={setGoalTitle}
          autoFocus
        />

        <Text style={[styles.label, { color: theme.textSecondary }]}>DESCRIPTION</Text>

        {/* 🟩 TextInput للوصف — الآن يعمل */}
        <TextInput
          placeholder="Define what success looks like..."
          placeholderTextColor={theme.textSecondary}
          style={[
            styles.descBox,
            { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }
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
      {screen === 'GoalsList' ? <GoalsList /> : <AddGoal />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 55 },
  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  addText: { fontSize: 16, fontWeight: 'bold' },
  saveBtn: { fontSize: 18, fontWeight: 'bold' },
  gridPadding: { padding: 20 },
  goalCard: { borderRadius: 20, padding: 20, marginBottom: 15, flexDirection: 'row', alignItems: 'center', shadowOpacity: 0.08, shadowRadius: 10, elevation: 2 },
  cardTitleText: { fontSize: 18, fontWeight: 'bold' },
  cardSubText: { fontSize: 12, marginTop: 5 },
  circleContainer: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  circleText: { fontSize: 11, fontWeight: 'bold' },
  inputArea: { padding: 25 },
  label: { fontSize: 12, fontWeight: 'bold', marginBottom: 10, marginTop: 20 },
  textInput: { padding: 15, borderRadius: 12, fontSize: 16, borderWidth: 1 },
  descBox: { padding: 15, borderRadius: 12, height: 100, borderWidth: 1 }
});