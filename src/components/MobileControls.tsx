import { Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

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
      <View style={styles.movementControls}>
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
          <LinearGradient colors={["rgba(0,123,255,0.38)", "rgba(0,207,255,0.38)"]} style={styles.gradientButton}>
            <Text style={styles.buttonText}>←</Text>
          </LinearGradient>
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
          <LinearGradient colors={["rgba(0,123,255,0.38)", "rgba(0,207,255,0.38)"]} style={styles.gradientButton}>
            <Text style={styles.buttonText}>→</Text>
          </LinearGradient>
        </Pressable>
      </View>
      <Pressable
        accessibilityLabel="Saltar"
        accessibilityRole="button"
        onPressIn={onJump}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.pressedButton,
        ]}
      >
        <LinearGradient colors={["rgba(0,123,255,0.38)", "rgba(0,207,255,0.38)"]} style={styles.gradientButton}>
          <Text style={styles.buttonText}>↑</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}
