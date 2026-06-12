import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { BlobGradient, Fonts, FontSizes, Palette } from '@/constants/theme';

type Props = {
  /** Diameter in px. */
  size?: number;
  /** Optional centered caption, e.g. the current mood ("Neutral"). */
  label?: string;
  /** Override gradient colors (e.g. per-mood). */
  colors?: readonly [string, string, ...string[]];
};

/**
 * The signature Serenity mood orb — a soft cream→peach→deep-red sphere with
 * an outer glow. Approximates the Figma radial blob using a diagonal gradient.
 */
export function Blob({ size = 280, label, colors }: Props) {
  return (
    <View style={[styles.glow, { width: size, height: size, borderRadius: size / 2 }]}>
      <LinearGradient
        colors={colors ?? BlobGradient}
        start={{ x: 0.15, y: 0.1 }}
        end={{ x: 0.9, y: 0.95 }}
        style={[styles.orb, { width: size, height: size, borderRadius: size / 2 }]}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  glow: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Palette.coral,
    shadowOpacity: 0.45,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 12 },
    elevation: 16,
  },
  orb: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: Fonts.sans,
    fontSize: FontSizes.body,
    color: Palette.ink,
  },
});
