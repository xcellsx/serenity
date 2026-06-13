import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

/**
 * Fades scroll content to transparent near the bottom — native only.
 * MaskedView is unreliable on web (can hide content entirely).
 */
export function FadingScrollEdge({ children, style }: Props) {
  if (Platform.OS === 'web') {
    return <View style={[styles.fill, style]}>{children}</View>;
  }

  return (
    <MaskedView
      style={[styles.fill, style]}
      maskElement={
        <View style={styles.fill}>
          <LinearGradient
            colors={['#000000', '#000000', '#00000000']}
            locations={[0, 0.82, 1]}
            style={StyleSheet.absoluteFill}
          />
        </View>
      }>
      {children}
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
