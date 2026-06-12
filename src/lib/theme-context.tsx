import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

export type ThemePreference = 'light' | 'dark' | 'system';
export type EffectiveScheme = 'light' | 'dark';

const STORAGE_KEY = 'serenity.theme-preference';

type ThemeContextValue = {
  preference: ThemePreference;
  scheme: EffectiveScheme;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  preference: 'system',
  scheme: 'light',
  setPreference: () => {},
});

export function ThemePreferenceProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setPreferenceState(stored);
      }
    });
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  const scheme: EffectiveScheme =
    preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;

  const value = useMemo(
    () => ({ preference, scheme, setPreference }),
    [preference, scheme, setPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useThemePreference = () => useContext(ThemeContext);
