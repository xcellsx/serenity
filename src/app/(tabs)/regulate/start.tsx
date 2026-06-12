import { router } from 'expo-router';
import { Animated, StyleSheet, View } from 'react-native';

import { MoodOrb } from '@/components/mood-orb';
import { PillButton } from '@/components/pill-button';
import { ScreenBackground } from '@/components/screen-background';
import { ScreenHeader } from '@/components/screen-header';
import { Accent, Heading, textStyles } from '@/components/typography';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useGentleBreathing } from '@/hooks/use-gentle-breathing';
import { useSweepingOrb } from '@/hooks/use-sweeping-orb';

export default function RegulateStart() {
  const pos = useSweepingOrb();
  const scale = useGentleBreathing();

  return (
    <ScreenBackground motion="step">
      <View style={styles.container}>
        <ScreenHeader />
        <Heading size="title" style={[textStyles.center, styles.prompt]}>
          Let’s find that{'\n'}center. <Accent>Ready?</Accent>
        </Heading>
        <View style={styles.blobWrap}>
          <Animated.View style={{ transform: [{ scale }] }}>
            <MoodOrb size={300} pos={pos} />
          </Animated.View>
        </View>
        <PillButton
          label="Start"
          onPress={() => router.push('/(tabs)/regulate/breathing')}
          style={styles.cta}
        />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingHorizontal: Spacing.four },
  prompt: { marginTop: Spacing.five, marginBottom: Spacing.three },
  blobWrap: { flex: 1, justifyContent: 'center' },
  cta: { marginBottom: Spacing.six + Spacing.five + BottomTabInset },
});
