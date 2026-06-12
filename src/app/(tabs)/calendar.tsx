import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { GlassSurface } from '@/components/glass-surface';
import { ScreenBackground } from '@/components/screen-background';
import { ScreenHeader } from '@/components/screen-header';
import { Accent, BodyText, Heading, textStyles } from '@/components/typography';
import { MOODS, moodByValue } from '@/constants/moods';
import { BottomTabInset, Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { getMoodEntries, type MoodEntry } from '@/lib/db';

const WEEKDAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export default function MoodCalendar() {
  const theme = useTheme();
  const [cursor, setCursor] = useState(() => new Date());
  const [entries, setEntries] = useState<MoodEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      getMoodEntries(120)
        .then(setEntries)
        .catch(() => {});
    }, []),
  );

  const dots = useMemo(() => {
    const map = new Map<string, string>();
    [...entries].reverse().forEach((e) => {
      if (!e.mood) return;
      const key = dayKey(new Date(e.created_at));
      const m = moodByValue(e.mood);
      if (m) map.set(key, m.dot);
    });
    return map;
  }, [entries]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const cells = useMemo(() => {
    const first = new Date(year, month, 1);
    const lead = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const arr: (Date | null)[] = [];
    for (let i = 0; i < lead; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(new Date(year, month, d));
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [year, month]);

  const shift = (delta: number) => setCursor(new Date(year, month + delta, 1));

  return (
    <ScreenBackground motion="serene">
      <View style={styles.container}>
        <ScreenHeader />
        <Heading size="title" style={[textStyles.center, styles.title]}>
          <Accent>Mood</Accent>
          {'\n'}Calendar.
        </Heading>

        <View style={styles.monthRow}>
          <Pressable onPress={() => shift(-1)} hitSlop={12}>
            <Feather name="chevron-left" size={24} color={theme.text} />
          </Pressable>
          <Heading size="heading">{MONTHS[month]}</Heading>
          <Pressable onPress={() => shift(1)} hitSlop={12}>
            <Feather name="chevron-right" size={24} color={theme.text} />
          </Pressable>
        </View>

        <View style={styles.weekHeader}>
          {WEEKDAYS.map((w) => (
            <BodyText key={w} size="caption" style={[styles.weekday, { color: theme.text }]}>
              {w}
            </BodyText>
          ))}
        </View>

        <View style={styles.calendarArea}>
          <View style={styles.grid}>
            {cells.map((d, i) => {
            const key = d ? dayKey(d) : `blank-${i}`;
            const dot = d ? dots.get(dayKey(d)) : undefined;
            return (
              <View key={key} style={styles.cell}>
                {d ? (
                  <>
                    <BodyText size="caption" style={{ color: theme.text }}>
                      {String(d.getDate()).padStart(2, '0')}
                    </BodyText>
                    <View
                      style={[
                        styles.dot,
                        { backgroundColor: dot ?? 'transparent', borderColor: theme.border },
                      ]}
                    />
                  </>
                ) : null}
              </View>
            );
            })}
          </View>
        </View>

        <GlassSurface radius={Radii.md} style={styles.legendGlass}>
          <View style={styles.legend}>
            {MOODS.map((m) => (
              <View key={m.value} style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: m.dot }]} />
                <BodyText size="caption" style={{ color: theme.text }}>
                  {m.label}
                </BodyText>
              </View>
            ))}
          </View>
        </GlassSurface>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two + BottomTabInset,
  },
  title: { marginTop: Spacing.five, marginBottom: Spacing.three },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.two,
    marginBottom: Spacing.two,
  },
  weekHeader: { flexDirection: 'row', marginBottom: Spacing.one },
  weekday: { flex: 1, textAlign: 'center', textTransform: 'lowercase' },
  calendarArea: { flex: 1, minHeight: 0 },
  grid: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'stretch' },
  cell: {
    width: `${100 / 7}%`,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.one,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: StyleSheet.hairlineWidth,
  },
  legendGlass: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  legendItem: { alignItems: 'center', gap: 6, width: '30%' },
});
