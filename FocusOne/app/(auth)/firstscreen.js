import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function FirstScreen() {
  const router = useRouter();

  const handleStart = () => {
    // عند الضغط على زر Start يروح لشاشة تسجيل الدخول
    router.push("/login");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* اللوقو */}
      <View style={styles.logoContainer}>
        <View style={styles.calendarBox}>
          <View style={styles.topPinsContainer}>
            <View style={styles.pin} />
            <View style={styles.pin} />
          </View>

          <View style={styles.calendarGrid}>
            {[...Array(12)].map((_, index) => (
              <View key={index} style={styles.square} />
            ))}
          </View>
        </View>

        {/* علامة الصح */}
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={24} color="#FFFFFF" />
        </View>
      </View>

      {/* النص */}
      <Text style={styles.title}>FOCUS ONE</Text>
      <Text style={styles.subtitle}>ACHIEVE MORE</Text>

      {/* زر البداية */}
      <TouchableOpacity 
        style={styles.startButton} 
        onPress={handleStart}
        activeOpacity={0.8}
      >
        <Text style={styles.startText}>Start</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  logoContainer: {
    position: "relative",
    marginBottom: 15,
  },

  calendarBox: {
    width: 90,
    height: 90,
    borderWidth: 4,
    borderColor: "#1E5DB8",
    borderRadius: 10,
    paddingTop: 15,
    alignItems: "center",
    backgroundColor: "#fff",
  },

  topPinsContainer: {
    position: "absolute",
    top: -10,
    width: "70%",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  pin: {
    width: 8,
    height: 18,
    borderRadius: 4,
    backgroundColor: "#1E5DB8",
  },

  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 60,
    justifyContent: "space-between",
    marginTop: 8,
  },

  square: {
    width: 14,
    height: 14,
    backgroundColor: "#5DA9FF",
    marginBottom: 4,
    borderRadius: 2,
  },

  checkCircle: {
    position: "absolute",
    right: -15,
    bottom: -10,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#1E5DB8",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E5DB8",
    letterSpacing: 2,
  },

  subtitle: {
    marginTop: 5,
    fontSize: 14,
    color: "#5DA9FF",
    letterSpacing: 4,
    fontWeight: "600",
  },

  startButton: {
    marginTop: 50,
    backgroundColor: "#1E5DB8",
    paddingVertical: 14,
    paddingHorizontal: 70,
    borderRadius: 30,
    shadowColor: "#1E5DB8",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.9,
    shadowRadius: 15,
    elevation: 12,
  },

  startText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});