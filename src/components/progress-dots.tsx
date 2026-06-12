import { StyleSheet, View } from 'react-native';

import { Palette, Radii } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  total?: number;
  /** 1-based index of the current step. */
  current: number;
};

export function ProgressDots({ total = 2, current }: Props) {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.segment,
            { backgroundColor: i < current ? Palette.coral : theme.border },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  segment: {
    flex: 1,
    maxWidth: 102,
    height: 12,
    borderRadius: Radii.pill,
  },
});
