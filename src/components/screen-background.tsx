import { Image } from 'expo-image';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MotionEnter } from '@/components/motion-enter';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Props = {
  children: React.ReactNode;
  /** Disable the safe-area padding (e.g. for full-bleed screens). */
  edgeToEdge?: boolean;
  /** Soft content fade on mount — use on tab roots & flow entry, not nested stack screens. */
  motion?: 'none' | 'serene' | 'step';
  style?: ViewStyle;
};
const backgrounds = {
  light: require('../../assets/images/bg-light.png'),
  dark: require('../../assets/images/bg-dark.png'),
};

/**
 * The soft, cloudy gradient backdrop used across every Serenity screen.
 * Uses the light/dark background art exported from Figma.
 */
export function ScreenBackground({ children, edgeToEdge, motion = 'none', style }: Props) {
  const scheme = useColorScheme();
  const mode = scheme === 'dark' ? 'dark' : 'light';

  const body = edgeToEdge ? (
    <View style={[styles.fill, style]}>{children}</View>
  ) : (
    <SafeAreaView style={[styles.fill, style]}>{children}</SafeAreaView>
  );

  return (
    <View style={styles.fill}>
      <Image
        source={backgrounds[mode]}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        cachePolicy="memory-disk"
      />
      <MotionEnter variant={motion} style={styles.fill}>
        {body}
      </MotionEnter>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
