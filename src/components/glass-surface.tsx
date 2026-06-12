import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Radii } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Props = {
  children?: React.ReactNode;
  /** Corner radius of the glass surface. */
  radius?: number;
  /** Override blur strength. */
  intensity?: number;
  /** Applied to the blur container (layout: padding, size, alignment, ...). */
  style?: StyleProp<ViewStyle>;
};

/**
 * Frosted-glass surface used across the app (buttons, fields, cards).
 *
 * The trick for a convincing glass look on a *dark* background: blur the
 * backdrop, then lay a light translucent gradient "film" over it plus a soft
 * top "rim light" and a bright hairline edge — that reads as glass instead of
 * a flat dark panel.
 */
export function GlassSurface({ children, radius = Radii.pill, intensity, style }: Props) {
  const isDark = useColorScheme() === 'dark';

  return (
    <BlurView
      intensity={intensity ?? (isDark ? 60 : 32)}
      tint={isDark ? 'dark' : 'light'}
      style={[
        {
          borderRadius: radius,
          overflow: 'hidden',
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.6)',
        },
        style,
      ]}>
      {/* Translucent light film — lifts the surface off a dark backdrop. */}
      <LinearGradient
        colors={
          isDark
            ? ['rgba(255,255,255,0.24)', 'rgba(255,255,255,0.07)']
            : ['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.14)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      {/* Top rim light — the glassy sheen along the upper edge. */}
      <View style={styles.rim} pointerEvents="none">
        <LinearGradient
          colors={
            isDark
              ? ['rgba(255,255,255,0.4)', 'rgba(255,255,255,0)']
              : ['rgba(255,255,255,0.65)', 'rgba(255,255,255,0)']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </View>
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  rim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
  },
});
