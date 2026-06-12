import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { EnergySlider } from '@/components/energy-slider';
import { PillButton } from '@/components/pill-button';
import { ScreenBackground } from '@/components/screen-background';
import { ScreenHeader } from '@/components/screen-header';
import { Accent, BodyText, Heading, textStyles } from '@/components/typography';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { addMoodEntry } from '@/lib/db';

const MODES = ['Quiet Energy Mode', 'Steady Pace Mode', 'High Focus Mode'];

export default function EnergyScreen() {
  const theme = useTheme();
  const [ratio, setRatio] = useState(0.5);
  const [touched, setTouched] = useState(false);
  const [saved, setSaved] = useState(false);

  const zone = Math.round(ratio * (MODES.length - 1)); // 0..2
  const label = touched ? MODES[zone] : 'Energy Levels';

  const log = async () => {
    try {
      await addMoodEntry({ energy: zone + 1 });
      setSaved(true);
    } catch {
      // ignore for now
    }
    router.push('/(tabs)/tasks');
  };

  return (
    <ScreenBackground motion="serene">
      <View style={styles.container}>
        <ScreenHeader />

        <Heading size="title" style={[textStyles.center, styles.prompt]}>
          What is your <Accent>energy</Accent>
          {'\n'}right now?
        </Heading>

        <View style={styles.middle}>
          <BodyText size="heading" style={[textStyles.center, styles.levelLabel, { color: theme.text }]}>
            {label}
          </BodyText>
          <EnergySlider
            value={ratio}
            onChange={(v) => {
              setRatio(v);
              setTouched(true);
              setSaved(false);
            }}
          />
          <BodyText size="caption" style={[textStyles.center, styles.hint, { color: theme.text }]}>
            Slide to match how much you’ve got in the tank.
          </BodyText>
        </View>

        <PillButton
          label={saved ? 'Logged — thank you' : 'This is my Energy Level'}
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
  middle: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.four, width: '100%' },
  levelLabel: { marginBottom: Spacing.one, letterSpacing: 0.5 },
  hint: { opacity: 0.85, maxWidth: 260 },
  cta: { marginBottom: Spacing.six + Spacing.five },
});
