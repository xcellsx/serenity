import { useThemePreference } from '@/lib/theme-context';

/**
 * Returns the *effective* color scheme, honoring the user's in-app theme
 * preference (light / dark / system). Backed by ThemePreferenceProvider.
 */
export function useColorScheme() {
  return useThemePreference().scheme;
}
