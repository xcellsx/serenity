import { Feather } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ScreenBackground } from '@/components/screen-background';
import { ScreenHeader } from '@/components/screen-header';
import { FadingScrollEdge } from '@/components/fading-scroll-edge';
import { Accent, BodyText, Heading, textStyles } from '@/components/typography';
import { BottomTabInset, Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { deleteTask, getTasksWithProgress, type TaskProgress } from '@/lib/db';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });

const TAB_CLEARANCE = BottomTabInset + Spacing.six + Spacing.five;

export default function Dashboard() {
  const theme = useTheme();
  const [items, setItems] = useState<TaskProgress[]>([]);

  const load = useCallback(() => {
    getTasksWithProgress()
      .then(setItems)
      .catch(() => {});
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const confirmDelete = (taskId: string, title: string) => {
    Alert.alert('Remove this task?', `"${title}" will be deleted gently — no undo.`, [
      { text: 'Keep it', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setItems((prev) => prev.filter(({ task }) => task.id !== taskId));
          try {
            await deleteTask(taskId);
          } catch {
            load();
          }
        },
      },
    ]);
  };

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <ScreenHeader />
        <Heading size="title" style={[textStyles.center, styles.title]}>
          <Accent>Task</Accent>
          {'\n'}Dashboard.
        </Heading>

        <FadingScrollEdge style={styles.listWrap}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}>
            {items.length === 0 ? (
              <BodyText size="caption" style={[textStyles.center, styles.empty, { color: theme.text }]}>
                Nothing here yet. Dump a task and I’ll help you break it down.
              </BodyText>
            ) : (
              items.map(({ task, done, total }) => (
                <View
                  key={task.id}
                  style={[styles.card, { borderColor: theme.border }]}>
                  <View style={styles.cardHeader}>
                    <BodyText size="caption" style={[styles.date, { color: theme.text }]}>
                      {formatDate(task.created_at).toUpperCase()}
                    </BodyText>
                    <Pressable
                      onPress={() => confirmDelete(task.id, task.title)}
                      accessibilityLabel="Delete task"
                      hitSlop={10}
                      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
                      <Feather name="trash-2" size={18} color={theme.textSecondary} />
                    </Pressable>
                  </View>

                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: '/accomplish/list',
                        params: { taskId: task.id },
                      })
                    }
                    style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
                    <BodyText size="body" style={{ color: theme.text }} numberOfLines={2}>
                      {task.title}
                    </BodyText>
                    <View style={styles.segments}>
                      {Array.from({ length: Math.max(total, 1) }).map((_, i) => (
                        <View
                          key={i}
                          style={[
                            styles.segment,
                            { backgroundColor: i < done ? theme.accent : theme.border },
                          ]}
                        />
                      ))}
                    </View>
                    <BodyText size="caption" style={{ color: theme.textSecondary }}>
                      {total === 0 ? 'No steps yet' : `${done} of ${total} steps done`}
                    </BodyText>
                  </Pressable>
                </View>
              ))
            )}
          </ScrollView>
        </FadingScrollEdge>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing.four },
  title: { marginTop: Spacing.five, marginBottom: Spacing.three },
  listWrap: { flex: 1 },
  scroll: { flex: 1 },
  list: { gap: Spacing.three, paddingBottom: TAB_CLEARANCE },
  empty: { marginTop: Spacing.six, opacity: 0.85 },
  card: {
    borderRadius: Radii.md,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: { letterSpacing: 1.2 },
  segments: { flexDirection: 'row', gap: 8, marginTop: Spacing.one },
  segment: { flex: 1, height: 10, borderRadius: Radii.pill },
});
