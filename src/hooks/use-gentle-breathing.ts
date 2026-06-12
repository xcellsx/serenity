import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

import { useMotion } from '@/lib/motion-context';

/** Gentle idle breathing — one continuous loop, no jumps on start/stop. */
export function useGentleBreathing(active = true) {
  const { reduceMotion } = useMotion();
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    scale.stopAnimation();
    if (!active || reduceMotion) {
      scale.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.06,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
      { resetBeforeIteration: false },
    );
    loop.start();
    return () => loop.stop();
  }, [active, scale, reduceMotion]);

  return scale;
}
