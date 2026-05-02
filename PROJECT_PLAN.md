# 📋 FocusOne — Project Plan & Team Tasks

> This file shows what's done, what's left, and which folders each member needs to recreate when starting their feature.

---

## ✅ Already Done (Foundation)

These are shared across all features. **Do not modify** unless you discuss with the team.

### Setup & Configuration
- [x] Expo project initialized with JavaScript (Expo Router)
- [x] Folder structure scaffolded (feature-based)
- [x] Git repository organized
- [x] `react-native-svg` installed
- [x] `@react-native-async-storage/async-storage` installed

### Theme System
- [x] `constants/colors.js` — Light & Dark color palettes
- [x] `constants/typography.js` — font sizes, spacing, radius
- [x] `contexts/ThemeContext.js` — theme state with persistence
- [x] Light + Dark mode fully working

### Common Components
- [x] `components/common/Button.js` — themed button (primary/secondary/outline)
- [x] `components/common/Input.js` — themed input with label & error
- [x] `components/common/Card.js` — themed card

### Storage Service
- [x] `services/storage.js` — AsyncStorage wrapper with unified keys

### Authentication
- [x] `contexts/AuthContext.js` — register/login/logout with persistence
- [x] `app/(auth)/_layout.js`
- [x] `app/(auth)/login.js` — fully functional login
- [x] `app/(auth)/register.js` — fully functional register

### Onboarding
- [x] `components/onboarding/OnboardingIllustration.js` — 3 custom SVG illustrations
- [x] `app/(onboarding)/_layout.js`
- [x] `app/(onboarding)/index.js` — swipeable onboarding with dots

### Root
- [x] `app/_layout.js` — wraps app with ThemeProvider + AuthProvider
- [x] `app/index.js` — temporary test menu (will become splash later)

### Documentation
- [x] `THEME_GUIDE.md` — rules every member must follow

---

## 📋 What's Left — Features & Empty Folders

When we scaffolded the structure, we created some folders that we later removed because they were empty (Expo Router gets confused by empty folders). **Each member must recreate her folder when starting her feature.**

---

### 🟦 Feature 1: Tabs Navigation + Home Screen

**Folders to recreate:**
- `app/(tabs)/` (with `_layout.js`, `home.js`, `goals.js`, `progress.js`, `settings.js`)
- `components/home/` (with `DailyGoalCard.js`, `CurrentTaskCard.js`)

**Files to create:**

| File | Purpose |
|---|---|
| `app/(tabs)/_layout.js` | Tab bar configuration (4 tabs) |
| `app/(tabs)/home.js` | Home screen with daily goal & current task |
| `components/home/DailyGoalCard.js` | Card showing daily goal + progress bar |
| `components/home/CurrentTaskCard.js` | Card showing current task + Start Focus button |

**What it should do:**
- Display the user's daily goal with progress percentage
- Show current task with "Start Focus" and "+ Add Task" buttons
- Display a motivational quote (from REST API later)
- Navigate to Focus Timer when "Start Focus" is pressed

**Storage keys used:**
- `STORAGE_KEYS.GOALS` (read)
- `STORAGE_KEYS.TASKS` (read)

---

### 🟩 Feature 2: Goals Management

**Folders to recreate:**
- `app/goal/` (with `create.js`)
- `components/goals/` (with `GoalCard.js`, `GoalsList.js`)
- `contexts/GoalsContext.js` (new context)

**Files to create:**

| File | Purpose |
|---|---|
| `app/(tabs)/goals.js` | Goals overview (list of all goals) |
| `app/goal/create.js` | Create / Edit goal screen |
| `components/goals/GoalCard.js` | Single goal card with progress |
| `components/goals/GoalsList.js` | Scrollable list of goals |
| `contexts/GoalsContext.js` | State management for goals (add, edit, delete) |

**What it should do:**
- List all goals with completion percentage
- Create new goal with: title, description, deadline, priority, daily reminder
- Edit existing goal
- Delete goal

**Storage keys used:**
- `STORAGE_KEYS.GOALS` (read/write)

---

### 🟧 Feature 3: Focus Timer + Session Complete

**Folders to recreate:**
- `app/focus/` (with `timer.js`, `complete.js`)
- `components/focus/` (with `TimerCircle.js`, `TimerControls.js`)
- `hooks/useTimer.js` (custom hook)

**Files to create:**

| File | Purpose |
|---|---|
| `app/focus/timer.js` | Focus session timer screen |
| `app/focus/complete.js` | Session complete celebration screen |
| `components/focus/TimerCircle.js` | Animated circular timer (SVG) |
| `components/focus/TimerControls.js` | Pause / Stop buttons |
| `hooks/useTimer.js` | Countdown logic with pause/resume |

**What it should do:**
- Display countdown timer (default 25 min, configurable)
- Show task name & motivational quote
- Pause / Resume / Stop buttons
- On completion → navigate to Session Complete screen
- Session Complete shows: duration, streak, "Add Note" or "Back to Home"

**Storage keys used:**
- `STORAGE_KEYS.SESSIONS` (write)
- `STORAGE_KEYS.SETTINGS` (read — for default duration)

---

### 🟪 Feature 4: Progress Dashboard + Notes

**Folders to recreate:**
- `app/note/` (with `create.js`)
- `components/progress/` (with `WeeklyChart.js`, `TodaySessionsCard.js`, `WeeklySessionsCard.js`)

**Files to create:**

| File | Purpose |
|---|---|
| `app/(tabs)/progress.js` | Progress dashboard screen |
| `app/note/create.js` | Create new note (text + image) |
| `components/progress/WeeklyChart.js` | Bar chart for weekly sessions |
| `components/progress/TodaySessionsCard.js` | Today's session count card |
| `components/progress/WeeklySessionsCard.js` | This week's sessions card |

**What it should do:**
- Show today's focus sessions count
- Show weekly focus sessions count
- Bar chart of sessions per day (S, M, T, W, T, F, S)
- Motivational message ("Keep up the great work!")
- Notes screen: title, body, optional photo (uses camera/gallery)

**Storage keys used:**
- `STORAGE_KEYS.SESSIONS` (read)
- `STORAGE_KEYS.NOTES` (read/write)

**Extra package needed:**
```bash
npx expo install expo-image-picker
```

---

### 🟥 Feature 5: Settings + Final Integration

**Folders to recreate:**
- `components/settings/` (with `SettingItem.js`, `ToggleSwitch.js`)
- `contexts/SettingsContext.js` (new context)

**Files to create:**

| File | Purpose |
|---|---|
| `app/(tabs)/settings.js` | Settings screen |
| `components/settings/SettingItem.js` | Single setting row |
| `components/settings/ToggleSwitch.js` | Themed toggle switch |
| `contexts/SettingsContext.js` | State for settings |

**What it should do:**
- Default focus duration (15/25/45/60 min)
- Notifications toggle
- Dark mode toggle (already wired via ThemeContext)
- Reset Data button (with confirmation)
- Logout button

**Storage keys used:**
- `STORAGE_KEYS.SETTINGS` (read/write)
- `STORAGE_KEYS.THEME` (handled by ThemeContext)
- `storage.clear()` for Reset Data

**Member 5 also responsible for:**
- Replacing `app/index.js` test menu with smart splash that routes:
  - First time → Onboarding
  - Logged in → Tabs/Home
  - Logged out (returning user) → Login
- REST API integration for motivational quotes
- Final testing & bug fixes

---

## ⚠️ Important Rules for Everyone

### 1. Folders Are Empty? Don't Worry
The folders `app/(tabs)`, `app/focus`, `app/goal`, `app/note`, `components/home`, `components/goals`, `components/focus`, `components/progress`, `components/settings`, and `hooks/` were intentionally removed because Expo Router crashes on empty folders. **Recreate yours when you start.**

### 2. Create Folders Only When You Have a File
```powershell
# Wrong: create empty folder first
New-Item -ItemType Directory "components/home"

# Right: create folder + first file together
New-Item -ItemType Directory -Force "components/home"
# Then immediately create DailyGoalCard.js inside
```

Or simpler — just create the file in VS Code and the folder is auto-created.

### 3. Branch Naming
Use feature branches:
```bash
git checkout -b feature/home-screen
git checkout -b feature/goals-management
git checkout -b feature/focus-timer
git checkout -b feature/progress-dashboard
git checkout -b feature/settings
```

### 4. Read THEME_GUIDE.md First
Before starting your feature, **everyone reads `THEME_GUIDE.md`** to learn:
- How to use theme colors
- How to use Button, Input, Card
- How to save/read data with storage service
- How to navigate with Expo Router

### 5. Test on Both Light & Dark Mode
Every screen must work on both modes. Toggle the theme from the test menu and verify nothing looks broken.

---

## 🗓️ Suggested Order (if working sequentially)

If only one person can work at a time, this is the recommended order:

1. **Tabs + Home** (Member 1) — needed by everyone for navigation
2. **Goals Management** (Member 2) — Home depends on goals data
3. **Focus Timer** (Member 3) — needs to navigate from Home
4. **Progress + Notes** (Member 4) — needs sessions data from Timer
5. **Settings + Integration** (Member 5) — final polish, depends on all above

---

## 📞 Stuck?

- Theme issue → check `THEME_GUIDE.md`
- Storage issue → use `storage.get/set` with `STORAGE_KEYS`
- Navigation issue → use `useRouter()` from `expo-router`
- White screen → check console for errors, check folder names (no empty folders!)

**Good luck, team! 💙**