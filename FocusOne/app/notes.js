import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../contexts/ThemeContext";
import { router } from "expo-router";
import Notes from "../notes";
export default Notes;

export default function NotesScreen() {
  const { theme } = useTheme();
  const [notes, setNotes] = useState([]);

  // تحميل الملاحظات
  useEffect(() => {
    const loadNotes = async () => {
      const stored = await AsyncStorage.getItem("@notes");
      if (stored) setNotes(JSON.parse(stored));
    };
    loadNotes();
  }, []);

  // حذف ملاحظة
  const deleteNote = async (id) => {
    Alert.alert("حذف", "هل تريد حذف هذه الملاحظة؟", [
      { text: "إلغاء", style: "cancel" },
      {
        text: "حذف",
        style: "destructive",
        onPress: async () => {
          const updated = notes.filter((n) => n.id !== id);
          setNotes(updated);
          await AsyncStorage.setItem("@notes", JSON.stringify(updated));
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Your Notes</Text>

        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: theme.primary }]}
          onPress={() => router.push("/camera")}
        >
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Notes List */}
      <ScrollView contentContainerStyle={styles.list}>
        {notes.length === 0 && (
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            لا توجد ملاحظات بعد…
          </Text>
        )}

        {notes.map((note) => (
          <View
            key={note.id}
            style={[
              styles.card,
              { backgroundColor: theme.surface, shadowColor: theme.shadow },
            ]}
          >
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              {note.title}
            </Text>
            <Text style={[styles.date, { color: theme.textSecondary }]}>
              {note.date}
            </Text>

            {/* Photo */}
            {note.photo && (
              <Image source={{ uri: note.photo }} style={styles.photo} />
            )}

            {/* Drawing */}
            {note.drawing?.length > 0 && (
              <Svg style={styles.drawing}>
                {note.drawing.map((p, i) => (
                  <Path
                    key={i}
                    d={p}
                    stroke={theme.primary}
                    strokeWidth={3}
                    fill="none"
                    strokeLinecap="round"
                  />
                ))}
              </Svg>
            )}

            {/* Delete */}
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => deleteNote(note.id)}
            >
              <Text style={[styles.deleteText, { color: theme.danger }]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 26, fontWeight: "700" },
  addBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  addBtnText: { color: "#FFF", fontWeight: "700", fontSize: 14 },
  list: { padding: 20 },
  emptyText: { textAlign: "center", marginTop: 40, fontSize: 14 },
  card: {
    padding: 15,
    borderRadius: 16,
    marginBottom: 20,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: { fontSize: 20, fontWeight: "700" },
  date: { fontSize: 12, marginBottom: 10 },
  photo: { width: "100%", height: 200, borderRadius: 12, marginTop: 10 },
  drawing: { width: "100%", height: 200, marginTop: 10 },
  deleteBtn: { marginTop: 10, alignSelf: "flex-end" },
  deleteText: { fontSize: 14, fontWeight: "600" },
});
