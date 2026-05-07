import { createContext, useContext, useEffect, useState } from "react";
import { storage, STORAGE_KEYS } from "../services/storage";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved user on app start
  useEffect(() => {
    (async () => {
      try {
        const savedUser = await storage.get(STORAGE_KEYS.USER);

        // 🔴 تحقق قوي من صحة البيانات
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
        console.log("Error loading user:", e);
        setUser(null);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  // Register
  const register = async ({ name, email, password }) => {
    try {
      const existingUsers =
        (await storage.get(STORAGE_KEYS.USERS)) || [];

      const emailExists = existingUsers.some(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (emailExists) {
        return { success: false, error: "This email is already registered" };
      }

      const newUser = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        createdAt: new Date().toISOString(),
      };

      const updatedUsers = [...existingUsers, newUser];
      await storage.set(STORAGE_KEYS.USERS, updatedUsers);

      const userSession = { ...newUser };
      delete userSession.password;

      await storage.set(STORAGE_KEYS.USER, userSession);
      setUser(userSession);

      return { success: true };
    } catch (e) {
      console.log("Register error:", e);
      return { success: false, error: "Something went wrong" };
    }
  };

  // Login
  const login = async ({ email, password }) => {
    try {
      const existingUsers =
        (await storage.get(STORAGE_KEYS.USERS)) || [];

      const foundUser = existingUsers.find(
        (u) =>
          u.email.toLowerCase() === email.trim().toLowerCase() &&
          u.password === password
      );

      if (!foundUser) {
        return { success: false, error: "Invalid email or password" };
      }

      const userSession = { ...foundUser };
      delete userSession.password;

      await storage.set(STORAGE_KEYS.USER, userSession);
      setUser(userSession);

      return { success: true };
    } catch (e) {
      console.log("Login error:", e);
      return { success: false, error: "Something went wrong" };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await storage.remove(STORAGE_KEYS.USER);
      setUser(null);
      return { success: true };
    } catch (e) {
      console.log("Logout error:", e);
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