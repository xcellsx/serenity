import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

import { MOODS } from '@/constants/moods';
import { useMotion } from '@/lib/motion-context';

const LAST = MOODS.length - 1;
const NEUTRAL = Math.max(0, MOODS.findIndex((m) => m.value === 'neutral'));
const SWEEP_MS = 6500;

/** Continuously morphs the mood orb gradient back and forth. */
export function useSweepingOrb(active = true) {
  const { reduceMotion } = useMotion();
  const pos = useRef(new Animated.Value(NEUTRAL)).current;

  useEffect(() => {
    if (!active || reduceMotion) {
      pos.stopAnimation();
      pos.setValue(NEUTRAL);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pos, {
          toValue: LAST,
          duration: SWEEP_MS,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(pos, {
          toValue: 0,
          duration: SWEEP_MS,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
      ]),
      { resetBeforeIteration: false },
    );
    loop.start();
    return () => loop.stop();
  }, [active, pos, reduceMotion]);

  return pos;
}
