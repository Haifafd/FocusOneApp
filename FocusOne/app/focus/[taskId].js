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
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "../../src/contexts/ThemeContext";
import { useSessions } from "../../src/contexts/SessionsContext";
import { useSettings } from "../../src/contexts/SettingsContext";

export default function FocusSession() {
  const router = useRouter();
  const { taskId, duration: durationParam } = useLocalSearchParams();
  const { theme } = useTheme();
  const { addSession } = useSessions();
  const { settings } = useSettings();

  const initialDuration = durationParam ? String(durationParam) : String(settings.defaultDuration);
  const task = { title: "Focus Task", duration: Number(initialDuration), id: taskId };

  const [duration, setDuration] = useState(initialDuration);
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
          (async () => {
            await addSession({
              taskId: taskId === "quick" ? null : taskId,
              goalId: null,
              durationMinutes: Number(duration),
            });
            router.replace({ pathname: "/focus/complete", params: { duration: String(duration) } });
          })();
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
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={[styles.smallLabel, { color: theme.textSecondary }]}>
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
          <Text style={{ color: theme.textSecondary }}>Tap to set time</Text>
        </TouchableOpacity>

        {/* الاقتباس */}
        {loading ? (
          <ActivityIndicator size="small" color={theme.primary} />
        ) : (
          <Text style={[styles.quote, { color: theme.textSecondary }]}>
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
        <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
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
