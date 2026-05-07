import { View, StyleSheet } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

export default function ProgressBar({ progress = 0, height = 8, color }) {
  const { theme } = useTheme();
  return (
    <View style={[styles.track, { backgroundColor: theme.surfaceMuted, height, borderRadius: height / 2 }]}>
      <View style={[styles.fill, { width: `${Math.min(100, Math.max(0, progress))}%`, backgroundColor: color || theme.primary, borderRadius: height / 2 }]} />
    </View>
  );
}

const styles = StyleSheet.create({ track: { overflow: "hidden", width: "100%" }, fill: { height: "100%" } });
