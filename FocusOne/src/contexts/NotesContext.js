import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { notesRepo } from "../repositories/notes.repo";

const NotesContext = createContext(null);

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(async () => {
    setNotes(await notesRepo.list());
  }, []);

  useEffect(() => {
    (async () => {
      await refresh();
      setIsLoaded(true);
    })();
  }, [refresh]);

  const addNote = useCallback(
    async (input) => {
      const n = await notesRepo.create(input);
      await refresh();
      return n;
    },
    [refresh]
  );

  const removeNote = useCallback(
    async (id) => {
      await notesRepo.remove(id);
      await refresh();
    },
    [refresh]
  );

  return (
    <NotesContext.Provider value={{ notes, isLoaded, addNote, removeNote, refresh }}>
      {children}
    </NotesContext.Provider>
  );
}

export const useNotes = () => {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be inside NotesProvider");
  return ctx;
};
