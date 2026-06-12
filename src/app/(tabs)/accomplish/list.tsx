import { Feather } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { PillButton } from '@/components/pill-button';
import { ScreenBackground } from '@/components/screen-background';
import { ScreenHeader } from '@/components/screen-header';
import { Accent, BodyText, Heading, textStyles } from '@/components/typography';
import { BottomTabInset, Palette, Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { completeTaskIfDone, getSubtasks, setSubtaskDone, type Subtask } from '@/lib/db';

export default function TaskList() {
  const theme = useTheme();
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);

  const load = useCallback(() => {
    if (!taskId) return;
    getSubtasks(taskId)
      .then(setSubtasks)
      .catch(() => {});
  }, [taskId]);

  useFocusEffect(useCallback(() => load(), [load]));

  const toggle = async (s: Subtask) => {
    setSubtasks((prev) => prev.map((x) => (x.id === s.id ? { ...x, done: !x.done } : x)));
    try {
      await setSubtaskDone(s.id, !s.done);
      if (taskId) await completeTaskIfDone(taskId);
    } catch {
      load();
    }
  };

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <ScreenHeader />
        <Heading size="title" style={[textStyles.center, styles.prompt]}>
          Here are{'\n'}your <Accent>tasks.</Accent>
        </Heading>
        <BodyText size="caption" style={[textStyles.center, styles.note, { color: theme.text }]}>
          Tap a step when you’re done.
        </BodyText>

        <View style={styles.list}>
          {subtasks.map((s) => (
            <Pressable
              key={s.id}
              onPress={() => toggle(s)}
              style={[styles.row, { borderColor: theme.border }]}>
              <BodyText
                size="body"
                style={{
                  color: s.done ? theme.textSecondary : theme.text,
                  textDecorationLine: s.done ? 'line-through' : 'none',
                  flex: 1,
                }}>
                {s.text}
              </BodyText>
              <View
                style={[
                  styles.check,
                  {
                    backgroundColor: s.done ? Palette.coral : 'transparent',
                    borderColor: s.done ? Palette.coral : theme.border,
                  },
                ]}>
                {s.done ? <Feather name="check" size={16} color="#fff" /> : null}
              </View>
            </Pressable>
          ))}
        </View>

        <PillButton
          label="Go to Dashboard"
          onPress={() => router.replace('/accomplish/dashboard')}
          style={styles.cta}
        />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing.four },
  prompt: { marginTop: Spacing.five, marginBottom: Spacing.two },
  note: { marginBottom: Spacing.four },
  list: { flex: 1, gap: Spacing.three, paddingTop: Spacing.two },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    minHeight: 62,
    borderRadius: Radii.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
  },
  check: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cta: { marginBottom: Spacing.six + Spacing.five + BottomTabInset },
});
