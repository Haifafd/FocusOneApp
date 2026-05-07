import { createContext, useContext, useEffect, useState } from "react";
import { storage, STORAGE_KEYS } from "../services/storage";
import { usersRepo } from "../repositories/users.repo";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const savedUser = await storage.get(STORAGE_KEYS.USER);
        if (
          savedUser &&
          typeof savedUser === "object" &&
          savedUser.id &&
          savedUser.email
        ) {
          setUser(savedUser);
        } else {
          await storage.remove(STORAGE_KEYS.USER);
          setUser(null);
        }
      } catch (e) {
        console.warn("Error loading user:", e);
        setUser(null);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  const register = async ({ name, email, password }) => {
    try {
      const existing = await usersRepo.findByEmail(email);
      if (existing) {
        return { success: false, error: "This email is already registered" };
      }
      const newUser = await usersRepo.create({ name, email, password });
      const session = usersRepo.toSession(newUser);
      await storage.set(STORAGE_KEYS.USER, session);
      setUser(session);
      return { success: true };
    } catch (e) {
      console.warn("Register error:", e);
      return { success: false, error: "Something went wrong" };
    }
  };

  const login = async ({ email, password }) => {
    try {
      const found = await usersRepo.findByEmail(email);
      if (!found || found.password !== password) {
        return { success: false, error: "Invalid email or password" };
      }
      const session = usersRepo.toSession(found);
      await storage.set(STORAGE_KEYS.USER, session);
      setUser(session);
      return { success: true };
    } catch (e) {
      console.warn("Login error:", e);
      return { success: false, error: "Something went wrong" };
    }
  };

  const logout = async () => {
    try {
      await storage.remove(STORAGE_KEYS.USER);
      setUser(null);
      return { success: true };
    } catch (e) {
      console.warn("Logout error:", e);
      return { success: false };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoaded,
        isAuthenticated: !!user,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
