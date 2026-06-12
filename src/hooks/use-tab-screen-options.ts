import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

import { MotionDurations } from '@/constants/navigation';
import { useMotion } from '@/lib/motion-context';

/** Gentle cross-fade when switching main tabs. */
export function useTabScreenOptions(): BottomTabNavigationOptions {
  const { reduceMotion } = useMotion();

  if (reduceMotion) {
    return { animation: 'none' };
  }

  return {
    animation: 'fade',
    transitionSpec: {
      animation: 'timing',
      config: { duration: MotionDurations.serene },
    },
  };
}
