import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View, Platform } from 'react-native';

import { MoodOrb } from '@/components/mood-orb';
import { HoldPressable } from '@/components/hold-pressable';
import { PillButton } from '@/components/pill-button';
import { ScreenBackground } from '@/components/screen-background';
import { ScreenHeader } from '@/components/screen-header';
import { Accent, BodyText, Heading, textStyles } from '@/components/typography';
import { MOODS } from '@/constants/moods';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { addMoodEntry } from '@/lib/db';
import { useMotion } from '@/lib/motion-context';

const LAST = MOODS.length - 1;
const NEUTRAL = Math.max(0, MOODS.findIndex((m) => m.value === 'neutral'));
const SWEEP_MS = 6500;
const REDUCED_CYCLE_MS = 2000;

export default function MoodScreen() {
  const theme = useTheme();
  const { reduceMotion } = useMotion();
  const pos = useRef(new Animated.Value(NEUTRAL)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const sweepRef = useRef<Animated.CompositeAnimation | null>(null);
  const cycleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cycleIndexRef = useRef(NEUTRAL);
  const [index, setIndex] = useState(NEUTRAL);
  const [interacted, setInteracted] = useState(false);
  const [saved, setSaved] = useState(false);

  // Track the nearest mood for the label as the gradient morphs.
  useEffect(() => {
    const id = pos.addListener(({ value }) => {
      const next = Math.min(LAST, Math.max(0, Math.round(value)));
      setIndex((prev) => (prev === next ? prev : next));
    });
    return () => pos.removeListener(id);
  }, [pos]);

  // Gentle "breathing" until the user first interacts with the orb.
  useEffect(() => {
    if (reduceMotion) {
      scale.stopAnimation();
      scale.setValue(1);
      return;
    }
    if (interacted) {
      scale.stopAnimation();
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
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
    );
    loop.start();
    return () => loop.stop();
  }, [interacted, reduceMotion, scale]);

  const startSweep = () => {
    setInteracted(true);
    setSaved(false);
    pos.stopAnimation();

    if (reduceMotion) {
      cycleIndexRef.current = index;
      pos.setValue(index);
      cycleRef.current = setInterval(() => {
        cycleIndexRef.current = (cycleIndexRef.current + 1) % MOODS.length;
        pos.setValue(cycleIndexRef.current);
      }, REDUCED_CYCLE_MS);
      return;
    }

    // Continuous ping-pong across the whole spectrum. `resetBeforeIteration:
    // false` keeps it flowing back and forth without jumping to the start.
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
    sweepRef.current = loop;
    loop.start();
  };

  // On release: freeze exactly where it is (no snapping back).
  const endSweep = () => {
    if (reduceMotion) {
      if (cycleRef.current) {
        clearInterval(cycleRef.current);
        cycleRef.current = null;
      }
      return;
    }
    sweepRef.current?.stop();
    pos.stopAnimation();
  };

  const log = async () => {
    try {
      await addMoodEntry({ mood: MOODS[index].value });
      setSaved(true);
    } catch {
      // ignore for now
    }
    router.push('/(tabs)/energy');
  };

  return (
    <ScreenBackground motion="serene">
      <View style={styles.container}>
        <ScreenHeader />

        <Heading size="title" style={[textStyles.center, styles.prompt]}>
          What are you <Accent>feeling</Accent>
          {'\n'}right now?
        </Heading>

        <View style={[styles.middle, Platform.OS === 'web' && webNoSelect]}>
          <BodyText size="heading" style={[textStyles.center, styles.moodLabel, { color: theme.text }]}>
            {MOODS[index].label}
          </BodyText>
          <HoldPressable onHoldStart={startSweep} onHoldEnd={endSweep}>
            <Animated.View style={{ transform: [{ scale }] }}>
              <MoodOrb size={300} pos={pos} />
            </Animated.View>
          </HoldPressable>
          <BodyText size="caption" style={[textStyles.center, styles.hint, { color: theme.text }]}>
            {Platform.OS === 'web'
              ? 'Click and hold the orb, release when it feels right.'
              : 'Press and hold the orb, release when it feels right.'}
          </BodyText>
        </View>

        <PillButton
          label={saved ? 'Logged — thank you' : "This is what I'm Feeling"}
          onPress={log}
          style={styles.cta}
        />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingHorizontal: Spacing.four },
  prompt: { marginTop: Spacing.five, marginBottom: Spacing.three },
  middle: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.four },
  moodLabel: { marginBottom: Spacing.one, letterSpacing: 0.5 },
  hint: { opacity: 0.85, maxWidth: 260 },
  cta: { marginBottom: Spacing.six + Spacing.five },
});

const webNoSelect = {
  userSelect: 'none',
  WebkitUserSelect: 'none',
} as const;
