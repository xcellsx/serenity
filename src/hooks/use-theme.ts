/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors, HighContrastColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAccessibility } from '@/lib/motion-context';

export function useTheme() {
  const scheme = useColorScheme();
  const { highContrast } = useAccessibility();
  const mode = scheme === 'dark' ? 'dark' : 'light';
  const base = Colors[mode];

  if (!highContrast) return base;

  return { ...base, ...HighContrastColors[mode] };
}
