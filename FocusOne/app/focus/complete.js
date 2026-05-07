import React from "react";
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar 
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "../../src/contexts/ThemeContext";
import { useSessions } from "../../src/contexts/SessionsContext";

export default function FocusComplete() {
  const { theme } = useTheme();
  const router = useRouter();
  const { duration } = useLocalSearchParams();
  const { currentStreak } = useSessions();
  const minutes = duration || "25";
  const streakLabel = `${currentStreak} ${currentStreak === 1 ? "Day" : "Days"}`;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="dark-content" />

      {/* Back */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={[styles.backIcon, { color: theme.text }]}>{'<'}</Text>
        </TouchableOpacity>
      </View>

      {/* Card */}
      <View style={styles.cardContainer}>
        <View style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>

          {/* Success Icon */}
          <View style={[styles.successCircle, { backgroundColor: theme.surface }]}>
            <View style={[styles.innerCircle, { backgroundColor: theme.primary }]}>
              <Text style={styles.checkMark}>✓</Text>
            </View>
          </View>

          <Text style={[styles.title, { color: theme.text }]}>Session Complete</Text>

          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Great work! You've successfully completed your focus session.
          </Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={[styles.statBox, { backgroundColor: theme.surface }]}>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>DURATION</Text>
              <Text style={[styles.statValue, { color: theme.primary }]}>{minutes}:00</Text>
            </View>

            <View style={[styles.statBox, { backgroundColor: theme.surface }]}>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>STREAKS</Text>
              <Text style={[styles.statValue, { color: theme.danger }]}>{streakLabel}</Text>
            </View>
          </View>

          {/* Buttons */}
          <TouchableOpacity 
            style={[styles.mainButton, { backgroundColor: theme.primary }]}
            onPress={() => router.replace("/note/new")}
          >
            <Text style={styles.mainButtonText}>📄 Add Note</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.secondaryButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => router.replace("/(tabs)")}
          >
            <Text style={[styles.secondaryButtonText, { color: theme.primary }]}>🏠 Back to Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.maybeLater}>
            <Text style={[styles.maybeLaterText, { color: theme.textSecondary }]}>Maybe later</Text>
          </TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 10 },
  backButton: { width: 40, height: 40, justifyContent: "center" },
  backIcon: { fontSize: 24, fontWeight: "300" },

  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  card: {
    width: "100%",
    borderRadius: 35,
    padding: 30,
    alignItems: "center",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },

  successCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  innerCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  checkMark: { color: "white", fontSize: 20, fontWeight: "bold" },

  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },

  subtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 30,
    paddingHorizontal: 10,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 30,
  },

  statBox: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    width: "47%",
    alignItems: "center",
  },

  statLabel: { fontSize: 10, fontWeight: "700", marginBottom: 5 },

  statValue: { fontSize: 18, fontWeight: "bold" },

  mainButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 12,
  },

  mainButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },

  secondaryButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 1,
    marginBottom: 20,
  },

  secondaryButtonText: { fontWeight: "bold", fontSize: 16 },

  maybeLater: { marginBottom: 10 },

  maybeLaterText: { fontSize: 14 },
});
