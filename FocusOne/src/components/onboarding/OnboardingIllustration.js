import Svg, {
  Circle,
  Rect,
  Path,
  G,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";
import { useTheme } from "../../contexts/ThemeContext";

// Illustration 1: Welcome — central focused element with orbiting distractions
export function WelcomeIllustration({ size = 280 }) {
  const { theme } = useTheme();

  return (
    <Svg width={size} height={size} viewBox="0 0 280 280">
      <Defs>
        <LinearGradient id="centerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={theme.primary} stopOpacity="1" />
          <Stop offset="100%" stopColor={theme.primaryDark} stopOpacity="1" />
        </LinearGradient>
      </Defs>

      {/* Orbits (faded distractions) */}
      <Circle
        cx="140"
        cy="140"
        r="110"
        stroke={theme.border}
        strokeWidth="1"
        strokeDasharray="4,6"
        fill="none"
      />
      <Circle
        cx="140"
        cy="140"
        r="80"
        stroke={theme.border}
        strokeWidth="1"
        strokeDasharray="4,6"
        fill="none"
      />

      {/* Distractions */}
      <Circle cx="50" cy="100" r="8" fill={theme.textMuted} opacity="0.4" />
      <Circle cx="230" cy="80" r="6" fill={theme.textMuted} opacity="0.4" />
      <Circle cx="220" cy="200" r="10" fill={theme.textMuted} opacity="0.3" />
      <Circle cx="60" cy="220" r="7" fill={theme.textMuted} opacity="0.4" />
      <Circle cx="250" cy="140" r="5" fill={theme.textMuted} opacity="0.3" />

      {/* Central focused element */}
      <Circle cx="140" cy="140" r="50" fill="url(#centerGrad)" />

      {/* Checkmark */}
      <Path
        d="M120 140 L135 155 L162 125"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Glow */}
      <Circle
        cx="140"
        cy="140"
        r="60"
        stroke={theme.primary}
        strokeWidth="2"
        opacity="0.3"
        fill="none"
      />
    </Svg>
  );
}

// Illustration 2: One Goal — a single highlighted goal among many
export function OneGoalIllustration({ size = 280 }) {
  const { theme } = useTheme();

  return (
    <Svg width={size} height={size} viewBox="0 0 280 280">
      <Defs>
        <LinearGradient id="goalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor={theme.primary} stopOpacity="1" />
          <Stop offset="100%" stopColor={theme.primaryDark} stopOpacity="1" />
        </LinearGradient>
      </Defs>

      {/* Background faded tasks */}
      <G opacity="0.3">
        <Rect
          x="40"
          y="40"
          width="200"
          height="32"
          rx="8"
          fill={theme.textMuted}
        />
        <Rect
          x="40"
          y="84"
          width="160"
          height="32"
          rx="8"
          fill={theme.textMuted}
        />
      </G>

      {/* Highlighted goal */}
      <Rect
        x="30"
        y="128"
        width="220"
        height="56"
        rx="12"
        fill="url(#goalGrad)"
      />

      {/* Star icon */}
      <Path
        d="M55 156 L60 146 L65 156 L75 158 L67 165 L69 175 L60 170 L51 175 L53 165 L45 158 Z"
        fill="#FFFFFF"
      />

      {/* Goal text bars */}
      <Rect x="85" y="148" width="120" height="6" rx="3" fill="#FFFFFF" />
      <Rect
        x="85"
        y="160"
        width="80"
        height="4"
        rx="2"
        fill="#FFFFFF"
        opacity="0.7"
      />

      {/* More faded tasks */}
      <G opacity="0.3">
        <Rect
          x="40"
          y="200"
          width="180"
          height="32"
          rx="8"
          fill={theme.textMuted}
        />
        <Rect
          x="40"
          y="244"
          width="200"
          height="32"
          rx="8"
          fill={theme.textMuted}
        />
      </G>

      {/* Sparkle accents */}
      <Circle cx="265" cy="156" r="3" fill={theme.primary} />
      <Circle cx="15" cy="156" r="3" fill={theme.primary} />
      <Circle cx="265" cy="140" r="2" fill={theme.primary} opacity="0.6" />
      <Circle cx="15" cy="172" r="2" fill={theme.primary} opacity="0.6" />
    </Svg>
  );
}

// Illustration 3: Focus Sessions — clean timer/clock visual
export function FocusSessionsIllustration({ size = 280 }) {
  const { theme } = useTheme();

  return (
    <Svg width={size} height={size} viewBox="0 0 280 280">
      <Defs>
        <LinearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={theme.primary} stopOpacity="1" />
          <Stop offset="100%" stopColor={theme.primaryDark} stopOpacity="1" />
        </LinearGradient>
      </Defs>

      {/* Outer track */}
      <Circle
        cx="140"
        cy="140"
        r="90"
        stroke={theme.border}
        strokeWidth="12"
        fill="none"
      />

      {/* Progress arc (75%) */}
      <Circle
        cx="140"
        cy="140"
        r="90"
        stroke="url(#ringGrad)"
        strokeWidth="12"
        fill="none"
        strokeDasharray="565.5"
        strokeDashoffset="141"
        strokeLinecap="round"
        transform="rotate(-90 140 140)"
      />

      {/* Inner circle */}
      <Circle cx="140" cy="140" r="65" fill={theme.surface} />

      {/* Clock hands */}
      <Path
        d="M140 140 L140 95"
        stroke={theme.primary}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <Path
        d="M140 140 L170 140"
        stroke={theme.text}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Center dot */}
      <Circle cx="140" cy="140" r="6" fill={theme.primary} />

      {/* Tick marks */}
      <Path
        d="M140 60 L140 70"
        stroke={theme.text}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Path
        d="M140 210 L140 220"
        stroke={theme.text}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Path
        d="M60 140 L70 140"
        stroke={theme.text}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Path
        d="M210 140 L220 140"
        stroke={theme.text}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Floating focus indicators */}
      <Circle cx="240" cy="60" r="6" fill={theme.primary} opacity="0.6" />
      <Circle cx="40" cy="80" r="4" fill={theme.primary} opacity="0.5" />
      <Circle cx="50" cy="220" r="5" fill={theme.primary} opacity="0.5" />
      <Circle cx="230" cy="225" r="4" fill={theme.primary} opacity="0.6" />
    </Svg>
  );
}