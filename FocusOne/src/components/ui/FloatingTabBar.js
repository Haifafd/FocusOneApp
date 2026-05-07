import { View, Pressable, Text, StyleSheet, Platform } from "react-native";
import { BlurView } from "expo-blur";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { typography, spacing, radius, shadows } from "../../theme";

const HORIZONTAL_MARGIN = 16;

function TabButton({ route, isFocused, descriptor, onPress }) {
  const { theme } = useTheme();
  const { options } = descriptor;
  const label = options.title ?? route.name;
  const TabBarIcon = options.tabBarIcon;

  const animatedPill = useAnimatedStyle(() => ({
    opacity: withTiming(isFocused ? 1 : 0, { duration: 180 }),
    transform: [{ scale: withTiming(isFocused ? 1 : 0.85, { duration: 180 }) }],
  }));

  const animatedScale = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(isFocused ? 1 : 0.92, { duration: 180 }) }],
  }));

  const iconColor = isFocused ? theme.primary : theme.textMuted;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tab,
        pressed && { opacity: 0.7 },
      ]}
      hitSlop={6}
    >
      <Animated.View style={[styles.pill, animatedPill, { backgroundColor: theme.primarySoft }]} />
      <Animated.View style={[styles.tabContent, animatedScale]}>
        {TabBarIcon ? <TabBarIcon focused={isFocused} color={iconColor} size={22} /> : null}
        {isFocused && (
          <Text
            style={[
              styles.label,
              { color: theme.primary, fontFamily: typography.family.semibold },
            ]}
            numberOfLines={1}
          >
            {label}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

export default function FloatingTabBar({ state, descriptors, navigation }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, spacing.md);
  const blurTint = theme.mode === "dark" ? "dark" : "light";
  const overlayColor = theme.mode === "dark" ? "rgba(31,41,55,0.7)" : "rgba(255,255,255,0.7)";

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom }]}>
      <View style={[styles.shadowWrap, shadows.lg, { shadowColor: theme.shadow }]}>
        <BlurView
          intensity={Platform.OS === "ios" ? 60 : 90}
          tint={blurTint}
          style={[styles.bar, { borderColor: theme.border, backgroundColor: overlayColor }]}
        >
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const descriptor = descriptors[route.key];
            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };
            return (
              <TabButton
                key={route.key}
                route={route}
                isFocused={isFocused}
                descriptor={descriptor}
                onPress={onPress}
              />
            );
          })}
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: HORIZONTAL_MARGIN,
    right: HORIZONTAL_MARGIN,
    alignItems: "center",
  },
  shadowWrap: {
    width: "100%",
    borderRadius: radius.full,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    position: "relative",
  },
  pill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: spacing.xs,
    right: spacing.xs,
    borderRadius: radius.full,
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: spacing.sm,
  },
  label: { fontSize: typography.size.xs },
});
