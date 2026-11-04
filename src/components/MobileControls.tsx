import { useRef, useState } from "react";
import { Text, View } from "react-native";
import type { ReactNode } from "react";
import type { GestureResponderEvent } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { mobileControlsStyles as styles } from "../styles/MobileControlsStyles";

type MobileControlsProps = {
  onMoveLeftIn: () => void;
  onMoveLeftOut: () => void;
  onJump: () => void;
  onMoveRightIn: () => void;
  onMoveRightOut: () => void;
};

type TouchButtonProps = {
  accessibilityLabel: string;
  onPressIn?: () => void;
  onPressOut?: () => void;
  onActivate?: () => void;
  children: ReactNode;
};

function TouchButton({
  accessibilityLabel,
  onPressIn,
  onPressOut,
  onActivate,
  children,
}: TouchButtonProps) {
  const [pressed, setPressed] = useState(false);
  const activeTouches = useRef(new Set<number>());

  const handleAccessibilityTap = () => {
    onPressIn?.();
    onActivate?.();
    onPressOut?.();
  };

  const handleTouchStart = (event: GestureResponderEvent) => {
    const wasPressed = activeTouches.current.size > 0;
    event.nativeEvent.changedTouches.forEach(({ identifier }) => {
      activeTouches.current.add(identifier);
    });

    if (wasPressed) return;

    setPressed(true);
    onPressIn?.();
    onActivate?.();
  };

  const handleTouchEnd = (event: GestureResponderEvent) => {
    event.nativeEvent.changedTouches.forEach(({ identifier }) => {
      activeTouches.current.delete(identifier);
    });

    if (activeTouches.current.size > 0) return;

    setPressed(false);
    onPressOut?.();
  };

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onAccessibilityTap={handleAccessibilityTap}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={[styles.button, pressed && styles.pressedButton]}
    >
      <LinearGradient
        colors={["rgba(0,123,255,0.38)", "rgba(0,207,255,0.38)"]}
        style={styles.gradientButton}
      >
        {children}
      </LinearGradient>
    </View>
  );
}

export default function MobileControls({
  onMoveLeftIn,
  onMoveLeftOut,
  onJump,
  onMoveRightIn,
  onMoveRightOut,
}: MobileControlsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.movementControls}>
        <TouchButton
          accessibilityLabel="Correr a la izquierda"
          onPressIn={onMoveLeftIn}
          onPressOut={onMoveLeftOut}
        >
          <Text style={styles.buttonText}>←</Text>
        </TouchButton>
        <TouchButton
          accessibilityLabel="Correr a la derecha"
          onPressIn={onMoveRightIn}
          onPressOut={onMoveRightOut}
        >
          <Text style={styles.buttonText}>→</Text>
        </TouchButton>
      </View>
      <TouchButton
        accessibilityLabel="Saltar"
        onActivate={onJump}
      >
        <Text style={styles.buttonText}>↑</Text>
      </TouchButton>
    </View>
  );
}
