import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_BAR_HEIGHT = Platform.select({ ios: 49, android: 56, web: 56, default: 56 }) ?? 56;

/** Space to leave above the floating tab bar (includes home-indicator / Safari chrome). */
export function useBottomTabInset() {
  const { bottom } = useSafeAreaInsets();
  const extra = Platform.OS === 'web' ? 12 : 0;
  return TAB_BAR_HEIGHT + bottom + extra;
}

export function useTabBarLayout() {
  const { bottom } = useSafeAreaInsets();
  return {
    height: TAB_BAR_HEIGHT + bottom + 8,
    paddingBottom: bottom + 4,
    paddingTop: 8,
  };
}
