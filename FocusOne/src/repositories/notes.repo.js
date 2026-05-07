import { storage, STORAGE_KEYS } from "../services/storage";
import { generateId } from "../utils/ids";

export const notesRepo = {
  async list() {
    return (await storage.get(STORAGE_KEYS.NOTES)) || [];
  },

  async create({ title, photo, drawing }) {
    const notes = await this.list();
    const note = {
      id: generateId(),
      title: title.trim(),
      photo: photo || null,
      drawing: drawing || [],
      createdAt: new Date().toISOString(),
    };
    await storage.set(STORAGE_KEYS.NOTES, [note, ...notes]);
    return note;
  },

  async remove(id) {
    const notes = await this.list();
    await storage.set(STORAGE_KEYS.NOTES, notes.filter((n) => n.id !== id));
  },
};
