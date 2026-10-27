import { Pressable, Text, View } from "react-native";

import { pauseMenuStyles as styles } from "../styles/PauseMenuStyles";

type PauseMenuProps = {
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onExit: () => void;
  onRestart: () => void;
};

export default function PauseMenu({
  isPaused,
  onPause,
  onResume,
  onExit,
  onRestart,
}: PauseMenuProps) {
  return (
    <>
      <Pressable
        accessibilityLabel="Pausar juego"
        accessibilityRole="button"
        onPress={onPause}
        style={({ pressed }) => [
          styles.pauseButton,
          pressed && styles.pressedPauseButton,
        ]}
      >
        <View style={styles.pauseIcon}>
          <View style={styles.pauseBar} />
          <View style={styles.pauseBar} />
        </View>
      </Pressable>

      {isPaused && (
        <View style={styles.overlay}>
          <View style={styles.menu}>
            <Text style={styles.title}>Juego en pausa</Text>
            <Pressable
              accessibilityRole="button"
              onPress={onResume}
              style={({ pressed }) => [
                styles.action,
                styles.resumeAction,
                pressed && styles.pressedAction,
              ]}
            >
              <Text style={styles.actionText}>Reanudar</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={onExit}
              style={({ pressed }) => [
                styles.action,
                styles.exitAction,
                pressed && styles.pressedAction,
              ]}
            >
              <Text style={styles.actionText}>Salir</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={onRestart}
              style={({ pressed }) => [
                styles.action,
                styles.restartAction,
                pressed && styles.pressedAction,
              ]}
            >
              <Text style={styles.actionText}>Repetir</Text>
            </Pressable>
          </View>
        </View>
      )}
    </>
  );
}
