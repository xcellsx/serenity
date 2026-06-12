import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { GlassSurface } from '@/components/glass-surface';
import { ScreenBackground } from '@/components/screen-background';
import { ScreenHeader } from '@/components/screen-header';
import { Accent, BodyText, Heading, textStyles } from '@/components/typography';
import { BottomTabInset, Palette, Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Action = {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  onPress: () => void;
};

function GlassCard({ icon, label, onPress }: Action) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.cardShadow, styles.cardFlex, { opacity: pressed ? 0.85 : 1 }]}>
      <GlassSurface radius={Radii.md} style={styles.card}>
        <Feather name={icon} size={26} color={theme.text} />
        <BodyText size="body" style={{ color: theme.text }}>
          {label}
        </BodyText>
      </GlassSurface>
    </Pressable>
  );
}

function SectionLabel({ children }: { children: string }) {
  const theme = useTheme();
  return (
    <BodyText size="caption" style={[styles.sectionLabel, { color: theme.text }]}>
      {children}
    </BodyText>
  );
}

export default function TasksHubScreen() {
  return (
    <ScreenBackground motion="serene">
      <View style={styles.container}>
        <ScreenHeader />

        <Heading size="title" style={[textStyles.center, styles.prompt]}>
          {`What would you\n`}
          <Accent>like</Accent>
          {' to do?'}
        </Heading>

        <View style={styles.grid}>
          <SectionLabel>REGULATE</SectionLabel>
          <View style={styles.row}>
            <GlassCard
              icon="wind"
              label="Regulate"
              onPress={() => router.push('/(tabs)/regulate/start')}
            />
            <GlassCard
              icon="calendar"
              label="Calendar"
              onPress={() => router.push('/(tabs)/calendar')}
            />
          </View>

          <SectionLabel>ACCOMPLISH</SectionLabel>
          <View style={styles.row}>
            <GlassCard
              icon="check-square"
              label="Accomplish"
              onPress={() => router.push('/accomplish')}
            />
            <GlassCard
              icon="grid"
              label="Dashboard"
              onPress={() => router.push('/accomplish/dashboard')}
            />
          </View>
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing.four, paddingBottom: BottomTabInset + Spacing.two },
  prompt: { marginTop: Spacing.five, marginBottom: Spacing.four },
  grid: { flex: 1, gap: Spacing.two },
  sectionLabel: { letterSpacing: 1.5, marginTop: Spacing.two, marginBottom: Spacing.one },
  row: { flex: 1, flexDirection: 'row', gap: Spacing.three },
  cardFlex: { flex: 1 },
  cardShadow: {
    borderRadius: Radii.md,
    shadowColor: Palette.coral,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  card: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.two },
});
