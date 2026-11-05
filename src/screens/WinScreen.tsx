import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useAudioPlayer } from "expo-audio";
import { winScreenStyles as styles } from "../styles/WinScreenStyles";
import { completeLevel, LEVELS } from "../services/LevelProgress";

export default function WinScreen({ navigation, route }: any) {
  const winSoundPlayer = useAudioPlayer(
    require("../../assets/winlevel.mpeg")
  );
  const score = route.params?.score ?? 0;
  const level = route.params?.level ?? 1;
  const concentration = route.params?.concentration ?? 100;
  const [saveStatus, setSaveStatus] = useState<"saving" | "saved" | "error">(
    "saving"
  );
  const [saveAttempt, setSaveAttempt] = useState(0);
  const floatingPixels = [
    styles.pixel0,
    styles.pixel1,
    styles.pixel2,
    styles.pixel3,
    styles.pixel4,
    styles.pixel5,
  ];

  useEffect(() => {
    winSoundPlayer.play();
  }, [winSoundPlayer]);

  useEffect(() => {
    let isMounted = true;

    void completeLevel(level)
      .then(() => {
        if (isMounted) {
          setSaveStatus("saved");
        }
      })
      .catch((error: unknown) => {
        console.warn("Unable to save completed level progress.", error);
        if (isMounted) {
          setSaveStatus("error");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [level, saveAttempt]);

  return (
    <View style={styles.container}>
      <View style={styles.glow} />
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <View
          key={index}
          style={[
            styles.pixel,
            floatingPixels[index],
          ]}
        />
      ))}

      <View style={styles.panel}>
        <Text style={styles.title}>¡Ganaste!</Text>
        <Text style={styles.subtitle}>Completaste el nivel</Text>
        <Text style={styles.score}>{score}</Text>
        <Text style={styles.concentration}>
          Concentración: {concentration}%
        </Text>
        <Text
          accessibilityRole="text"
          style={[
            styles.progressMessage,
            saveStatus === "error" && styles.progressError,
          ]}
        >
          {saveStatus === "saving"
            ? "Guardando progreso..."
            : saveStatus === "saved"
              ? "Progreso guardado"
              : "No se pudo guardar el progreso"}
        </Text>

        {saveStatus === "error" && (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setSaveStatus("saving");
              setSaveAttempt((attempt) => attempt + 1);
            }}
            style={({ pressed }) => [
              styles.retryButton,
              pressed && styles.pressedButton,
            ]}
          >
            <Text style={styles.buttonText}>Reintentar guardado</Text>
          </Pressable>
        )}

        <Pressable
          accessibilityRole="button"
          disabled={saveStatus === "saving"}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: "Levels" }],
            })
          }
          style={({ pressed }) => [
            styles.button,
            styles.menuButton,
            saveStatus === "saving" && styles.disabledButton,
            pressed && styles.pressedButton,
          ]}
        >
          <Text style={styles.buttonText}>Menú</Text>
        </Pressable>

        {saveStatus === "saved" && level < LEVELS.length && (
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              navigation.replace("Game", {
                level: level + 1,
                title: LEVELS[level],
              })
            }
            style={({ pressed }) => [
              styles.button,
              styles.nextButton,
              pressed && styles.pressedButton,
            ]}
          >
            <Text style={styles.buttonText}>Siguiente nivel</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}