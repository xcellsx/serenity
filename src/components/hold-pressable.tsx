import { Platform, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { useRef } from 'react';

type Props = {
  onHoldStart: () => void;
  onHoldEnd: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

type WebPointerEvent = {
  preventDefault: () => void;
  pointerId?: number;
  buttons?: number;
  currentTarget: unknown;
};

/**
 * Press-and-hold that works on native touch and web pointer events
 * (mouse down/up, touch, pointer capture).
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
    const webHandlers = {
      onPointerDown: (e: WebPointerEvent) => {
        e.preventDefault();
        const target = e.currentTarget as HTMLElement;
        if (typeof e.pointerId === 'number') {
          target.setPointerCapture?.(e.pointerId);
        }
        start();
      },
      onPointerUp: end,
      onPointerCancel: end,
      onPointerLeave: (e: WebPointerEvent) => {
        if (e.buttons === 0) end();
      },
    };

    return (
      <View
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={[style, webHoldStyle]}
        {...(webHandlers as object)}>
        {children}
      </View>
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
} as ViewStyle;
