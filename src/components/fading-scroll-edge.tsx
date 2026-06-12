import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, type ViewStyle } from 'react-native';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

/**
 * Fades scroll content to transparent near the bottom — tasks ghost out
 * behind the tab bar instead of sitting under a solid color band.
 */
export function FadingScrollEdge({ children, style }: Props) {
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
