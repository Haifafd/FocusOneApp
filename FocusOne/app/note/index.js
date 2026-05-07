import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from "react-native";
import { useTheme } from "../../src/contexts/ThemeContext";
import { useNotes } from "../../src/contexts/NotesContext";
import { useRouter, useFocusEffect } from "expo-router";
import Svg, { Path } from "react-native-svg";

export default function Notes() {
  const { theme } = useTheme();
  const router = useRouter();
  const { notes, removeNote, refresh } = useNotes();

  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, [refresh])
  );

  const deleteNote = (id) => {
    Alert.alert("Delete", "Delete this note?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          await removeNote(id);
        },
      },
    ]);
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return (
      d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase() +
      " • " +
      d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Your Notes</Text>

        <TouchableOpacity onPress={() => router.push("/note/new")}>
          <Text style={[styles.emojiAdd, { color: theme.primary }]}>📝</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {notes.length === 0 && (
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No notes yet...
          </Text>
        )}

        {notes.map((note) => (
          <View key={note.id} style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>{note.title}</Text>
            <Text style={[styles.date, { color: theme.textSecondary }]}>
              {formatDate(note.createdAt)}
            </Text>

            {note.photo && (
              <Image source={{ uri: note.photo }} style={styles.photo} />
            )}

            {note.drawing && note.drawing.length > 0 && (
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

            <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteNote(note.id)}>
              <Text style={[styles.deleteText, { color: theme.danger }]}>Delete</Text>
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
    paddingTop: 60,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: { fontSize: 26, fontWeight: "700" },

  emojiAdd: { fontSize: 30, paddingHorizontal: 10 },

  list: { padding: 20, paddingBottom: 100 },

  emptyText: { textAlign: "center", marginTop: 40 },

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

  photo: { width: "100%", height: 220, borderRadius: 14, marginBottom: 10 },
  drawing: { width: "100%", height: 200, marginBottom: 10 },

  deleteBtn: { marginTop: 10, alignSelf: "flex-end" },
  deleteText: { fontSize: 14, fontWeight: "600" },
});
