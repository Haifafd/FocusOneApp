# Changelog

## v1.0.0 — Initial Release

Seven-prompt rebuild from a prototype to a delivery-ready app.

### Prompt 1 — Foundation Reset

- Deleted dead files (`app/demogoals` extensionless file, mock `AppContext.js`).
- Restructured everything under `src/` (components, contexts, services, theme, hooks, utils, repositories).
- Renamed routes for Expo Router conventions: `Homescreen.js` → `(tabs)/index.js`, `foucss.js` → `focus/[taskId].js`, `firstscreen.js` → `(auth)/welcome.js`, `Camera.js` → `note/new.js`, etc.
- Created `focus/` and `note/` route groups with their own `_layout.js`.
- Reduced tab bar to 4 tabs (Home, Goals, Progress, Settings).
- Added smart routing in `app/index.js`: onboarding → auth → tabs based on state.
- Fixed every navigation path across the app.

### Prompt 2 — Unified Data Layer

- Cleaned up `services/storage.js` wrapper with consistent keys.
- Added `utils/ids.js` (id generator) and `utils/date.js` (today/week helpers).
- Added 5 repositories: `goals.repo`, `sessions.repo`, `notes.repo`, `settings.repo`, `users.repo`.
- Refactored `AuthContext` to use `usersRepo` instead of inline storage calls.
- Created 4 domain contexts: `GoalsContext`, `SessionsContext`, `NotesContext`, `SettingsContext` (each with `refresh` + computed memos).
- Wired all providers in `app/_layout.js`.
- Removed every direct `AsyncStorage` call from `app/` screens.
- Connected focus session completion to `sessionsRepo.create`.

### Prompt 3 — Theme & Identity

- Replaced colour palette with modern Indigo-based theme (`#6366F1`).
- Added `surfaceMuted`, `primarySoft`, `onPrimary`, `info` tokens for both light/dark.
- Split `typography.js` into separate `spacing.js`, `radius.js`, `shadows.js`, plus a barrel `index.js`.
- Loaded Plus Jakarta Sans (5 weights) via `@expo-google-fonts`.
- Added splash hide on font ready.
- Updated `app.json` identity: name "FocusOne", slug `focusone`, indigo splash, bundle IDs.

### Prompt 4 — UI Component Library

- Rebuilt `Button` with 5 variants × 3 sizes, scale-on-press, loading state, icon prop.
- Rebuilt `Input` with multiline support and prop passthrough.
- Rebuilt `Card` with `elevated`/`outlined` variants and configurable padding.
- Created `ProgressRing` (SVG), `ProgressBar`, `Header` (safe-area aware), `EmptyState`, `Section`.
- Added `ToastContext` with Reanimated FadeIn/FadeOut and 4 toast types.
- Wired `ToastProvider` between Theme and Auth providers.

### Prompt 5 — Hooks Library

- `useHaptics` — unified haptic feedback API.
- `useDebounce` — generic debounce hook.
- `useTimer` — drift-free timer using `Date.now()` accumulators.
- `useStreak` — wrapper around `SessionsContext.currentStreak` with label.
- `services/quotes.js` — cached quote fetcher with 5s timeout and 15-quote local fallback.
- `utils/validation.js` (`isValidEmail`, `passwordIssues`).
- `utils/format.js` (`formatDate`, `greeting`, `pluralize`).

### Prompt 6 — Screens Refactor

- Login: haptics + toast on success/error, removed inline general-error block.
- Register: added `confirmPassword`, inline password rules (✓/○) using `passwordIssues`, disabled Submit until valid.
- Welcome: rebuilt with `ProgressRing` brand mark and clean themed CTAs.
- Home: rebuilt with `Animated.ScrollView` + `FadeInDown` cards, `ProgressBar`, real goal/streak data, Empty state, fetched quote.
- Goals: list-only with `FlatList`, new `GoalCard` component (memo), Empty state.
- New `goal/new.js` route as a modal form using `useSettings.defaultDuration`.
- Progress: real `useSessions` data, two stat cards, animated `WeeklyChart` with today's bar highlighted.
- Settings: `Section` + `SettingItem` layout, default-duration picker, `Reset Data` flow that clears storage and routes to onboarding, `My Notes` shortcut.
- Focus session: rebuilt around `useTimer`, `ProgressRing` 260px (tap to open duration picker sheet), Pause/Resume/Stop with haptics, addSession on complete.
- Focus complete: ZoomIn check, dynamic duration + streak tiles, themed CTAs.
- Notes: `Animated.FlatList` with `LinearTransition`, new `NoteCard` (memo), Empty state.
- New note: extracted `DrawingCanvas` component, replaced inline drawing logic, toast + haptics on save.

### Prompt 7 — Polish & Ship

- Added `ErrorBoundary` and wrapped the root Stack with it.
- Confirmed `FlatList` usage and `memo` on all card components from Prompt 6.
- Switched `NoteCard` photo rendering to `expo-image` with `transition` and `contentFit`.
- Updated `README.md` with tech stack, features, architecture, setup.
- Created this `CHANGELOG.md`.

### Bug fixes during the rebuild

- Fixed `Text.defaultProps.style` mutation that broke touch handlers in React 19 — removed the mutation; fonts applied per-component instead.
- Fixed barrel re-export issue under Metro by switching to import-then-export in `theme/index.js`.
- Fixed `DrawingCanvas` stale-closure bug that caused new strokes to overwrite old ones; now uses refs for paths/onChange.
- Fixed `DrawingCanvas` "setState during render" warning by tracking the in-flight stroke in a ref instead of the state updater.
- Fixed unreachable Save button in modal screens by enforcing minimum top inset in `Header` and increasing tap targets.
- Fixed unreachable Clear/Done buttons in the Drawing modal by computing safe-area padding manually inside the React Native `Modal`.

### Dependencies added

- `expo-linear-gradient`
- `expo-blur`
- `expo-av`
- `@expo-google-fonts/plus-jakarta-sans`
