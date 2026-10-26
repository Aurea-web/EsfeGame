import {
  View,
  Text,
  Button
} from "react-native";

export default function WinScreen({ navigation }: any) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>¡Ganaste!</Text>

      <Button
        title="Menú"
        onPress={() =>
          navigation.navigate("Home")
        }
      />
    </View>
  );
}