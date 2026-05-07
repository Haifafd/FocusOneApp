import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { settingsRepo } from "../repositories/settings.repo";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(async () => {
    setSettings(await settingsRepo.get());
  }, []);

  useEffect(() => {
    (async () => {
      await refresh();
      setIsLoaded(true);
    })();
  }, [refresh]);

  const updateSettings = useCallback(
    async (patch) => {
      const next = await settingsRepo.update(patch);
      setSettings(next);
      return next;
    },
    []
  );

  return (
    <SettingsContext.Provider
      value={{
        settings: settings || { defaultDuration: 25, notificationsEnabled: false, soundEnabled: true },
        isLoaded,
        updateSettings,
        refresh,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be inside SettingsProvider");
  return ctx;
};
