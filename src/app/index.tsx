import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { PillButton } from '@/components/pill-button';
import { ScreenBackground } from '@/components/screen-background';
import { Accent, BodyText, Heading, textStyles } from '@/components/typography';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useThemePreference } from '@/lib/theme-context';

export default function LandingScreen() {
  const theme = useTheme();
  const { setPreference } = useThemePreference();

  const choose = (mode: 'light' | 'dark') => {
    setPreference(mode);
    router.push('/onboarding/name');
  };

  return (
    <ScreenBackground motion="serene">
      <View style={styles.container}>
        <View style={styles.titleBlock}>
          <Heading size="display" style={textStyles.center}>
            Welcome to
          </Heading>
          <Heading size="display" style={textStyles.center}>
            <Accent>Serenity.</Accent>
          </Heading>
        </View>

        <View style={styles.buttons}>
          <PillButton label="Light Mode" onPress={() => choose('light')} />
          <PillButton label="Dark Mode" onPress={() => choose('dark')} />
        </View>

        <BodyText size="caption" style={[textStyles.center, styles.tagline, { color: theme.text }]}>
          Plan with your energy, not just your time.
        </BodyText>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.five,
  },
  titleBlock: {
    marginBottom: Spacing.six,
  },
  buttons: {
    gap: Spacing.three,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  tagline: {
    marginTop: Spacing.five,
  },
});
