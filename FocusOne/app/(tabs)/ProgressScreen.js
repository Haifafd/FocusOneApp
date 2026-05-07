import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function ProgressScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const weeklyData = [4, 5, 5, 5, 6, 5, 5];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Text style={[styles.headerTitle, { color: theme.text }]}>Progress</Text>

        <View style={styles.statsRow}>
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>4</Text>
            <Text style={styles.statsSubtitle}>Today Focus Sessions</Text>
          </View>

          <View style={[styles.statsCard, styles.statsCardGreen]}>
            <Text style={[styles.statsTitle, { color: "#4CAF50" }]}>16</Text>
            <Text style={styles.statsSubtitle}>Weekly Focus Sessions</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Week Overview</Text>

          <View style={styles.chartRow}>
            {weeklyData.map((item, index) => (
              <View key={index} style={styles.chartItem}>
                <View style={[styles.chartTrack, { backgroundColor: theme.surface }]}>
                  <View
                    style={[
                      styles.chartFill,
                      {
                        height: `${(item / 8) * 100}%`,
                        backgroundColor: index === 4 ? theme.primary : theme.border,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.chartDay, { color: theme.textSecondary }]}>
                  {["S", "M", "T", "W", "T", "F", "S"][index]}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border, marginBottom: 100 },
          ]}
        >
          <Text style={[styles.noteText, { color: theme.textSecondary }]}>
            🏆 You're 1 session away from beating your weekly record.
          </Text>

          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: theme.primary }]}
            onPress={() => router.push("/(tabs)/foucss")}
          >
            <Text style={styles.primaryButtonText}>Open Focus Session</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 60 },
  headerTitle: { fontSize: 32, fontWeight: "bold", marginBottom: 24 },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24, gap: 16 },
  statsCard: { flex: 1, backgroundColor: "#f0f0f0", borderRadius: 16, padding: 20, alignItems: "center" },
  statsCardGreen: { backgroundColor: "#E8F5E9" },
  statsTitle: { fontSize: 32, fontWeight: "bold", marginBottom: 8 },
  statsSubtitle: { fontSize: 12, textAlign: "center" },
  card: { borderRadius: 16, borderWidth: 1, padding: 20, marginBottom: 16 },
  cardLabel: { fontSize: 14, fontWeight: "600", marginBottom: 16 },
  chartRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", gap: 8 },
  chartItem: { flex: 1, alignItems: "center" },
  chartTrack: { width: 32, height: 120, borderRadius: 16, overflow: "hidden", justifyContent: "flex-end", marginBottom: 8 },
  chartFill: { width: "100%", borderRadius: 16 },
  chartDay: { fontSize: 12, fontWeight: "600" },
  noteText: { fontSize: 14, marginBottom: 16 },
  primaryButton: { paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  primaryButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
