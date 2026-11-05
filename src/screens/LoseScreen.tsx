import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";

import { loseScreenStyles as styles } from "../styles/LoseScreenStyles";

export default function LoseScreen({ navigation, route }: any) {
  const score = route.params?.score ?? 0;
  const level = route.params?.level ?? 1;
  const pixels = [
    styles.pixel0,
    styles.pixel1,
    styles.pixel2,
    styles.pixel3,
    styles.pixel4,
    styles.pixel5,
    styles.pixel6,
    styles.pixel7,
    styles.pixel8,
    styles.pixel9,
    styles.pixel10,
    styles.pixel11,
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#030515", "#16082F", "#08091C"]}
        locations={[0, 0.55, 1]}
        style={styles.background}
      />
      <LinearGradient
        colors={["rgba(113, 35, 185, 0.02)", "rgba(147, 51, 234, 0.35)", "rgba(8, 9, 28, 0.1)"]}
        style={styles.purpleGlow}
      />
      {pixels.map((pixel, index) => (
        <View key={index} style={[styles.pixel, pixel]} />
      ))}

      <View style={styles.panel}>
        <Text style={styles.title}>¡DERROTA!</Text>
        <Text style={styles.subtitle}>
          Perdiste contra la procrastinación.
        </Text>
        <Text
          accessibilityLabel={`Puntuación: ${score}`}
          style={styles.score}
        >
          {String(score).padStart(5, "0")}
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver al menú de niveles"
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: "Levels" }],
            })
          }
          style={({ pressed }) => [
            styles.buttonShell,
            styles.menuButton,
            pressed && styles.pressedButton,
          ]}
        >
          <LinearGradient
            colors={["#50C9FF", "#087EDB", "#00C5ED"]}
            locations={[0, 0.48, 1]}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>MENÚ</Text>
          </LinearGradient>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Repetir nivel"
          onPress={() =>
            navigation.replace("Game", {
              level,
            })
          }
          style={({ pressed }) => [
            styles.buttonShell,
            styles.retryButton,
            pressed && styles.pressedButton,
          ]}
        >
          <LinearGradient
            colors={["#9BEB36", "#42A90F", "#59D600"]}
            locations={[0, 0.48, 1]}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>REPETIR</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}
