import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, StyleSheet, Text, View } from 'react-native';

import { Fonts, FontSizes, Palette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const WORD = 'Serenity.';
const LETTER_MS = 130;
const HOLD_MS = 450;

const backgrounds = {
  light: require('../../assets/images/bg-light.png'),
  dark: require('../../assets/images/bg-dark.png'),
};

type Props = {
  onDone: () => void;
};

/** Spells out “Serenity.” on the cloudy backdrop — replaces a static splash image. */
export function AnimatedIntro({ onDone }: Props) {
  const scheme = useColorScheme();
  const mode = scheme === 'dark' ? 'dark' : 'light';
  const [visible, setVisible] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduceMotion)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setVisible(WORD.length);
      const timer = setTimeout(onDone, HOLD_MS);
      return () => clearTimeout(timer);
    }

    let count = 0;
    const interval = setInterval(() => {
      count += 1;
      setVisible(count);
      if (count >= WORD.length) {
        clearInterval(interval);
        setTimeout(onDone, HOLD_MS);
      }
    }, LETTER_MS);

    return () => clearInterval(interval);
  }, [onDone, reduceMotion]);

  return (
    <View style={styles.fill}>
      <Image
        source={backgrounds[mode]}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        cachePolicy="memory-disk"
      />
      <View style={styles.center}>
        <Text style={styles.word}>{WORD.slice(0, visible)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  word: {
    fontFamily: Fonts.serif,
    fontSize: FontSizes.display,
    color: Palette.coral,
    letterSpacing: 0.5,
  },
});
