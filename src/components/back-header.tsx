import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Accent, Heading } from '@/components/typography';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Top bar for pushed sub-flow screens: back chevron + centered wordmark. */
export function BackHeader() {
  const theme = useTheme();
  return (
    <View style={styles.header}>
      <Pressable
        onPress={() => router.back()}
        hitSlop={12}
        style={styles.back}
        accessibilityRole="button"
        accessibilityLabel="Go back">
        <Feather name="chevron-left" size={26} color={theme.text} />
      </Pressable>
      <Heading size="heading">
        <Accent>Serenity.</Accent>
      </Heading>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
  },
  back: {
    position: 'absolute',
    left: 0,
    top: Spacing.one,
    padding: Spacing.two,
  },
});
