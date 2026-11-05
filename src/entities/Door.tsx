import { Image } from "react-native";
import Matter from "matter-js";

type DoorProps = {
  body: Matter.Body;
};

export default function Door({ body }: DoorProps) {
  return (
    <Image
      accessibilityLabel="Puerta de salida"
      source={require("../../assets/puertanivel.png")}
      resizeMode="stretch"
      style={{
        position: "absolute",
        width: 76,
        height: 96,
        left: body.position.x - 38,
        top: body.position.y - 48,
      }}
    />
  );
}
