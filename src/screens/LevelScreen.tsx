import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function LevelsScreen({ navigation }: any) {
  const levels = [
    "La Cama",
    "El Autobús",
    "El Campus",
    "El Aula",
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Selecciona un nivel
      </Text>

      {levels.map((level, index) => (
        <TouchableOpacity
          key={index}
          style={styles.levelButton}
          onPress={() =>
            navigation.navigate("Game", {
              level: index + 1,
              title: level,
            })
          }
        >
          <Text>{level}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },

  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 30,
  },

  levelButton: {
    backgroundColor: "#dbeafe",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
});