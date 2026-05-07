import { storage, STORAGE_KEYS } from "../services/storage";
import { generateId } from "../utils/ids";

export const usersRepo = {
  async list() {
    return (await storage.get(STORAGE_KEYS.USERS)) || [];
  },

  async findByEmail(email) {
    const users = await this.list();
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async create({ name, email, password }) {
    const users = await this.list();
    const user = {
      id: generateId(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password, // TODO: hash in production (out of scope for v1)
      createdAt: new Date().toISOString(),
    };
    await storage.set(STORAGE_KEYS.USERS, [...users, user]);
    return user;
  },

  toSession(user) {
    const { password, ...session } = user;
    return session;
  },
};
