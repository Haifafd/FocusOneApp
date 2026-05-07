import { memo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../contexts/ThemeContext";
import { typography, spacing } from "../../theme";
import { formatDate } from "../../utils/format";
import Card from "../ui/Card";

function NoteCard({ note, onDelete }) {
  const { theme } = useTheme();

  return (
    <Card variant="elevated" padding="lg" style={styles.card}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: theme.text, fontFamily: typography.family.bold }]} numberOfLines={1}>
            {note.title}
          </Text>
          <Text style={[styles.date, { color: theme.textSecondary }]}>
            {formatDate(note.createdAt)}
          </Text>
        </View>
        <Pressable hitSlop={10} onPress={() => onDelete(note.id)}>
          <Ionicons name="trash-outline" size={20} color={theme.danger} />
        </Pressable>
      </View>

      {note.photo && (
        <Image source={note.photo} style={styles.photo} contentFit="cover" transition={200} />
      )}

      {note.drawing && note.drawing.length > 0 && (
        <Svg style={styles.drawing}>
          {note.drawing.map((p, i) => (
            <Path key={i} d={p} stroke={theme.primary} strokeWidth={3} fill="none" strokeLinecap="round" />
          ))}
        </Svg>
      )}
    </Card>
  );
}

export default memo(NoteCard);

const styles = StyleSheet.create({
  card: { marginBottom: spacing.md },
  header: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md, marginBottom: spacing.sm },
  title: { fontSize: typography.size.lg, marginBottom: 2 },
  date: { fontSize: typography.size.xs },
  photo: { width: "100%", height: 200, borderRadius: 12, marginTop: spacing.sm },
  drawing: { width: "100%", height: 160, marginTop: spacing.sm },
});
