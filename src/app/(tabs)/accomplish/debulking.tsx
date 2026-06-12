import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { GlassWireframeLoader } from '@/components/glass-wireframe-loader';
import { PillButton } from '@/components/pill-button';
import { ScreenBackground } from '@/components/screen-background';
import { ScreenHeader } from '@/components/screen-header';
import { Accent, BodyText, Heading, textStyles } from '@/components/typography';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { debulkTask, saveSubtasks, setTaskEncouragement } from '@/lib/db';

type Phase = 'loading' | 'error';

export default function Debulking() {
  const theme = useTheme();
  const { taskId, title } = useLocalSearchParams<{ taskId: string; title: string }>();
  const cancelled = useRef(false);
  const [phase, setPhase] = useState<Phase>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  const run = useCallback(async () => {
    cancelled.current = false;
    setPhase('loading');
    setErrorMessage('');

    try {
      const result = await debulkTask(title ?? '');
      if (cancelled.current) return;

      if (taskId) {
        await saveSubtasks(taskId, result.subtasks);
        await setTaskEncouragement(taskId, result.encouragement);
      }

      if (cancelled.current) return;
      router.replace({ pathname: '/accomplish/list', params: { taskId } });
    } catch (err) {
      if (cancelled.current) return;
      setPhase('error');
      setErrorMessage(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      );
    }
  }, [taskId, title]);

  useEffect(() => {
    run();
    return () => {
      cancelled.current = true;
    };
  }, [run]);

  const cancel = () => {
    cancelled.current = true;
    router.replace('/accomplish');
  };

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <ScreenHeader />
        <Heading size="title" style={[textStyles.center, styles.prompt]}>
          <Accent>Debulking</Accent>
          {'\n'}your task...
        </Heading>
        <BodyText size="body" style={[textStyles.center, styles.taskText, { color: theme.text }]}>
          {title}
        </BodyText>

        <View style={styles.middle}>
          <GlassWireframeLoader />
          <BodyText size="caption" style={[textStyles.center, styles.status, { color: theme.text }]}>
            {phase === 'loading'
              ? 'Breaking this into gentle steps…'
              : errorMessage}
          </BodyText>
        </View>

        <View style={styles.actions}>
          {phase === 'error' ? (
            <PillButton label="Try again" variant="solid" onPress={run} />
          ) : null}
          <PillButton
            label="Change Task"
            onPress={cancel}
            style={phase === 'error' ? styles.secondaryCta : undefined}
          />
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing.four },
  prompt: { marginTop: Spacing.five, marginBottom: Spacing.two },
  taskText: { marginBottom: Spacing.four },
  middle: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.five },
  status: { opacity: 0.85, maxWidth: 280 },
  actions: { gap: Spacing.three, marginBottom: Spacing.six + Spacing.five + BottomTabInset },
  secondaryCta: { marginTop: 0 },
});
