import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { levelScreenStyles } from "../styles/LevelScreenStyles";

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
  const levels = [
    "La cama",
    "El autobús",
    "El campus",
    "El aula",
  ];

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

      <View style={levelScreenStyles.content}>
        <Text style={levelScreenStyles.title}>Selecciona un nivel</Text>

        <View style={levelScreenStyles.levels}>
          {levels.map((level, index) => (
            <Pressable
              key={level}
              onPress={() =>
                navigation.navigate("Game", {
                  level: index + 1,
                  title: level,
                })
              }
              onHoverIn={() => setHoveredLevel(index)}
              onHoverOut={() => setHoveredLevel(null)}
              style={({ pressed }) => [
                levelScreenStyles.levelButton,
                (pressed || hoveredLevel === index) &&
                  levelScreenStyles.levelButtonActive,
              ]}
            >
              <LinearGradient
                colors={["#007BFF", "#00CFFF"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={levelScreenStyles.levelButtonGradient}
              >
                <Text style={levelScreenStyles.levelButtonText}>{level}</Text>
              </LinearGradient>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}