import { Pressable, Text, View } from "react-native";

import { mobileControlsStyles as styles } from "../styles/MobileControlsStyles";

type MobileControlsProps = {
  onMoveLeftIn: () => void;
  onMoveLeftOut: () => void;
  onJump: () => void;
  onMoveRightIn: () => void;
  onMoveRightOut: () => void;
};

export default function MobileControls({
  onMoveLeftIn,
  onMoveLeftOut,
  onJump,
  onMoveRightIn,
  onMoveRightOut,
}: MobileControlsProps) {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel="Correr a la izquierda"
        accessibilityRole="button"
        onPressIn={onMoveLeftIn}
        onPressOut={onMoveLeftOut}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.pressedButton,
        ]}
      >
        <Text style={styles.buttonText}>←</Text>
      </Pressable>
      <Pressable
        accessibilityLabel="Saltar"
        accessibilityRole="button"
        onPressIn={onJump}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.pressedButton,
        ]}
      >
        <Text style={styles.buttonText}>↑</Text>
      </Pressable>
      <Pressable
        accessibilityLabel="Correr a la derecha"
        accessibilityRole="button"
        onPressIn={onMoveRightIn}
        onPressOut={onMoveRightOut}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.pressedButton,
        ]}
      >
        <Text style={styles.buttonText}>→</Text>
      </Pressable>
    </View>
  );
}
