import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { IconButton } from '@/components/icon-button';
import { ScreenBackground } from '@/components/screen-background';
import { ScreenHeader } from '@/components/screen-header';
import { TextField } from '@/components/text-field';
import { Accent, BodyText, Heading, textStyles } from '@/components/typography';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { createTask } from '@/lib/db';

export default function BrainDump() {
  const theme = useTheme();
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!text.trim() || busy) return;
    setBusy(true);
    try {
      const task = await createTask(text.trim());
      router.push({
        pathname: '/accomplish/debulking',
        params: { taskId: task.id, title: task.title },
      });
    } catch {
      // ignore for now
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScreenBackground motion="step">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <View style={styles.container}>
          <ScreenHeader />
          <Heading size="title" style={[textStyles.center, styles.prompt]}>
            What is <Accent>weighing</Accent> on{'\n'}your mind right now?
          </Heading>

          <View style={styles.middle}>
            <TextField
              value={text}
              onChangeText={setText}
              placeholder="Dump it here"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={submit}
            />
            <IconButton name="arrow-right" onPress={submit} disabled={busy} />
          </View>

          <BodyText size="caption" style={[textStyles.center, styles.note, { color: theme.text }]}>
            I’ll help you break it into gentle steps.
          </BodyText>
        </View>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, paddingHorizontal: Spacing.four },
  prompt: { marginTop: Spacing.five, marginBottom: Spacing.four },
  middle: { flex: 1, justifyContent: 'center', gap: Spacing.four, alignItems: 'center' },
  note: { marginBottom: Spacing.six + Spacing.five + BottomTabInset },
});
