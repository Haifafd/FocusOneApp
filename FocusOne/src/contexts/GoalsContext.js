import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { goalsRepo } from "../repositories/goals.repo";

const GoalsContext = createContext(null);

export function GoalsProvider({ children }) {
  const [goals, setGoals] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(async () => {
    setGoals(await goalsRepo.list());
  }, []);

  useEffect(() => {
    (async () => {
      await refresh();
      setIsLoaded(true);
    })();
  }, [refresh]);

  const addGoal = useCallback(
    async (input) => {
      const g = await goalsRepo.create(input);
      await refresh();
      return g;
    },
    [refresh]
  );
  const updateGoal = useCallback(
    async (id, patch) => {
      await goalsRepo.update(id, patch);
      await refresh();
    },
    [refresh]
  );
  const removeGoal = useCallback(
    async (id) => {
      await goalsRepo.remove(id);
      await refresh();
    },
    [refresh]
  );
  const toggleTask = useCallback(
    async (gId, tId) => {
      await goalsRepo.toggleTask(gId, tId);
      await refresh();
    },
    [refresh]
  );
  const addTask = useCallback(
    async (gId, input) => {
      const t = await goalsRepo.addTask(gId, input);
      await refresh();
      return t;
    },
    [refresh]
  );
  const updateTask = useCallback(
    async (gId, tId, patch) => {
      await goalsRepo.updateTask(gId, tId, patch);
      await refresh();
    },
    [refresh]
  );
  const removeTask = useCallback(
    async (gId, tId) => {
      await goalsRepo.removeTask(gId, tId);
      await refresh();
    },
    [refresh]
  );

  return (
    <GoalsContext.Provider
      value={{
        goals,
        isLoaded,
        addGoal,
        updateGoal,
        removeGoal,
        toggleTask,
        addTask,
        updateTask,
        removeTask,
        refresh,
        computeProgress: goalsRepo.computeProgress,
      }}
    >
      {children}
    </GoalsContext.Provider>
  );
}

export const useGoals = () => {
  const ctx = useContext(GoalsContext);
  if (!ctx) throw new Error("useGoals must be inside GoalsProvider");
  return ctx;
};
