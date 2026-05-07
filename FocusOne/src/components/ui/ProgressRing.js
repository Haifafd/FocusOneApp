import Svg, { Circle, G } from "react-native-svg";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { typography } from "../../theme";

export default function ProgressRing({ progress = 0, size = 120, strokeWidth = 10, color, label, sublabel }) {
  const { theme } = useTheme();
  const stroke = color || theme.primary;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          <Circle cx={size / 2} cy={size / 2} r={radius} stroke={theme.surfaceMuted} strokeWidth={strokeWidth} fill="none" />
          <Circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke={stroke} strokeWidth={strokeWidth} fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <View style={styles.inner}>
        {label && <Text style={[styles.label, { color: theme.text, fontFamily: typography.family.bold }]}>{label}</Text>}
        {sublabel && <Text style={[styles.sub, { color: theme.textSecondary }]}>{sublabel}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
  inner: { position: "absolute", alignItems: "center" },
  label: { fontSize: 22 },
  sub: { fontSize: 11, marginTop: 2 },
});
