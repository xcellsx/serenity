import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, FontSizes } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAccessibility } from '@/lib/motion-context';

type HeadingProps = TextProps & {
  size?: keyof typeof FontSizes;
  bold?: boolean;
};

/** Serif headline (Playfair Display). */
export function Heading({ size = 'title', bold, style, ...rest }: HeadingProps) {
  const theme = useTheme();
  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: bold ? Fonts.serifBold : Fonts.serif,
          fontSize: FontSizes[size],
          color: theme.text,
          lineHeight: FontSizes[size] * 1.25,
        },
        style,
      ]}
    />
  );
}

/** Sans body / UI text (Nunito). */
export function BodyText({ size = 'body', bold, style, ...rest }: HeadingProps) {
  const theme = useTheme();
  const { highContrast } = useAccessibility();
  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: bold || highContrast ? Fonts.sansBold : Fonts.sans,
          fontSize: FontSizes[size],
          color: highContrast ? theme.text : theme.textSecondary,
        },
        style,
      ]}
    />
  );
}

/** Inline coral accent span, for highlighting a word inside a Heading. */
export function Accent({ style, ...rest }: TextProps) {
  const theme = useTheme();
  return <Text {...rest} style={[{ color: theme.accent }, style]} />;
}

export const textStyles = StyleSheet.create({
  center: { textAlign: 'center' },
});
