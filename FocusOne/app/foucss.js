// app/foucss.js
import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
// أعلى الملف، بعد استيراد React و react-native
import { useTheme } from "../contexts/ThemeContext";

import { Ionicons } from "@expo/vector-icons";
import Button from "../components/common/Button";

export default function Foucss({ navigation, route }) {
  const { theme } = useTheme();

  const task = route?.params?.task || { title: "Focus Task", duration: 25 };
  const total = task.duration * 60;

  const [secondsLeft, setSecondsLeft] = useState(total);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
          navigation.replace("SessionComplete", { task });
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
      {/* Back button */}
      <View style={styles.top}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.smallLabel, { color: theme.textSecondary }]}>
          FOCUS SESSION
        </Text>

        <Text style={[styles.title, { color: theme.text }]}>{task.title}</Text>

        {/* Timer circle */}
        <View
          style={[
            styles.timerOuter,
            {
              backgroundColor: theme.surface,
              shadowColor: theme.shadow,
            },
          ]}
        >
          <Text style={[styles.timerText, { color: theme.text }]}>
            {minutes}:{seconds}
          </Text>
          <Text style={[styles.timerSub, { color: theme.textSecondary }]}>REMAINING</Text>
        </View>

        {/* Quote */}
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
              Loading quote...
            </Text>
          </View>
        ) : (
          <Text style={[styles.quote, { color: theme.textSecondary }]}>"{quote}"</Text>
        )}

        {error && (
          <Text style={[styles.errorText, { color: theme.danger }]}>
            Error loading quote. Default quote is shown.
          </Text>
        )}

        <TouchableOpacity onPress={fetchQuote} style={styles.newQuoteButton}>
          <Text style={[styles.newQuoteText, { color: theme.primary }]}>New Quote</Text>
        </TouchableOpacity>

        {/* Start / Pause button */}
        <View style={styles.buttonWrap}>
          <Button title={running ? "Pause" : "Start"} onPress={toggleTimer} />
        </View>

        <TouchableOpacity style={styles.stopWrap} onPress={() => navigation.goBack()}>
          <Text style={[styles.stopText, { color: theme.text }]}>Stop</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  top: { padding: 16 },
  content: { flex: 1, alignItems: "center", paddingHorizontal: 24 },
  smallLabel: { fontSize: 14 },
  title: { fontSize: 24, fontWeight: "700", marginTop: 4 },
  timerOuter: {
    marginTop: 40,
    width: 220,
    height: 220,
    borderRadius: 110,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  timerText: { fontSize: 48, fontWeight: "700" },
  timerSub: { marginTop: 4 },
  loadingBox: { marginTop: 24, alignItems: "center" },
  loadingText: { marginTop: 8 },
  quote: { marginTop: 24, fontStyle: "italic", textAlign: "center", paddingHorizontal: 12 },
  errorText: { marginTop: 8 },
  newQuoteButton: { marginTop: 12, padding: 8 },
  newQuoteText: { fontWeight: "600" },
  buttonWrap: { width: "100%", marginTop: 20 },
  stopWrap: { marginTop: 16 },
  stopText: { fontSize: 18, fontWeight: "600" },
});