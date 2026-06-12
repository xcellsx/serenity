import { useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { GlassSurface } from '@/components/glass-surface';
import { Fonts, FontSizes, Palette, Radii } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = TextInputProps & {
  multiline?: boolean;
};

export function TextField({ multiline, style, onFocus, onBlur, ...rest }: Props) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.shadow}>
      <GlassSurface
        radius={multiline ? Radii.md : Radii.pill}
        style={[
          styles.field,
          multiline ? styles.multiline : null,
          focused ? { borderColor: theme.accent, borderWidth: 1.5 } : null,
        ]}>
        <TextInput
          placeholderTextColor={theme.text}
          selectionColor={Palette.coral}
          cursorColor={Palette.coral}
          multiline={multiline}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[styles.input, { color: theme.text }, style]}
          {...rest}
        />
      </GlassSurface>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: Radii.pill,
    shadowColor: Palette.coral,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  field: {
    minHeight: 48,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  multiline: {
    minHeight: 120,
    paddingVertical: 16,
    justifyContent: 'flex-start',
  },
  input: {
    fontFamily: Fonts.sans,
    fontSize: FontSizes.body,
    textAlignVertical: 'top',
  },
});
