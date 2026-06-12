import { LinearGradient } from 'expo-linear-gradient';
import { Animated, StyleSheet, View } from 'react-native';

import { MOODS } from '@/constants/moods';
import { Palette } from '@/constants/theme';

type Props = {
  size?: number;
  /** Animated position across the mood spectrum (0 .. MOODS.length - 1). */
  pos: Animated.Value;
};

/**
 * The mood orb. Stacks one gradient layer per mood and cross-fades between
 * them based on `pos`, producing a single continuous gradient that morphs
 * seamlessly as the user presses and holds.
 */
export function MoodOrb({ size = 300, pos }: Props) {
  return (
    <View style={[styles.glow, { width: size, height: size, borderRadius: size / 2 }]}>
      {MOODS.map((mood, i) => {
        // Layer i becomes fully opaque once pos passes it, and the layer
        // directly beneath is always opaque while this one fades — so the
        // composite always covers the orb with no see-through gaps.
        const opacity = pos.interpolate({
          inputRange: [i - 1, i],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View
            key={mood.value}
            style={[
              StyleSheet.absoluteFill,
              { opacity, borderRadius: size / 2, overflow: 'hidden' },
            ]}>
            <LinearGradient
              colors={mood.gradient}
              start={{ x: 0.15, y: 0.1 }}
              end={{ x: 0.9, y: 0.95 }}
              style={styles.fill}
            />
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  glow: {
    shadowColor: Palette.coral,
    shadowOpacity: 0.45,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 12 },
    elevation: 16,
  },
  fill: { flex: 1 },
});
