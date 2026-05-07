import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  Pressable,
  Alert,
  Modal,
  StyleSheet,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../../src/contexts/ThemeContext";
import { useNotes } from "../../src/contexts/NotesContext";
import { useToast } from "../../src/contexts/ToastContext";
import { useHaptics } from "../../src/hooks/useHaptics";
import { formatDate } from "../../src/utils/format";
import Header from "../../src/components/ui/Header";
import Button from "../../src/components/ui/Button";
import DrawingCanvas from "../../src/components/notes/DrawingCanvas";
import { typography, spacing, radius } from "../../src/theme";

export default function NewNote() {
  const { theme } = useTheme();
  const { addNote } = useNotes();
  const { show: toast } = useToast();
  const haptics = useHaptics();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const drawTopPadding = Math.max(insets.top, spacing.lg) + spacing.sm;
  const drawBottomPadding = Math.max(insets.bottom, spacing.md);

  const [photo, setPhoto] = useState(null);
  const [title, setTitle] = useState("");
  const [paths, setPaths] = useState([]);
  const [showDrawing, setShowDrawing] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      haptics.error();
      Alert.alert("Title required", "Please add a title for the note.");
      return;
    }
    await addNote({ title, photo, drawing: paths });
    haptics.success();
    toast({ type: "success", message: "Note saved" });
    router.replace("/note");
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Camera access is needed to attach a photo.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
      haptics.light();
    }
  };

  const pickFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Library access is needed.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
      haptics.light();
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={["bottom"]}>
      <Header
        title="New Note"
        showBack
        right={
          <Pressable onPress={handleSave} hitSlop={20} style={styles.saveBtn}>
            <Text style={[styles.save, { color: theme.primary, fontFamily: typography.family.semibold }]}>
              Save
            </Text>
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TextInput
          style={[styles.titleInput, { color: theme.text, fontFamily: typography.family.bold }]}
          placeholder="Title"
          placeholderTextColor={theme.textMuted}
          value={title}
          onChangeText={setTitle}
        />
        <Text style={[styles.meta, { color: theme.textSecondary }]}>{formatDate(new Date().toISOString())}</Text>

        {photo && (
          <View style={styles.photoBox}>
            <Image source={{ uri: photo }} style={styles.photo} />
            <Button title="Remove Photo" variant="ghost" size="sm" onPress={() => setPhoto(null)} />
          </View>
        )}

        {paths.length > 0 && (
          <View style={[styles.drawingPreview, { backgroundColor: theme.surfaceMuted }]}>
            <Svg style={StyleSheet.absoluteFill}>
              {paths.map((p, i) => (
                <Path key={i} d={p} stroke={theme.primary} strokeWidth={3} fill="none" strokeLinecap="round" />
              ))}
            </Svg>
          </View>
        )}
      </ScrollView>

      <View style={[styles.bar, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <Pressable style={styles.barBtn} onPress={takePhoto} hitSlop={6}>
          <Ionicons name="camera-outline" size={22} color={theme.primary} />
          <Text style={[styles.barText, { color: theme.primary }]}>Camera</Text>
        </Pressable>
        <Pressable style={styles.barBtn} onPress={pickFromLibrary} hitSlop={6}>
          <Ionicons name="images-outline" size={22} color={theme.primary} />
          <Text style={[styles.barText, { color: theme.primary }]}>Library</Text>
        </Pressable>
        <Pressable style={styles.barBtn} onPress={() => setShowDrawing(true)} hitSlop={6}>
          <Ionicons name="brush-outline" size={22} color={theme.primary} />
          <Text style={[styles.barText, { color: theme.primary }]}>Draw</Text>
        </Pressable>
      </View>

      <Modal visible={showDrawing} animationType="slide" onRequestClose={() => setShowDrawing(false)}>
        <View style={[styles.modalSafe, { backgroundColor: theme.background, paddingBottom: drawBottomPadding }]}>
          <View
            style={[
              styles.modalHeader,
              { borderBottomColor: theme.border, paddingTop: drawTopPadding },
            ]}
          >
            <Pressable onPress={() => setPaths([])} hitSlop={20} style={styles.modalActionBtn}>
              <Text style={[styles.modalAction, { color: theme.danger }]}>Clear</Text>
            </Pressable>
            <Text style={[styles.modalTitle, { color: theme.text, fontFamily: typography.family.bold }]}>Draw</Text>
            <Pressable onPress={() => setShowDrawing(false)} hitSlop={20} style={styles.modalActionBtn}>
              <Text style={[styles.modalAction, { color: theme.primary }]}>Done</Text>
            </Pressable>
          </View>
          <View style={[styles.canvasWrap, { backgroundColor: theme.surface }]}>
            <DrawingCanvas paths={paths} onChange={setPaths} color={theme.primary} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing["3xl"] },
  saveBtn: { paddingVertical: 4, paddingHorizontal: 6 },
  save: { fontSize: typography.size.base },
  titleInput: { fontSize: typography.size["2xl"], paddingVertical: spacing.sm },
  meta: { fontSize: typography.size.xs, marginBottom: spacing.lg },
  photoBox: { gap: spacing.sm, marginBottom: spacing.lg, alignItems: "center" },
  photo: { width: "100%", height: 280, borderRadius: radius.lg },
  drawingPreview: { width: "100%", height: 200, borderRadius: radius.lg, overflow: "hidden", marginBottom: spacing.lg },
  bar: { flexDirection: "row", justifyContent: "space-around", paddingVertical: spacing.md, borderTopWidth: StyleSheet.hairlineWidth },
  barBtn: { alignItems: "center", gap: 2 },
  barText: { fontSize: typography.size.xs, fontWeight: "600" },
  modalSafe: { flex: 1 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, minHeight: 56 },
  modalActionBtn: { paddingVertical: 8, paddingHorizontal: 12, minWidth: 60 },
  modalTitle: { fontSize: typography.size.lg },
  modalAction: { fontSize: typography.size.base, fontWeight: "600" },
  canvasWrap: { flex: 1, margin: spacing.lg, borderRadius: radius.lg, overflow: "hidden" },
});
