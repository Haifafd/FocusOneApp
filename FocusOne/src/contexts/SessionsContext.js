import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { sessionsRepo } from "../repositories/sessions.repo";

const SessionsContext = createContext(null);

export function SessionsProvider({ children }) {
  const [sessions, setSessions] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(async () => {
    setSessions(await sessionsRepo.list());
  }, []);

  useEffect(() => {
    (async () => {
      await refresh();
      setIsLoaded(true);
    })();
  }, [refresh]);

  const addSession = useCallback(
    async (input) => {
      const s = await sessionsRepo.create(input);
      await refresh();
      return s;
    },
    [refresh]
  );

  const todayCount = useMemo(() => sessionsRepo.countToday(sessions), [sessions]);
  const weekCount = useMemo(() => sessionsRepo.countWeek(sessions), [sessions]);
  const weeklyChart = useMemo(() => sessionsRepo.weeklyChart(sessions), [sessions]);
  const currentStreak = useMemo(() => sessionsRepo.computeStreak(sessions), [sessions]);
  const totalMinutes = useMemo(
    () => sessions.reduce((sum, s) => sum + (Number(s.durationMinutes) || 0), 0),
    [sessions]
  );

  return (
    <SessionsContext.Provider
      value={{
        sessions,
        isLoaded,
        addSession,
        refresh,
        todayCount,
        weekCount,
        weeklyChart,
        currentStreak,
        totalMinutes,
      }}
    >
      {children}
    </SessionsContext.Provider>
  );
}

export const useSessions = () => {
  const ctx = useContext(SessionsContext);
  if (!ctx) throw new Error("useSessions must be inside SessionsProvider");
  return ctx;
};
