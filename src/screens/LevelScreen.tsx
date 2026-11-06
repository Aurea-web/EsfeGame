import { useCallback, useEffect, useState } from "react";
import { BackHandler, Pressable, ScrollView, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { levelScreenStyles } from "../styles/LevelScreenStyles";
import { getHighestCompletedLevel, LEVELS } from "../services/LevelProgress";

const pixels = [
  { top: "16%", left: "9%", color: "#A259FF" },
  { top: "28%", right: "11%", color: "#00CFFF" },
  { top: "47%", left: "7%", color: "#00CFFF" },
  { top: "68%", right: "18%", color: "#A259FF" },
  { top: "82%", left: "18%", color: "#A259FF" },
  { top: "37%", right: "5%", color: "#00CFFF" },
] as const;

export default function LevelsScreen({ navigation }: any) {
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);
  const [highestCompletedLevel, setHighestCompletedLevel] = useState(0);
  const [progressStatus, setProgressStatus] = useState<
    "loading" | "ready" | "error"
  >("loading");

  const loadProgress = useCallback(() => {
    setProgressStatus("loading");

    void getHighestCompletedLevel()
      .then((level) => {
        setHighestCompletedLevel(level);
        setProgressStatus("ready");
      })
      .catch((error: unknown) => {
        console.warn("Unable to load saved level progress.", error);
        setProgressStatus("error");
      });
  }, []);

  useFocusEffect(useCallback(() => loadProgress(), [loadProgress]));

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
        return true;
      }
    );

    return () => subscription.remove();
  }, [navigation]);

  return (
    <View style={levelScreenStyles.container}>
      <View style={levelScreenStyles.radialGlow} />
      <View style={[levelScreenStyles.shape, levelScreenStyles.circleOne]} />
      <View style={[levelScreenStyles.shape, levelScreenStyles.circleTwo]} />
      <View style={[levelScreenStyles.shape, levelScreenStyles.triangleOne]} />
      <View style={[levelScreenStyles.shape, levelScreenStyles.triangleTwo]} />
      {pixels.map((pixel, index) => (
        <View
          key={index}
          style={[
            levelScreenStyles.pixel,
            {
              top: pixel.top,
              left: "left" in pixel ? pixel.left : undefined,
              right: "right" in pixel ? pixel.right : undefined,
              backgroundColor: pixel.color,
            },
          ]}
        />
      ))}

      <ScrollView
        contentContainerStyle={levelScreenStyles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={levelScreenStyles.title}>Selecciona un nivel</Text>
        <Text style={levelScreenStyles.subtitle}>
          Completa cada nivel para desbloquear el siguiente
        </Text>

        {progressStatus === "loading" ? (
          <Text style={levelScreenStyles.message}>Cargando progreso...</Text>
        ) : progressStatus === "error" ? (
          <View style={levelScreenStyles.messageContainer}>
            <Text style={levelScreenStyles.message}>
              No se pudo cargar tu progreso guardado.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={loadProgress}
              style={levelScreenStyles.retryButton}
            >
              <Text style={levelScreenStyles.retryButtonText}>Reintentar</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Text style={levelScreenStyles.progress}>
              {highestCompletedLevel} de {LEVELS.length} niveles completados
            </Text>
            <View style={levelScreenStyles.levels}>
              {LEVELS.map((level, index) => {
                const levelNumber = index + 1;
                const completed = levelNumber <= highestCompletedLevel;
                const unlocked = levelNumber <= highestCompletedLevel + 1;
                const isHovered = hoveredLevel === index;

                return (
                  <Pressable
                    key={level}
                    accessibilityRole="button"
                    accessibilityState={{ disabled: !unlocked }}
                    disabled={!unlocked}
                    onPress={() =>
                      navigation.navigate("CharacterSelect", {
                        level: levelNumber,
                        title: level,
                      })
                    }
                    onHoverIn={() => setHoveredLevel(index)}
                    onHoverOut={() => setHoveredLevel(null)}
                    style={({ pressed }) => [
                      levelScreenStyles.levelButton,
                      !unlocked && levelScreenStyles.levelButtonLocked,
                      completed && levelScreenStyles.levelButtonCompleted,
                      unlocked &&
                        (pressed || isHovered) &&
                        levelScreenStyles.levelButtonActive,
                    ]}
                  >
                    <LinearGradient
                      colors={
                        !unlocked
                          ? ["#26303A", "#1A222B"]
                          : completed
                            ? ["#147A55", "#20B875"]
                            : ["#174CEB", "#17A7FF"]
                      }
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={levelScreenStyles.levelButtonGradient}
                    >
                      <View
                        style={[
                          levelScreenStyles.levelNumber,
                          !unlocked && levelScreenStyles.levelNumberLocked,
                        ]}
                      >
                        <Text style={levelScreenStyles.levelNumberText}>
                          {levelNumber}
                        </Text>
                      </View>
                      <View style={levelScreenStyles.levelCopy}>
                        <Text
                          style={[
                            levelScreenStyles.levelButtonText,
                            !unlocked && levelScreenStyles.levelButtonTextLocked,
                          ]}
                        >
                          {level}
                        </Text>
                        <Text
                          style={[
                            levelScreenStyles.levelStatus,
                            !unlocked && levelScreenStyles.levelStatusLocked,
                          ]}
                        >
                          {completed
                            ? "COMPLETADO"
                            : unlocked
                              ? "DISPONIBLE"
                              : "BLOQUEADO"}
                        </Text>
                      </View>
                      <Text style={levelScreenStyles.levelIndicator}>
                        {completed ? "✓" : unlocked ? "›" : "🔒"}
                      </Text>
                    </LinearGradient>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}