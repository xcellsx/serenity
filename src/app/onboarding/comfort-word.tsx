import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { IconButton } from '@/components/icon-button';
import { ProgressDots } from '@/components/progress-dots';
import { ScreenBackground } from '@/components/screen-background';
import { TextField } from '@/components/text-field';
import { Accent, BodyText, Heading, textStyles } from '@/components/typography';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { updateProfile } from '@/lib/db';

export default function ComfortWordScreen() {
  const theme = useTheme();
  const [word, setWord] = useState('');
  const [saving, setSaving] = useState(false);

  const finish = async () => {
    setSaving(true);
    try {
      if (word.trim()) await updateProfile({ comfort_word: word.trim() });
    } catch {
      // Non-blocking.
    } finally {
      setSaving(false);
      router.replace('/(tabs)/mood');
    }
  };

  return (
    <ScreenBackground motion="step">
      <View style={styles.top}>
        <ProgressDots total={2} current={2} />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
        <View style={styles.block}>
          <Heading size="title" style={textStyles.center}>
            What is your
          </Heading>
          <Heading size="title" style={[textStyles.center, styles.subhead]}>
            <Accent>Comfort</Accent> Word?
          </Heading>

          <TextField
            value={word}
            onChangeText={setWord}
            placeholder="Your Comfort Word"
            autoFocus
            returnKeyType="done"
            onSubmitEditing={finish}
            style={textStyles.center}
          />

          <View style={styles.arrow}>
            <IconButton name="arrow-right" onPress={finish} disabled={saving} />
          </View>

          <BodyText size="caption" style={[textStyles.center, styles.note, { color: theme.text }]}>
            A word that makes you feel safe.
          </BodyText>
        </View>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  top: { paddingHorizontal: Spacing.four, paddingTop: Spacing.two },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: Spacing.four },
  block: { alignItems: 'center', gap: Spacing.three, marginBottom: Spacing.six },
  subhead: { marginBottom: Spacing.three },
  arrow: { marginTop: Spacing.one },
  note: { marginTop: Spacing.two },
});
