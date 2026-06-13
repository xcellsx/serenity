import { Platform, Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { useRef } from 'react';

type Props = {
  onHoldStart: () => void;
  onHoldEnd: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

type WebPressableProps = React.ComponentProps<typeof Pressable> & {
  dataSet?: { hold?: string };
  onContextMenu?: (e: { preventDefault: () => void }) => void;
};

const WebHoldPressable = Pressable as React.ComponentType<WebPressableProps>;

/**
 * Press-and-hold on native; on web blocks text selection / iOS callout menus.
 */
export function HoldPressable({
  onHoldStart,
  onHoldEnd,
  children,
  style,
  accessibilityLabel,
}: Props) {
  const active = useRef(false);

  const start = () => {
    if (active.current) return;
    active.current = true;
    onHoldStart();
  };

  const end = () => {
    if (!active.current) return;
    active.current = false;
    onHoldEnd();
  };

  if (Platform.OS === 'web') {
    return (
      <WebHoldPressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={[style, webHoldStyle]}
        dataSet={{ hold: 'true' }}
        onPressIn={start}
        onPressOut={end}
        onTouchStart={(e) => {
          e.preventDefault();
          start();
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          end();
        }}
        onTouchCancel={end}
        onContextMenu={(e) => e.preventDefault()}
        onPointerDown={(e) => {
          e.preventDefault();
          const target = e.currentTarget as unknown as HTMLElement;
          if (typeof e.nativeEvent.pointerId === 'number') {
            target.setPointerCapture?.(e.nativeEvent.pointerId);
          }
          start();
        }}
        onPointerUp={end}
        onPointerCancel={end}>
        {children}
      </WebHoldPressable>
    );
  }

  return (
    <Pressable
      onPressIn={start}
      onPressOut={end}
      style={style}
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}>
      {children}
    </Pressable>
  );
}

const webHoldStyle = {
  cursor: 'pointer',
  touchAction: 'none',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  WebkitTouchCallout: 'none',
} as ViewStyle;
