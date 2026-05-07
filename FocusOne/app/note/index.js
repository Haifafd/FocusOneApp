import { useCallback } from "react";
import { View, Pressable, Alert, StyleSheet } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { useTheme } from "../../src/contexts/ThemeContext";
import { useNotes } from "../../src/contexts/NotesContext";
import { useToast } from "../../src/contexts/ToastContext";
import { useHaptics } from "../../src/hooks/useHaptics";
import Header from "../../src/components/ui/Header";
import EmptyState from "../../src/components/ui/EmptyState";
import NoteCard from "../../src/components/notes/NoteCard";
import { spacing } from "../../src/theme";

export default function Notes() {
  const { theme } = useTheme();
  const router = useRouter();
  const { notes, removeNote, refresh } = useNotes();
  const { show: toast } = useToast();
  const haptics = useHaptics();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const onAdd = () => {
    haptics.selection();
    router.push("/note/new");
  };

  const onDelete = (id) => {
    haptics.medium();
    Alert.alert("Delete note", "Delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await removeNote(id);
          toast({ type: "success", message: "Note deleted" });
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title="Notes"
        right={
          <Pressable onPress={onAdd} hitSlop={10}>
            <Ionicons name="add" size={24} color={theme.primary} />
          </Pressable>
        }
      />

      {notes.length === 0 ? (
        <EmptyState
          icon="document-text-outline"
          title="No notes yet"
          subtitle="Capture a thought, photo, or quick sketch."
          ctaLabel="New Note"
          onCta={onAdd}
        />
      ) : (
        <Animated.FlatList
          data={notes}
          keyExtractor={(n) => n.id}
          contentContainerStyle={styles.list}
          itemLayoutAnimation={LinearTransition}
          renderItem={({ item }) => <NoteCard note={item} onDelete={onDelete} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: spacing.lg, paddingBottom: 140 },
});
