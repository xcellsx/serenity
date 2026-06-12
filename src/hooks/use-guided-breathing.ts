import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

import { useMotion } from '@/lib/motion-context';

/** One inhale or exhale — matches regulate breathing screen copy. */
export const BREATH_PHASE_MS = 4000;

const EXPAND = 1.08;

/** Orb scale synced to guided breathe-in / breathe-out phases. */
export function useGuidedBreathing(holding: boolean, phase: 'in' | 'out') {
  const { reduceMotion } = useMotion();
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    scale.stopAnimation();

    if (!holding) {
      if (reduceMotion) {
        scale.setValue(1);
        return;
      }
      Animated.timing(scale, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
      return;
    }

    const target = phase === 'in' ? EXPAND : 1;
    if (reduceMotion) {
      scale.setValue(target);
      return;
    }

    Animated.timing(scale, {
      toValue: target,
      duration: BREATH_PHASE_MS,
      easing: Easing.inOut(Easing.sin),
      useNativeDriver: true,
    }).start();
  }, [holding, phase, reduceMotion, scale]);

  return scale;
}
