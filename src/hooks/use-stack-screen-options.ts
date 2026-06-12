import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { MotionDurations, type StackMotionVariant } from '@/constants/navigation';
import { useMotion } from '@/lib/motion-context';

const baseOptions: NativeStackNavigationOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: 'transparent' },
  // Swipe-back conflicts with horizontal sliders and is easy to trigger by accident.
  gestureEnabled: false,
  fullScreenGestureEnabled: false,
};

/** Shared stack transitions — soft fades, no harsh slides. */
export function useStackScreenOptions(
  variant: StackMotionVariant = 'serene',
): NativeStackNavigationOptions {
  const { reduceMotion } = useMotion();

  if (reduceMotion) {
    return { ...baseOptions, animation: 'none', animationDuration: 0 };
  }

  const duration =
    variant === 'step'
      ? MotionDurations.step
      : variant === 'quick'
        ? MotionDurations.quick
        : MotionDurations.serene;

  return {
    ...baseOptions,
    animation: 'fade',
    animationDuration: duration,
  };
}
