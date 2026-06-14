import React, { createContext, useContext, useState, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, Theme } from '../constants/theme';

type ColorScheme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  /** 'system' means following device setting */
  mode: ColorScheme | 'system';
}

// Null default forces a runtime error if a consumer is rendered outside ThemeProvider.
const ThemeContext = createContext<ThemeContextValue | null>(null);

// Provides light/dark theme tokens and a toggle to all descendant components.
// Starts by following the device colour scheme; manual toggles set a user override
// that persists for the lifetime of the app session (not saved to storage).
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  // null means "no user override — follow the system scheme"
  const [override, setOverride] = useState<ColorScheme | null>(null);

  // Resolve final scheme: user override wins; otherwise fall back to system (default light).
  const resolvedScheme: ColorScheme =
    override ?? (systemScheme === 'dark' ? 'dark' : 'light');

  const isDark = resolvedScheme === 'dark';

  // Flips the active scheme. If no override exists yet, computes the current resolved
  // value first so the first tap always produces the opposite of what's currently shown.
  const toggleTheme = useCallback(() => {
    setOverride((prev) => {
      // If no override yet, flip from current resolved; otherwise flip the override
      const current = prev ?? (systemScheme === 'dark' ? 'dark' : 'light');
      return current === 'dark' ? 'light' : 'dark';
    });
  }, [systemScheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme: isDark ? darkTheme : lightTheme,
        isDark,
        toggleTheme,
        // Expose 'system' when no override is set so consumers can distinguish the two states.
        mode: override ?? 'system',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// Safe context accessor — throws a descriptive error if called outside ThemeProvider.
export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used inside ThemeProvider');
  return ctx;
}
