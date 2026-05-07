import { useRef, useState } from "react";
import { View, StyleSheet, PanResponder } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function DrawingCanvas({ paths, onChange, color = "#6366F1" }) {
  const [currentPath, setCurrentPath] = useState("");

  // Refs hold the latest values without re-creating the PanResponder.
  const pathsRef = useRef(paths);
  pathsRef.current = paths;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Track the in-flight stroke in a ref so we never call parent setState
  // from inside React's setState updater (which runs during render).
  const currentPathRef = useRef("");

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const { locationX, locationY } = e.nativeEvent;
        const next = `M${locationX},${locationY}`;
        currentPathRef.current = next;
        setCurrentPath(next);
      },
      onPanResponderMove: (e) => {
        const { locationX, locationY } = e.nativeEvent;
        const next = `${currentPathRef.current} L${locationX},${locationY}`;
        currentPathRef.current = next;
        setCurrentPath(next);
      },
      onPanResponderRelease: () => {
        const finished = currentPathRef.current;
        currentPathRef.current = "";
        setCurrentPath("");
        if (finished) {
          onChangeRef.current([...pathsRef.current, finished]);
        }
      },
    })
  ).current;

  return (
    <View style={styles.canvas} {...panResponder.panHandlers}>
      <Svg style={StyleSheet.absoluteFill}>
        {paths.map((p, i) => (
          <Path key={i} d={p} stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" />
        ))}
        {currentPath ? (
          <Path d={currentPath} stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" />
        ) : null}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: { flex: 1, overflow: "hidden" },
});
