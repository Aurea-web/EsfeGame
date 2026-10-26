import {
  View,
  Text,
  Button
} from "react-native";

export default function LoseScreen({ navigation }: any) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Has perdido</Text>

      <Button
        title="Reintentar"
        onPress={() =>
          navigation.goBack()
        }
      />
    </View>
  );
}