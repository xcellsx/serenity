import { Platform, Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { GlassSurface } from '@/components/glass-surface';
import { Fonts, FontSizes, Palette, Radii } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  label: string;
  onPress?: () => void;
  /** Filled coral button for primary actions; otherwise a frosted glass pill. */
  variant?: 'glass' | 'solid';
  /** Glass pill with accent border — for toggles where the active state stays glassy. */
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function PillButton({ label, onPress, variant = 'glass', selected, style }: Props) {
  const theme = useTheme();

  if (variant === 'solid') {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.shadow,
          styles.pill,
          styles.solid,
          Platform.OS === 'web' && webPressable,
          { opacity: pressed ? 0.85 : 1 },
          style,
        ]}>
        <Text style={[styles.label, { color: '#fff' }]}>{label}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.shadow, Platform.OS === 'web' && webPressable, { opacity: pressed ? 0.9 : 1 }, style]}>
      <GlassSurface
        radius={Radii.pill}
        style={[
          styles.pill,
          selected ? { borderColor: theme.accent, borderWidth: 1.5 } : null,
        ]}>
        <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      </GlassSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: Radii.pill,
    // Matches Figma: 0px 4px 4px rgba(174,34,23,0.1)
    shadowColor: Palette.coral,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  pill: {
    minHeight: 48,
    paddingHorizontal: 32,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  solid: {
    backgroundColor: Palette.coral,
    borderRadius: Radii.pill,
    overflow: 'hidden',
  },
  label: {
    fontFamily: Fonts.sans,
    fontSize: FontSizes.body,
  },
});

const webPressable = Platform.OS === 'web' ? ({ cursor: 'pointer' } as ViewStyle) : undefined;
