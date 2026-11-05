import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { useAudioPlayer } from "expo-audio";
import { winScreenStyles as styles } from "../styles/WinScreenStyles";

export default function WinScreen({ navigation, route }: any) {
  const winSoundPlayer = useAudioPlayer(
    require("../../assets/winlevel.mpeg")
  );
  const score = route.params?.score ?? 0;
  const level = route.params?.level ?? 1;
  const concentration = route.params?.concentration ?? 100;
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
        <Text style={styles.subtitle}>Pasaste al siguiente nivel</Text>
        <Text style={styles.score}>{score}</Text>
        <Text style={styles.concentration}>
          Concentración: {concentration}%
        </Text>

        <Pressable
          accessibilityRole="button"
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: "Levels" }],
            })
          }
          style={({ pressed }) => [
            styles.button,
            styles.menuButton,
            pressed && styles.pressedButton,
          ]}
        >
          <Text style={styles.buttonText}>Menú</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() =>
            navigation.replace("Game", {
              level: level + 1,
              title: `Nivel ${level + 1}`,
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
      </View>
    </View>
  );
}