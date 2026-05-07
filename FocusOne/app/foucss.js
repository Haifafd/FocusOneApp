// app/Foucss.js
import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Modal,
  Pressable,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// 🎨 الثيمات
const themes = {
  light: {
    background: "#F7F7F7",
    text: "#222",
    secondary: "#666",
    primary: "#4A90E2",
    surface: "#fff",
  },
  dark: {
    background: "#1A1A1A",
    text: "#fff",
    secondary: "#aaa",
    primary: "#BB86FC",
    surface: "#222",
  },
  lavender: {
    background: "#EDE7F6",
    text: "#3E2C5A",
    secondary: "#6A5B87",
    primary: "#9575CD",
    surface: "#D1C4E9",
  },
  blue: {
    background: "#E3F2FD",
    text: "#0D47A1",
    secondary: "#5472D3",
    primary: "#2196F3",
    surface: "#BBDEFB",
  },
};

export default function Foucss({ route }) {
  const router = useRouter();

  const task = route?.params?.task || { title: "Focus Task", duration: 1 };

  const [selectedTheme, setSelectedTheme] = useState("light");
  const theme = themes[selectedTheme];

  const [duration, setDuration] = useState(String(task.duration));
  const total = Number(duration || 1) * 60;

  const [secondsLeft, setSecondsLeft] = useState(total);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // مودال تغيير الوقت
  const [showModal, setShowModal] = useState(false);
  const [tempMinutes, setTempMinutes] = useState(duration);

  // جلب اقتباس
  const fetchQuote = async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await fetch(
        `https://api.adviceslip.com/advice?timestamp=${Date.now()}`
      );

      if (!response.ok) throw new Error("Failed to fetch quote");

      const data = await response.json();
      setQuote(data.slip?.advice || "Keep focusing, you are doing great!");
    } catch (err) {
      setError(true);
      setQuote("Keep focusing, you are doing great!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    setSecondsLeft(total);
    setRunning(false);
    clearInterval(intervalRef.current);
  }, [duration]);

  const toggleTimer = () => {
    if (running) {
      clearInterval(intervalRef.current);
      setRunning(false);
      return;
    }

    setRunning(true);

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          router.replace("/SessionCompleteScreen");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>

      {/* رجوع */}
      <View style={styles.top}>
        <TouchableOpacity onPress={() => router.push("/Homescreen")}>
          <Ionicons name="chevron-back" size={28} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* اختيار الثيم */}
      <View style={styles.themeRow}>
        {Object.keys(themes).map((key) => (
          <TouchableOpacity
            key={key}
            onPress={() => setSelectedTheme(key)}
            style={[
              styles.themeBtn,
              {
                backgroundColor:
                  selectedTheme === key ? theme.primary : theme.surface,
              },
            ]}
          >
            <Text
              style={{
                color: selectedTheme === key ? "#fff" : theme.text,
                fontSize: 12,
              }}
            >
              {key}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        <Text style={[styles.smallLabel, { color: theme.secondary }]}>
          FOCUS SESSION
        </Text>

        <Text style={[styles.title, { color: theme.text }]}>
          {task.title}
        </Text>

        {/* التايمر */}
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={[styles.timerOuter, { backgroundColor: theme.surface }]}
        >
          <Text style={[styles.timerText, { color: theme.text }]}>
            {minutes}:{seconds}
          </Text>
          <Text style={{ color: theme.secondary }}>Tap to set time</Text>
        </TouchableOpacity>

        {/* الاقتباس */}
        {loading ? (
          <ActivityIndicator size="small" color={theme.primary} />
        ) : (
          <Text style={[styles.quote, { color: theme.secondary }]}>
            "{quote}"
          </Text>
        )}

        {error && (
          <Text style={{ color: "red", marginTop: 8 }}>
            Error loading quote
          </Text>
        )}

        <TouchableOpacity
          onPress={fetchQuote}
          style={[styles.quoteButton, { backgroundColor: theme.primary }]}
        >
          <Text style={styles.quoteButtonText}>Get New Quote</Text>
        </TouchableOpacity>

        {/* زر تشغيل */}
        <TouchableOpacity
          onPress={toggleTimer}
          style={[styles.mainBtn, { backgroundColor: theme.primary }]}
        >
          <Text style={styles.mainBtnText}>
            {running ? "Pause" : "Start"}
          </Text>
        </TouchableOpacity>

        {/* إيقاف */}
        <TouchableOpacity onPress={() => router.push("/Homescreen")}>
          <Text style={[styles.stopText, { color: theme.text }]}>
            Stop
          </Text>
        </TouchableOpacity>
      </View>

      {/* مودال تغيير الوقت */}
      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: theme.surface }]}>
            <Text style={{ color: theme.text, fontSize: 18, marginBottom: 10 }}>
              Set Focus Minutes
            </Text>

            <TextInput
              value={tempMinutes}
              onChangeText={setTempMinutes}
              keyboardType="numeric"
              style={[
                styles.modalInput,
                { borderColor: theme.primary, color: theme.text },
              ]}
            />

            <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
              <Pressable
                onPress={() => setShowModal(false)}
                style={[styles.modalBtn, { backgroundColor: "#aaa" }]}
              >
                <Text style={{ color: "#fff" }}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setDuration(tempMinutes);
                  setShowModal(false);
                }}
                style={[styles.modalBtn, { backgroundColor: theme.primary }]}
              >
                <Text style={{ color: "#fff" }}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  top: { padding: 16 },

  themeRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 10,
  },

  themeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },

  content: { flex: 1, alignItems: "center", paddingHorizontal: 24 },

  smallLabel: { fontSize: 14 },
  title: { fontSize: 24, fontWeight: "700", marginTop: 4 },

  timerOuter: {
    marginTop: 30,
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  timerText: { fontSize: 44, fontWeight: "700" },

  quote: {
    marginTop: 20,
    textAlign: "center",
    fontStyle: "italic",
    paddingHorizontal: 20,
  },

  quoteButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },

  quoteButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

  mainBtn: {
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
  },

  mainBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  stopText: { marginTop: 15, fontSize: 18 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: 250,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },

  modalInput: {
    borderWidth: 1,
    width: 80,
    textAlign: "center",
    padding: 6,
    borderRadius: 6,
    fontSize: 18,
  },

  modalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
});
