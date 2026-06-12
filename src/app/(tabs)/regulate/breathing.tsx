import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';

import { HoldPressable } from '@/components/hold-pressable';
import { MoodOrb } from '@/components/mood-orb';
import { PillButton } from '@/components/pill-button';
import { ScreenBackground } from '@/components/screen-background';
import { ScreenHeader } from '@/components/screen-header';
import { BodyText, Heading, textStyles } from '@/components/typography';
import { Spacing } from '@/constants/theme';
import { BREATH_PHASE_MS, useGuidedBreathing } from '@/hooks/use-guided-breathing';
import { useBottomTabInset } from '@/hooks/use-bottom-tab-inset';
import { useSweepingOrb } from '@/hooks/use-sweeping-orb';
import { useTheme } from '@/hooks/use-theme';

export default function RegulateBreathing() {
  const theme = useTheme();
  const tabInset = useBottomTabInset();
  const pos = useSweepingOrb();
  const [holding, setHolding] = useState(false);
  const [phase, setPhase] = useState<'in' | 'out'>('in');
  const scale = useGuidedBreathing(holding, phase);

  useEffect(() => {
    if (!holding) {
      setPhase('in');
      return;
    }
    setPhase('in');
    const interval = setInterval(
      () => setPhase((p) => (p === 'in' ? 'out' : 'in')),
      BREATH_PHASE_MS,
    );
    return () => clearInterval(interval);
  }, [holding]);

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <ScreenHeader />
        <Heading size="title" style={[textStyles.center, styles.prompt]}>
          {Platform.OS === 'web' ? 'Click and Hold' : 'Tap and Hold'}
          {'\n'}your finger.
        </Heading>

        <HoldPressable
          style={styles.blobWrap}
          onHoldStart={() => setHolding(true)}
          onHoldEnd={() => setHolding(false)}>
          <Animated.View style={{ transform: [{ scale }] }}>
            <MoodOrb size={280} pos={pos} />
          </Animated.View>
          <BodyText size="caption" style={[textStyles.center, styles.phase, { color: theme.text }]}>
            {holding ? (phase === 'in' ? 'Breathe in…' : 'Breathe out…') : 'Hold to begin'}
          </BodyText>
        </HoldPressable>

        <PillButton
          label="End Session"
          onPress={() => router.push('/regulate/done')}
          style={[styles.cta, { marginBottom: Spacing.six + Spacing.five + tabInset }]}
        />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingHorizontal: Spacing.four },
  prompt: { marginTop: Spacing.five, marginBottom: Spacing.three },
  blobWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.four },
  phase: { opacity: 0.85, maxWidth: 260 },
  cta: {},
});
