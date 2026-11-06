import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { PlayerCharacter, playerSprites } from "../entities/PlayerSprites";
import { characterSelectStyles as styles } from "../styles/CharacterSelectStyles";

const characters: {
  id: PlayerCharacter;
  name: string;
  description: string;
}[] = [
  {
    id: "male",
    name: "Chico",
    description: "Ágil y listo para concentrarse",
  },
  {
    id: "female",
    name: "Chica",
    description: "Ágil y lista para concentrarse",
  },
];

export default function CharacterSelectScreen({ navigation, route }: any) {
  const [selectedCharacter, setSelectedCharacter] =
    useState<PlayerCharacter>("female");
  const level = route.params?.level ?? 1;
  const title = route.params?.title;

  const startGame = () => {
    navigation.replace("Game", {
      level,
      title,
      character: selectedCharacter,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.glow} />
      <Text style={styles.title}>Selecciona tu personaje</Text>
      <Text style={styles.subtitle}>Elige quién te acompañará en el nivel</Text>

      <View style={styles.characterRow}>
        {characters.map((character) => {
          const isSelected = selectedCharacter === character.id;

          return (
            <Pressable
              key={character.id}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${character.name}${isSelected ? ", seleccionado" : ""}`}
              onPress={() => setSelectedCharacter(character.id)}
              style={[
                styles.characterCard,
                isSelected && styles.characterCardSelected,
              ]}
            >
              <LinearGradient
                colors={
                  isSelected
                    ? ["#30215C", "#121B31"]
                    : ["#19212F", "#111722"]
                }
                style={styles.cardGradient}
              >
                <View style={styles.portrait}>
                  <Image
                    source={playerSprites[character.id].preview}
                    resizeMode="contain"
                    style={styles.portraitImage}
                  />
                </View>
                <Text style={styles.characterName}>{character.name}</Text>
                <Text style={styles.characterDescription}>
                  {character.description}
                </Text>
                <Text style={styles.selectionStatus}>
                  {isSelected ? "SELECCIONADO" : "TOCA PARA ELEGIR"}
                </Text>
              </LinearGradient>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={startGame}
        style={({ pressed }) => [
          styles.continueButton,
          pressed && styles.continueButtonPressed,
        ]}
      >
        <LinearGradient
          colors={["#174CEB", "#17A7FF"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.continueGradient}
        >
          <Text style={styles.continueText}>Comenzar nivel</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}
