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

export default function NameScreen() {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const next = async () => {
    setSaving(true);
    try {
      if (name.trim()) await updateProfile({ name: name.trim() });
    } catch {
      // Non-blocking: continue onboarding even if the save fails.
    } finally {
      setSaving(false);
      router.push('/onboarding/comfort-word');
    }
  };

  return (
    <ScreenBackground motion="step">
      <View style={styles.top}>
        <ProgressDots total={2} current={1} />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
        <View style={styles.block}>
          <Heading size="title" style={textStyles.center}>
            Hi, I’m <Accent>Serenity.</Accent>
          </Heading>
          <Heading size="title" style={[textStyles.center, styles.subhead]}>
            What should I call you?
          </Heading>

          <TextField
            value={name}
            onChangeText={setName}
            placeholder="Enter Your Name"
            autoFocus
            returnKeyType="next"
            onSubmitEditing={next}
            style={textStyles.center}
          />

          <View style={styles.arrow}>
            <IconButton name="arrow-right" onPress={next} disabled={saving} />
          </View>

          <BodyText size="caption" style={[textStyles.center, styles.note, { color: theme.text }]}>
            You can change this later.
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
