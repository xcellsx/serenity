import { LinearGradient } from 'expo-linear-gradient';
import { useRef } from 'react';
import { PanResponder, StyleSheet, View } from 'react-native';

import { Palette, Radii } from '@/constants/theme';

const TRACK_HEIGHT = 18;
const KNOB = 30;

/** Warm energy spectrum: calm/low (left) → vibrant/high (right). */
const TRACK_COLORS = ['#8B1A12', '#C0392B', '#E89B3C', '#F4C77E'] as const;

type Props = {
  /** 0 .. 1 */
  value: number;
  onChange: (value: number) => void;
};

export function EnergySlider({ value, onChange }: Props) {
  const trackX = useRef(0);
  const trackW = useRef(1);
  const viewRef = useRef<View>(null);

  const update = (pageX: number) => {
    const ratio = Math.min(1, Math.max(0, (pageX - trackX.current) / trackW.current));
    onChange(ratio);
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: (e) => update(e.nativeEvent.pageX),
      onPanResponderMove: (e) => update(e.nativeEvent.pageX),
    }),
  ).current;

  return (
    <View style={styles.wrap}>
      <View
        ref={viewRef}
        style={styles.hitArea}
        onLayout={() => {
          viewRef.current?.measureInWindow((x, _y, w) => {
            trackX.current = x;
            trackW.current = w || 1;
          });
        }}
        {...pan.panHandlers}>
        <LinearGradient
          colors={TRACK_COLORS}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.track}
        />
        <View
          style={[
            styles.knob,
            { left: `${value * 100}%`, marginLeft: -KNOB / 2 },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', paddingHorizontal: KNOB / 2 },
  hitArea: {
    height: KNOB + 16,
    justifyContent: 'center',
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: Radii.pill,
  },
  knob: {
    position: 'absolute',
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: Palette.coral,
    shadowColor: Palette.coral,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
});
