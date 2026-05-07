# FocusOne 🎯

One goal at a time. Distraction-free focus.

## Tech Stack

- Expo SDK 54, Expo Router 6
- React Native 0.81, React 19
- AsyncStorage (offline-first)
- Plus Jakarta Sans (custom font)
- Reanimated 4 (animations)

## Features

- 🎯 Goals & tasks with progress tracking
- ⏱️ Drift-free Pomodoro-style focus timer
- 🔥 Daily streak tracking
- 📊 Weekly session statistics
- 📝 Notes with photos and freehand drawing
- 🌙 Light & Dark mode
- 🔔 Notifications-ready architecture

## Architecture

```text
app/                    # Expo Router routes (thin)
src/
  components/ui/        # Generic primitives (Button, Input, ProgressRing…)
  components/<feature>/ # Feature-specific UI
  contexts/             # Theme, Auth, Goals, Sessions, Notes, Settings, Toast
  hooks/                # useTimer, useStreak, useHaptics, useDebounce
  services/             # storage, quotes
  repositories/         # Domain CRUD over AsyncStorage
  theme/                # colors, typography, spacing, radius, shadows
  utils/                # date, format, validation, ids
```

## Setup

```bash
npm install
npx expo start -c
```

## Known Limitations

- Passwords stored as-is in AsyncStorage (offline-only app, no server). For production, add hashing via `expo-crypto`.
- Background timer not supported — keep app open during a session.

## Roadmap

- Server sync, push notifications, achievements, social streaks
