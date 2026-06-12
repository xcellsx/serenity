import Animated, { FadeIn, Easing } from 'react-native-reanimated';

import { MotionDurations } from '@/constants/navigation';
import { useMotion } from '@/lib/motion-context';

type MotionVariant = 'none' | 'serene' | 'step';

type Props = {
  children: React.ReactNode;
  /** `serene` = soft fade; `step` = slightly slower fade for forward progress; `none` = stack handles it */
  variant?: MotionVariant;
  style?: Animated.View['props']['style'];
};

/**
 * Gentle content entrance — used on tab roots and flow entry screens.
 * Nested stack screens should use `none` to avoid double-fading.
 */
export function MotionEnter({ children, variant = 'none', style }: Props) {
  const { reduceMotion } = useMotion();

  if (reduceMotion || variant === 'none') {
    return <Animated.View style={[{ flex: 1 }, style]}>{children}</Animated.View>;
  }

  const duration = variant === 'step' ? MotionDurations.step : MotionDurations.serene;
  const entering = FadeIn.duration(duration).easing(Easing.out(Easing.cubic));

  return (
    <Animated.View entering={entering} style={[{ flex: 1 }, style]}>
      {children}
    </Animated.View>
  );
}
