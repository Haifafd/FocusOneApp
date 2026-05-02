# 🎨 FocusOne — Theme & Storage Guide

> Read this **before** writing any screen. Every screen must follow these rules so the app stays consistent across Light/Dark mode.

---

## 📚 Table of Contents

1. [Project Structure](#project-structure)
2. [Theme Files](#theme-files)
3. [Storage Files](#storage-files)
4. [How to Build a New Screen](#how-to-build-a-new-screen)
5. [Common Mistakes to Avoid](#common-mistakes-to-avoid)
6. [Pre-Commit Checklist](#pre-commit-checklist)

---

## 📂 Project Structure
FocusOne/
├── app/
│   ├── _layout.js              ← Root layout (wraps everything in providers)
│   ├── index.js                ← Entry / test menu screen
│   ├── (auth)/
│   │   ├── _layout.js
│   │   ├── login.js
│   │   └── register.js
│   └── (onboarding)/
│       ├── _layout.js
│       └── index.js
│
├── components/
│   ├── common/                 ← Reusable UI (Button, Card, Input)
│   │   ├── Button.js
│   │   ├── Card.js
│   │   └── Input.js
│   └── onboarding/
│       └── OnboardingIllustration.js
│
├── contexts/
│   ├── ThemeContext.js         ← Light/Dark mode logic
│   └── AuthContext.js          ← User session logic
│
├── services/
│   └── storage.js              ← AsyncStorage wrapper
│
└── constants/
├── colors.js               ← Color palette + light/dark themes
└── typography.js           ← Font sizes, spacing, radius
---

## 🎨 Theme Files

### 1. `constants/colors.js`

**What it contains:** A color palette + two theme objects (`lightTheme`, `darkTheme`).

**Available theme keys (use these in every screen):**

| Key | Use for |
|---|---|
| `theme.background` | Main screen background |
| `theme.surface` | Secondary backgrounds (input fields, cards) |
| `theme.card` | Card components |
| `theme.text` | Main text color |
| `theme.textSecondary` | Subtitles, descriptions |
| `theme.textMuted` | Placeholder, disabled text |
| `theme.border` | Borders, dividers |
| `theme.primary` | Brand blue (buttons, links, highlights) |
| `theme.primaryDark` | Pressed buttons, gradients |
| `theme.success` | Success messages (green) |
| `theme.warning` | Warning messages (orange) |
| `theme.danger` | Errors (red) |
| `theme.shadow` | Card shadows |

> ❌ **NEVER use hard-coded colors like `"#27A9F2"` or `"white"` in your screen.**
> ✅ **Always use `theme.something`** so it switches automatically with Dark Mode.

---

### 2. `constants/typography.js`

**What it contains:** Three exports — `typography`, `spacing`, `radius`.

**Use them like this:**

```javascript
import { typography, spacing, radius } from "../../constants/typography";

// Font sizes:
typography.size.xs   // 12
typography.size.sm   // 14
typography.size.base // 16
typography.size.lg   // 18
typography.size.xl   // 20
typography.size["2xl"] // 24
typography.size["3xl"] // 30

// Font weights:
typography.weight.regular  // "400"
typography.weight.medium   // "500"
typography.weight.semibold // "600"
typography.weight.bold     // "700"

// Spacing (margin/padding):
spacing.xs   // 4
spacing.sm   // 8
spacing.md   // 12
spacing.lg   // 16
spacing.xl   // 24
spacing["2xl"] // 32
spacing["3xl"] // 48

// Border radius:
radius.sm   // 6
radius.md   // 10
radius.lg   // 16
radius.xl   // 24
radius.full // 9999 (for circles)
```

> ❌ **NEVER write hard numbers like `padding: 24` directly.**
> ✅ **Use `padding: spacing.xl` instead.**

---

### 3. `contexts/ThemeContext.js`

**What it contains:** The provider that manages theme state + the `useTheme()` hook.

**How to use in any screen:**

```javascript
import { useTheme } from "../../contexts/ThemeContext";

export default function MyScreen() {
  const { theme, activeMode, toggleTheme } = useTheme();

  // theme       → current theme object (lightTheme or darkTheme)
  // activeMode  → "light" or "dark"
  // toggleTheme → function to switch theme

  return (
    <View style={{ backgroundColor: theme.background }}>
      <Text style={{ color: theme.text }}>Hello</Text>
    </View>
  );
}
```

**Theme is automatically saved** to AsyncStorage. No need to handle persistence yourself.

---

### 4. Common Components — `components/common/`

> **Use these instead of `TextInput`, `TouchableOpacity`, or raw `View` cards.** They are already theme-aware.

#### `Button.js`

```javascript
import Button from "../../components/common/Button";

<Button title="Login" onPress={handleLogin} />
<Button title="Cancel" variant="secondary" onPress={cancel} />
<Button title="Outlined" variant="outline" onPress={action} />
<Button title="Loading..." loading={true} />
<Button title="Disabled" disabled={true} />
```

**Props:**
- `title` (required): string
- `onPress` (required): function
- `variant`: `"primary"` (default) | `"secondary"` | `"outline"`
- `loading`: boolean (shows spinner)
- `disabled`: boolean
- `style`: extra style object

#### `Input.js`

```javascript
import Input from "../../components/common/Input";

<Input
  label="Email"
  placeholder="example@email.com"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  error={errors.email}
/>
```

**Props:**
- `label`: string (shown above the input)
- `placeholder`: string
- `value` & `onChangeText` (required)
- `secureTextEntry`: boolean (for passwords)
- `keyboardType`: `"default"` | `"email-address"` | `"numeric"` | etc.
- `error`: string (shows red error message below)

#### `Card.js`

```javascript
import Card from "../../components/common/Card";

<Card>
  <Text style={{ color: theme.text }}>Anything inside</Text>
</Card>

<Card style={{ marginTop: spacing.lg }}>
  <Text>Custom margin</Text>
</Card>
```

---

## 💾 Storage Files

### 1. `services/storage.js`

**What it contains:** A wrapper around AsyncStorage + standardized keys.

**Why we use it:** Auto JSON conversion + error handling + consistent keys across the app.

**How to use:**

```javascript
import { storage, STORAGE_KEYS } from "../../services/storage";

// Save data (auto JSON conversion)
await storage.set(STORAGE_KEYS.GOALS, [{ id: 1, title: "Read books" }]);

// Read data
const goals = await storage.get(STORAGE_KEYS.GOALS);
// returns: null if not found, or the actual value

// Remove data
await storage.remove(STORAGE_KEYS.GOALS);

// Clear all data (for "Reset Data" in Settings)
await storage.clear();
```

**Available keys (use these — don't make up your own):**

```javascript
STORAGE_KEYS.USER             // Current logged-in user (session)
STORAGE_KEYS.USERS            // List of all registered accounts
STORAGE_KEYS.GOALS            // Long-term goals
STORAGE_KEYS.TASKS            // Tasks under goals
STORAGE_KEYS.SESSIONS         // Focus session history
STORAGE_KEYS.NOTES            // User notes
STORAGE_KEYS.SETTINGS         // App settings
STORAGE_KEYS.THEME            // Theme preference (handled by ThemeContext)
STORAGE_KEYS.ONBOARDING_DONE  // Has user seen onboarding?
```

> ❌ **NEVER use AsyncStorage directly** like `AsyncStorage.setItem("goals", ...)`.
> ✅ **Always go through `storage.set/get`** so JSON parsing is handled.

---

### 2. `contexts/AuthContext.js`

**What it contains:** Authentication state + register/login/logout logic.

**How to use:**

```javascript
import { useAuth } from "../../contexts/AuthContext";

export default function MyScreen() {
  const { user, isAuthenticated, login, register, logout } = useAuth();

  // user            → current user object (or null)
  // isAuthenticated → true if logged in
  // login({ email, password })       → returns { success, error? }
  // register({ name, email, password }) → returns { success, error? }
  // logout()                         → returns { success }

  // Example:
  const handleLogin = async () => {
    const result = await login({ email, password });
    if (result.success) {
      router.replace("/(tabs)/home");
    } else {
      alert(result.error);
    }
  };
}
```

**User session is automatically persisted** in AsyncStorage. The user stays logged in even after closing the app.

---

## 🛠️ How to Build a New Screen

### Step 1: Create the file

For Expo Router, your screen path = the file path. Examples:
- Home → `app/(tabs)/home.js`
- Settings → `app/(tabs)/settings.js`
- Create Goal → `app/goal/create.js`

### Step 2: Use this template

```javascript
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { typography, spacing } from "../../constants/typography";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

export default function MyScreen() {
  const { theme } = useTheme();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={styles.container}
    >
      <Text style={[styles.title, { color: theme.text }]}>
        Screen Title
      </Text>

      <Card>
        <Text style={{ color: theme.text }}>Card content</Text>
      </Card>

      <Button
        title="Click me"
        onPress={() => {}}
        style={{ marginTop: spacing.lg }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
  },
  title: {
    fontSize: typography.size["2xl"],
    fontWeight: typography.weight.bold,
    marginBottom: spacing.lg,
    // ❌ NO color here — it's set inline using theme
  },
});
```

### Step 3: Pattern for theme-aware styles

```javascript
// Static styles (no colors) → in StyleSheet
const styles = StyleSheet.create({
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
  },
});

// Dynamic (theme) styles → inline
<Text style={[styles.title, { color: theme.text }]}>Hello</Text>
```

---

## ❌ Common Mistakes to Avoid

### Mistake 1: Hard-coded colors

```javascript
// ❌ WRONG
<View style={{ backgroundColor: "#FFFFFF" }}>
<Text style={{ color: "black" }}>

// ✅ RIGHT
<View style={{ backgroundColor: theme.background }}>
<Text style={{ color: theme.text }}>
```

### Mistake 2: Hard-coded numbers

```javascript
// ❌ WRONG
padding: 24,
marginTop: 16,
borderRadius: 12,

// ✅ RIGHT
padding: spacing.xl,
marginTop: spacing.lg,
borderRadius: radius.md,
```

### Mistake 3: Using TextInput / TouchableOpacity directly

```javascript
// ❌ WRONG — won't follow theme
<TextInput placeholder="Email" />
<TouchableOpacity><Text>Submit</Text></TouchableOpacity>

// ✅ RIGHT — uses our themed components
<Input label="Email" value={email} onChangeText={setEmail} />
<Button title="Submit" onPress={handleSubmit} />
```

### Mistake 4: Direct AsyncStorage

```javascript
// ❌ WRONG
import AsyncStorage from "@react-native-async-storage/async-storage";
await AsyncStorage.setItem("myGoals", JSON.stringify(goals));

// ✅ RIGHT
import { storage, STORAGE_KEYS } from "../../services/storage";
await storage.set(STORAGE_KEYS.GOALS, goals);
```

### Mistake 5: Using `navigation.navigate()` instead of Expo Router

```javascript
// ❌ WRONG — that's React Navigation, not Expo Router
navigation.navigate("Home");

// ✅ RIGHT
import { useRouter } from "expo-router";
const router = useRouter();
router.push("/(tabs)/home");
router.replace("/(auth)/login");  // replace = no back button
router.back();
```

### Mistake 6: Importing Button as `button` (lowercase)

```javascript
// ❌ WRONG (will break on Mac/Linux even if works on Windows)
import button from "../../components/common/button";

// ✅ RIGHT
import Button from "../../components/common/Button";
```

### Mistake 7: Forgetting `useTheme()` inside the component

```javascript
// ❌ WRONG — theme is undefined here
const styles = StyleSheet.create({
  title: { color: theme.text },  // ERROR
});

// ✅ RIGHT — theme is only available inside the component
export default function MyScreen() {
  const { theme } = useTheme();
  return <Text style={{ color: theme.text }}>Hello</Text>;
}
```

---

## ✅ Pre-Commit Checklist

Before pushing your screen, verify:

- [ ] No hard-coded colors (`"#fff"`, `"black"`, `"red"`) — use `theme.*`
- [ ] No magic numbers for spacing — use `spacing.*` and `radius.*`
- [ ] All text colors use `theme.text` / `theme.textSecondary` / `theme.textMuted`
- [ ] All backgrounds use `theme.background` / `theme.surface` / `theme.card`
- [ ] Used `<Button />` and `<Input />` and `<Card />` from `components/common/`
- [ ] Used `storage.set/get` (not AsyncStorage directly)
- [ ] Used `useRouter()` from `expo-router` (not `navigation` prop)
- [ ] Tested in **Light mode**
- [ ] Tested in **Dark mode** — toggle from the test menu
- [ ] No console errors when navigating to your screen

---

## 🎯 Quick Reference Card

```javascript
// ===== ALWAYS START YOUR SCREEN WITH THESE =====
import { useTheme } from "../../contexts/ThemeContext";        // theme
import { useAuth } from "../../contexts/AuthContext";          // user (if needed)
import { storage, STORAGE_KEYS } from "../../services/storage"; // saving data
import { typography, spacing, radius } from "../../constants/typography";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Card from "../../components/common/Card";
import { useRouter } from "expo-router";

// ===== INSIDE THE COMPONENT =====
const { theme } = useTheme();
const router = useRouter();
```

---

## 📞 Need Help?

If something looks weird in Dark Mode → you probably hard-coded a color somewhere.
If a value isn't saving → check you're using `storage.set` with the right `STORAGE_KEYS`.
If navigation doesn't work → make sure you're using `router.push` not `navigation.navigate`.

**Happy coding! 💙**