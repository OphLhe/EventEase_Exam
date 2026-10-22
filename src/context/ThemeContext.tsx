import { createContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors, darkColors, lightColors } from "../theme/color";

type ThemeMode = "light" | "dark";

type ThemeContextValue = {
  colors: Colors;
  isDark: boolean;
  toggleTheme: () => void;
};

const STORAGE_KEY = "@eventease/theme";

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === "light" || saved === "dark") setMode(saved);
      else setMode(systemScheme === "dark" ? "dark" : "light");
    });
  }, []);

  if (mode === null) return null;

  const toggleTheme = () => {
    const next: ThemeMode = mode === "dark" ? "light" : "dark";
    setMode(next);
    AsyncStorage.setItem(STORAGE_KEY, next);
  };

  const value: ThemeContextValue = {
    colors: mode === "dark" ? darkColors : lightColors,
    isDark: mode === "dark",
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
