import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  PanResponder,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../src/contexts/ThemeContext";
import { useNotes } from "../../src/contexts/NotesContext";
import { router } from "expo-router";

export default function NewNote() {
  const { theme } = useTheme();
  const { addNote } = useNotes();

  const [photo, setPhoto] = useState(null);
  const [title, setTitle] = useState("");
  const [showDrawing, setShowDrawing] = useState(false);
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState("");

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("تنبيه", "الرجاء كتابة عنوان للملاحظة");
      return;
    }

    await addNote({ title, photo, drawing: paths });

    setTitle("");
    setPhoto(null);
    setPaths([]);

    router.replace("/note");
  };

  const getDate = () => {
    const now = new Date();
    return (
      now
        .toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
        .toUpperCase() +
      " • " +
      now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    );
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const { locationX, locationY } = e.nativeEvent;
        setCurrentPath(`M${locationX},${locationY}`);
      },
      onPanResponderMove: (e) => {
        const { locationX, locationY } = e.nativeEvent;
        setCurrentPath((prev) => `${prev} L${locationX},${locationY}`);
      },
      onPanResponderRelease: () => {
        setCurrentPath((latest) => {
          if (latest) setPaths((prev) => [...prev, latest]);
          return "";
        });
      },
    })
  ).current;

  const clearDrawing = () => setPaths([]);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("إذن مطلوب", "يجب منح إذن الكاميرا");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.replace("/note")}>
          <Text style={[styles.backArrow, { color: theme.primary }]}>{"<"}</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.text }]}>Create New Note</Text>

        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: theme.primary }]} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        
        <TextInput
          style={[styles.titleInput, { color: theme.text }]}
          placeholder="Title"
          placeholderTextColor={theme.textSecondary}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={[styles.meta, { color: theme.textSecondary }]}>{getDate()}</Text>

        {photo && (
          <View style={styles.photoContainer}>
            <Image source={{ uri: photo }} style={styles.photo} />
            <TouchableOpacity
              style={[styles.retakeButton, { backgroundColor: theme.surface }]}
              onPress={() => setPhoto(null)}
            >
              <Text style={[styles.retakeText, { color: theme.primary }]}>Retake Photo</Text>
            </TouchableOpacity>
          </View>
        )}

        {paths.length > 0 && (
          <View style={styles.drawingPreview}>
            <Svg style={styles.svgPreview}>
              {paths.map((p, i) => (
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

            <TouchableOpacity style={styles.clearBtn} onPress={clearDrawing}>
              <Text style={[styles.clearText, { color: theme.danger }]}>🗑 Clear Drawing</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <TouchableOpacity style={styles.addPhotoBtn} onPress={takePhoto}>
          <Text style={styles.addPhotoIcon}>📷</Text>
          <Text style={[styles.addPhotoText, { color: theme.primary }]}>Add Photo</Text>
        </TouchableOpacity>

        <View style={styles.bottomRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <Text style={[styles.iconText, { color: theme.primary }]}>≡</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn} onPress={() => setShowDrawing(true)}>
            <Text style={[styles.iconText, { color: theme.primary }]}>✏️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={showDrawing} animationType="slide">
        <SafeAreaView style={[styles.drawingModal, { backgroundColor: theme.background }]}>

          <View style={[styles.drawingHeader, { borderBottomColor: theme.border }]}>
            <Text style={[styles.drawingTitle, { color: theme.text }]}>✏️ Draw</Text>

            <View style={styles.drawingActions}>
              <TouchableOpacity style={styles.clearDrawBtn} onPress={clearDrawing}>
                <Text style={[styles.clearDrawText, { color: theme.danger }]}>Clear</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.doneBtn, { backgroundColor: theme.primary }]} onPress={() => setShowDrawing(false)}>
                <Text style={styles.doneBtnText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.canvas} {...panResponder.panHandlers}>
            <Svg style={StyleSheet.absoluteFill}>
              {paths.map((p, i) => (
                <Path
                  key={i}
                  d={p}
                  stroke={theme.primary}
                  strokeWidth={3}
                  fill="none"
                  strokeLinecap="round"
                />
              ))}

              {currentPath ? (
                <Path
                  d={currentPath}
                  stroke={theme.primary}
                  strokeWidth={3}
                  fill="none"
                  strokeLinecap="round"
                />
              ) : null}
            </Svg>
          </View>

          <Text style={[styles.canvasHint, { color: theme.textSecondary }]}>ارسم بإصبعك هنا 👆</Text>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backArrow: { fontSize: 20, fontWeight: "bold" },
  headerTitle: { fontSize: 17, fontWeight: "700" },
  saveBtn: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  saveBtnText: { color: "#FFF", fontWeight: "700", fontSize: 14 },
  container: { flexGrow: 1, paddingHorizontal: 22, paddingTop: 25, paddingBottom: 20 },
  titleInput: { fontSize: 28, fontWeight: "700", marginBottom: 8 },
  meta: { fontSize: 12, marginBottom: 25 },
  photoContainer: { alignItems: "center", gap: 15, marginTop: 10 },
  photo: { width: "100%", height: 320, borderRadius: 18, resizeMode: "cover" },
  retakeButton: {
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: 20,
  },
  retakeText: { fontWeight: "600", fontSize: 15 },
  drawingPreview: { marginTop: 20, alignItems: "center" },
  svgPreview: { width: "100%", height: 200, borderRadius: 16 },
  clearBtn: { marginTop: 10 },
  clearText: { fontWeight: "600" },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  addPhotoBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    gap: 8,
    elevation: 2,
  },
  addPhotoIcon: { fontSize: 16 },
  addPhotoText: { fontWeight: "600", fontSize: 14 },
  bottomRight: { flexDirection: "row", gap: 10 },
  iconBtn: {
    backgroundColor: "#FFF",
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  iconText: { fontSize: 16 },
  drawingModal: { flex: 1 },
  drawingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  drawingTitle: { fontSize: 18, fontWeight: "700" },
  drawingActions: { flexDirection: "row", gap: 10 },
  clearDrawBtn: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "#FFE8E8",
  },
  clearDrawText: { fontWeight: "600" },
  doneBtn: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  doneBtnText: { color: "#FFF", fontWeight: "700" },
  canvas: {
    flex: 1,
    backgroundColor: "#FFF",
    margin: 15,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 3,
  },
  canvasHint: { textAlign: "center", paddingBottom: 15, fontSize: 13 },
});
