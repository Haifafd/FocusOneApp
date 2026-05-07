import { Component } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.warn("App error:", error, info);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.wrap}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.msg}>{String(this.state.error?.message || this.state.error)}</Text>
          <Pressable onPress={this.reset} style={styles.btn}>
            <Text style={styles.btnText}>Try again</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12, color: "#111827" },
  msg: { fontSize: 14, color: "#6B7280", textAlign: "center", marginBottom: 24 },
  btn: { backgroundColor: "#6366F1", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  btnText: { color: "#fff", fontWeight: "600" },
});
