import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useTheme } from "../../contexts/ThemeContext";
import { typography, spacing, radius } from "../../theme";

const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];
const TRACK_HEIGHT = 120;

function Bar({ value, maxValue, isToday }) {
  const { theme } = useTheme();
  const heightSV = useSharedValue(0);

  useEffect(() => {
    const ratio = maxValue > 0 ? value / maxValue : 0;
    heightSV.value = withTiming(TRACK_HEIGHT * ratio, { duration: 600 });
  }, [value, maxValue, heightSV]);

  const animatedStyle = useAnimatedStyle(() => ({ height: heightSV.value }));

  return (
    <View style={styles.col}>
      <View style={[styles.track, { backgroundColor: theme.surfaceMuted }]}>
        <Animated.View
          style={[
            animatedStyle,
            styles.fill,
            { backgroundColor: isToday ? theme.primary : theme.border },
          ]}
        />
      </View>
    </View>
  );
}

export default function WeeklyChart({ data }) {
  const { theme } = useTheme();
  const todayIndex = new Date().getDay();
  const maxValue = Math.max(1, ...data);

  return (
    <View>
      <View style={styles.row}>
        {data.map((value, index) => (
          <Bar key={index} value={value} maxValue={maxValue} isToday={index === todayIndex} />
        ))}
      </View>
      <View style={styles.labelsRow}>
        {DAY_LETTERS.map((letter, index) => (
          <View key={index} style={styles.col}>
            <Text
              style={[
                styles.dayText,
                {
                  color: index === todayIndex ? theme.primary : theme.textSecondary,
                  fontFamily: index === todayIndex ? typography.family.bold : typography.family.medium,
                },
              ]}
            >
              {letter}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-end", gap: 8, height: TRACK_HEIGHT },
  col: { flex: 1, alignItems: "center" },
  track: { width: 24, height: TRACK_HEIGHT, borderRadius: radius.md, justifyContent: "flex-end", overflow: "hidden" },
  fill: { width: "100%", borderRadius: radius.md },
  labelsRow: { flexDirection: "row", marginTop: spacing.sm, gap: 8 },
  dayText: { fontSize: typography.size.xs },
});
