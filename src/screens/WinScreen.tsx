import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAudioPlayer } from "expo-audio";

import { completeLevel, LEVELS } from "../services/LevelProgress";
import { winScreenStyles as styles } from "../styles/WinScreenStyles";

const stars: {
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  size: number;
  color: string;
}[] = [
  { left: "7%", top: "19%", size: 7, color: "#49DFFF" },
  { left: "16%", top: "38%", size: 10, color: "#F53FCB" },
  { left: "26%", top: "16%", size: 5, color: "#F53FCB" },
  { left: "36%", top: "33%", size: 6, color: "#7A72FF" },
  { right: "8%", top: "18%", size: 8, color: "#F53FCB" },
  { right: "18%", top: "38%", size: 6, color: "#49DFFF" },
  { right: "29%", top: "15%", size: 5, color: "#49DFFF" },
  { right: "37%", top: "34%", size: 9, color: "#F53FCB" },
  { left: "10%", bottom: "20%", size: 8, color: "#7A72FF" },
  { left: "23%", bottom: "13%", size: 6, color: "#49DFFF" },
  { right: "12%", bottom: "19%", size: 7, color: "#49DFFF" },
  { right: "25%", bottom: "12%", size: 9, color: "#F53FCB" },
];

export default function WinScreen({ navigation, route }: any) {
  const winSoundPlayer = useAudioPlayer(
    require("../../assets/winlevel.mpeg")
  );
  const score = route.params?.score ?? 0;
  const level = route.params?.level ?? 1;
  const [saveStatus, setSaveStatus] = useState<"saving" | "saved" | "error">(
    "saving"
  );
  const [saveAttempt, setSaveAttempt] = useState(0);

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

  const hasNextLevel = level < LEVELS.length;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#090624", "#35107B", "#52149B", "#180642", "#07051D"]}
        locations={[0, 0.3, 0.55, 0.8, 1]}
        style={styles.background}
      />
      <View pointerEvents="none" style={styles.glow} />
      <View pointerEvents="none" style={styles.horizonGlow} />
      {stars.map((star, index) => (
        <View
          key={index}
          pointerEvents="none"
          style={[
            styles.star,
            {
              left: star.left,
              right: star.right,
              top: star.top,
              bottom: star.bottom,
              width: star.size,
              height: star.size,
              backgroundColor: star.color,
              shadowColor: star.color,
            },
          ]}
        />
      ))}

      <View style={styles.content}>
        <Text style={styles.title}>¡Ganaste!</Text>
        <Text style={styles.subtitle}>Pasaste al siguiente nivel</Text>
        <Text accessibilityLabel={`Puntuación: ${score}`} style={styles.score}>
          {String(score)}
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
              styles.saveRetryButton,
              pressed && styles.pressedButton,
            ]}
          >
            <Text style={styles.saveRetryText}>Reintentar guardado</Text>
          </Pressable>
        )}

        <View style={styles.buttons}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver a la selección de niveles"
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: "Levels" }],
              })
            }
            style={({ pressed }) => [
              styles.buttonShell,
              styles.levelButton,
              pressed && styles.pressedButton,
            ]}
          >
            <LinearGradient
              colors={["#238BFF", "#0751D6", "#082F91"]}
              style={styles.buttonGradient}
            >
              <Text adjustsFontSizeToFit minimumFontScale={0.75} style={styles.buttonText}>
                Nivel
              </Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              hasNextLevel ? "Jugar siguiente nivel" : "Todos los niveles completados"
            }
            disabled={saveStatus !== "saved" || !hasNextLevel}
            onPress={() =>
              navigation.replace("Game", {
                level: level + 1,
                title: LEVELS[level],
                character: route.params?.character,
              })
            }
            style={({ pressed }) => [
              styles.buttonShell,
              styles.nextButton,
              (saveStatus !== "saved" || !hasNextLevel) && styles.disabledButton,
              pressed && styles.pressedButton,
            ]}
          >
            <LinearGradient
              colors={["#7BFF25", "#28C40C", "#0A831A"]}
              style={styles.buttonGradient}
            >
              <Text adjustsFontSizeToFit minimumFontScale={0.75} style={styles.buttonText}>
                {hasNextLevel ? "Siguiente nivel" : "¡Completaste todo!"}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
