import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { GlassSurface } from '@/components/glass-surface';
import { Palette } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  name: React.ComponentProps<typeof Feather>['name'];
  onPress?: () => void;
  disabled?: boolean;
  size?: number;
};

/** Round glass button — used for the "→" continue actions. */
export function IconButton({ name, onPress, disabled, size = 44 }: Props) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.shadow,
        { borderRadius: size / 2, opacity: disabled ? 0.4 : pressed ? 0.85 : 1 },
      ]}>
      <GlassSurface
        radius={size / 2}
        style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Feather name={name} size={size * 0.45} color={theme.text} />
      </GlassSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: Palette.coral,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});
