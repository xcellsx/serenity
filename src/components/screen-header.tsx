import { StyleSheet, View } from 'react-native';

import { Accent, Heading } from '@/components/typography';
import { Spacing } from '@/constants/theme';

/** The centered "Serenity." wordmark shown at the top of main screens. */
export function ScreenHeader() {
  return (
    <View style={styles.header}>
      <Heading size="heading">
        <Accent>Serenity.</Accent>
      </Heading>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
  },
});
