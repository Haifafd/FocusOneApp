import { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { storage, STORAGE_KEYS } from "../../services/storage";
import Button from "../../components/common/button";
import {
  WelcomeIllustration,
  OneGoalIllustration,
  FocusSessionsIllustration,
} from "../../components/onboarding/OnboardingIllustration";
import { typography, spacing } from "../../constants/typography";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Welcome to FocusOne",
    subtitle: "Achieve More",
    description:
      "Cut through the noise. A focused mind achieves what scattered effort cannot.",
    Illustration: WelcomeIllustration,
  },
  {
    id: "2",
    title: "One Goal a Day",
    subtitle: "Stay Focused",
    description:
      "Pick the one thing that matters most today. Everything else can wait.",
    Illustration: OneGoalIllustration,
  },
  {
    id: "3",
    title: "Short Focus Sessions",
    subtitle: "Deep Work",
    description:
      "Work in distraction-free intervals. Track your progress and build momentum.",
    Illustration: FocusSessionsIllustration,
  },
];

export default function OnboardingScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = async () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await finishOnboarding();
    }
  };

  const handleSkip = async () => {
    await finishOnboarding();
  };

  const finishOnboarding = async () => {
    await storage.set(STORAGE_KEYS.ONBOARDING_DONE, true);
    router.replace("/(auth)/login");
  };

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      {/* Top bar with Skip */}
      <View style={styles.topBar}>
        {!isLastSlide ? (
          <Pressable onPress={handleSkip} style={styles.skipButton}>
            <Text style={[styles.skipText, { color: theme.textSecondary }]}>
              Skip
            </Text>
          </Pressable>
        ) : (
          <View style={styles.skipButton} />
        )}
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onMomentumScrollEnd={handleScroll}
        renderItem={({ item }) => (
          <Slide item={item} theme={theme} width={width} />
        )}
      />

      {/* Bottom area: dots + button */}
      <View style={styles.bottomArea}>
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: theme.primary,
                  width: index === currentIndex ? 24 : 8,
                  opacity: index === currentIndex ? 1 : 0.3,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={isLastSlide ? "Get Started" : "Next"}
            onPress={handleNext}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

// Single slide component
function Slide({ item, theme, width }) {
  const { Illustration } = item;

  return (
    <View style={[slideStyles.container, { width }]}>
      <View style={slideStyles.illustrationWrapper}>
        <Illustration size={Math.min(width * 0.75, 320)} />
      </View>

      <View style={slideStyles.textWrapper}>
        <Text style={[slideStyles.subtitle, { color: theme.primary }]}>
          {item.subtitle.toUpperCase()}
        </Text>
        <Text style={[slideStyles.title, { color: theme.text }]}>
          {item.title}
        </Text>
        <Text style={[slideStyles.description, { color: theme.textSecondary }]}>
          {item.description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    height: 50,
  },
  skipButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 36,
    minWidth: 60,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  skipText: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.medium,
  },
  bottomArea: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: spacing.lg,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    width: "100%",
  },
});

const slideStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  illustrationWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  textWrapper: {
    alignItems: "center",
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  subtitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.size["3xl"],
    fontWeight: typography.weight.bold,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  description: {
    fontSize: typography.size.base,
    textAlign: "center",
    lineHeight: typography.size.base * 1.5,
  },
});