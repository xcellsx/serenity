import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type Props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
};

/** On-brand toggle — coral when on, never system green. */
export function SerenitySwitch({ value, onValueChange }: Props) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      style={[
        styles.track,
        { backgroundColor: value ? theme.accent : theme.border },
      ]}>
      <View style={[styles.thumb, value ? styles.thumbOn : styles.thumbOff]} />
    </Pressable>
  );
}

const TRACK_W = 51;
const TRACK_H = 31;
const THUMB = 27;
const PAD = 2;

const styles = StyleSheet.create({
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    padding: PAD,
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: '#fff',
  },
  thumbOff: { alignSelf: 'flex-start' },
  thumbOn: { alignSelf: 'flex-end' },
});
