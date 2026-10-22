import { createContext, ReactNode, useEffect, useState } from "react";
import { User } from "../types/userType";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { seedUsers } from "../storage/seed";
import { getJSON, setJSON } from "../storage/storage";
import { STORAGE_KEYS } from "../storage/storageKeys";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: Omit<User, "id" | "role">) => Promise<boolean>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const init = async () => {
    try {
      await seedUsers();
      const users = (await getJSON<User[]>(STORAGE_KEYS.USERS)) ?? [];
      const sessionId = await AsyncStorage.getItem(STORAGE_KEYS.SESSION);
      const found = users.find((u) => u.id === sessionId);
      setUser(found ?? null);
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la session : ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const login = async (email: string, password: string) => {
    const users = (await getJSON<User[]>(STORAGE_KEYS.USERS)) ?? [];
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password,
    );
    if (!found) return false;
    await AsyncStorage.setItem(STORAGE_KEYS.SESSION, found.id);
    setUser(found);
    return true;
  };

  const register = async (data: Omit<User, "id" | "role">) => {
    const users = (await getJSON<User[]>(STORAGE_KEYS.USERS)) ?? [];
    const email = data.email.trim().toLowerCase();

    if (users.some((u) => u.email.toLowerCase() === email)) return false;

    const newUser: User = {
      ...data,
      email,
      id: `u${Date.now()}`,
      role: "volunteer",
    };
    await setJSON(STORAGE_KEYS.USERS, [...users, newUser]);
    await AsyncStorage.setItem(STORAGE_KEYS.SESSION, newUser.id);
    setUser(newUser);
    return true;
  };

  const logout = async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.SESSION);
    setUser(null);
  };

  return (
    <>
      <AuthContext.Provider value={{ user, loading, login, register, logout }}>
        {children}
      </AuthContext.Provider>
    </>
  );
};
