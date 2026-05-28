import { mkdirSync, writeFileSync } from 'node:fs';
import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { getConfigDir } from '../../lib/paths';
import { getMergedThemeName } from '../../lib/config-loader';
import type { ThemeColors, Theme } from '../../theme';
import { DEFAULT_THEME, THEMES } from '../../theme';

const USER_THEME_PREFERENCES_PATH = `${getConfigDir()}/preferences.json`;

type ThemePreferences = {
  themeName: string;
};

function resolveTheme(themeName: string | undefined): Theme {
  if (!themeName) return DEFAULT_THEME;

  return THEMES.find((theme) => theme.name === themeName) ?? DEFAULT_THEME;
}

function getInitialTheme(): Theme {
  return resolveTheme(getMergedThemeName(process.cwd()));
}

function persistTheme(theme: Theme) {
  try {
    mkdirSync(getConfigDir(), { recursive: true });
    writeFileSync(
      USER_THEME_PREFERENCES_PATH,
      JSON.stringify(
        { themeName: theme.name } satisfies ThemePreferences,
        null,
        2,
      ),
      'utf8',
    );
  } catch {
    // Ignore preference write failures so theme switching still works for this session.
  }
}

type ThemeContextValue = {
  colors: ThemeColors;
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return value;
}

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(getInitialTheme);

  const setTheme = useCallback((theme: Theme) => {
    setCurrentTheme(theme);
    persistTheme(theme);
  }, []);

  return (
    <ThemeContext.Provider
      value={{ colors: currentTheme.colors, currentTheme, setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
