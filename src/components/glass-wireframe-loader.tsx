import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useMotion } from '@/lib/motion-context';

const ROW_COUNT = 3;
const ROW_HEIGHT = 62;
const CHECK_SIZE = 30;

type RowProps = {
  index: number;
  borderColor: string;
  lineColor: string;
};

function WireframeRow({ index, borderColor, lineColor }: RowProps) {
  const { reduceMotion } = useMotion();
  const opacity = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const shimmer = useRef(new Animated.Value(reduceMotion ? 0.7 : 0.35)).current;

  useEffect(() => {
    if (reduceMotion) {
      opacity.setValue(1);
      scale.setValue(1);
      shimmer.setValue(0.7);
      return;
    }

    const delay = index * 220;
    const enter = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 520,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        delay,
        friction: 7,
        tension: 60,
        useNativeDriver: true,
      }),
    ]);

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 0.85,
          duration: 1400 + index * 120,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0.35,
          duration: 1400 + index * 120,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    enter.start(({ finished }) => {
      if (finished) pulse.start();
    });

    return () => {
      enter.stop();
      pulse.stop();
    };
  }, [index, opacity, reduceMotion, scale, shimmer]);

  const lineWidth = index === 0 ? '72%' : index === 1 ? '58%' : '64%';

  return (
    <Animated.View
      style={[
        styles.row,
        {
          borderColor,
          opacity,
          transform: [{ scale }],
        },
      ]}>
      <View style={styles.textBlock}>
        <Animated.View
          style={[styles.line, { width: lineWidth, backgroundColor: lineColor, opacity: shimmer }]}
        />
        <Animated.View
          style={[
            styles.lineShort,
            { width: '42%', backgroundColor: lineColor, opacity: shimmer },
          ]}
        />
      </View>
      <Animated.View
        style={[
          styles.check,
          {
            borderColor,
            opacity: shimmer,
          },
        ]}
      />
    </Animated.View>
  );
}

/** Glass wireframe preview of the task-list output while AI debulks. */
export function GlassWireframeLoader() {
  const theme = useTheme();
  const lineColor = theme.border;

  return (
    <View style={styles.stack}>
      {Array.from({ length: ROW_COUNT }, (_, i) => (
        <WireframeRow key={i} index={i} borderColor={theme.border} lineColor={lineColor} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    width: '100%',
    maxWidth: 340,
    gap: Spacing.three,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    minHeight: ROW_HEIGHT,
    borderRadius: Radii.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  textBlock: {
    flex: 1,
    gap: Spacing.one,
  },
  line: {
    height: 10,
    borderRadius: 5,
  },
  lineShort: {
    height: 8,
    borderRadius: 4,
  },
  check: {
    width: CHECK_SIZE,
    height: CHECK_SIZE,
    borderRadius: CHECK_SIZE / 2,
    borderWidth: 1,
  },
});
