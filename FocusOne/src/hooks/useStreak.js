import { useSessions } from "../contexts/SessionsContext";

export function useStreak() {
  const { currentStreak } = useSessions();
  const label =
    currentStreak === 0
      ? "Start your streak!"
      : currentStreak === 1
      ? "1 day streak 🔥"
      : `${currentStreak} day streak 🔥`;
  return { count: currentStreak, label };
}
