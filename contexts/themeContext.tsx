import React, { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";
import { lightTheme, darkTheme } from "../constants/theme";

type Ctx = { isDark: boolean };

const ThemeCtx = createContext<Ctx>({ isDark: false });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const value = useMemo<Ctx>(() => ({ isDark }), [isDark]);

  return (
    <ThemeCtx.Provider value={value}>
      <PaperProvider theme={isDark ? darkTheme : lightTheme}>
        {children}
      </PaperProvider>
    </ThemeCtx.Provider>
  );
}

export const useThemeToggle = () => useContext(ThemeCtx);
