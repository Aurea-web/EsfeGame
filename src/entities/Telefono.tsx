import { Image } from "react-native";
import Matter from "matter-js";

type TelefonoProps = {
  body: Matter.Body;
};

const TELEFONO_WIDTH = 48;
const TELEFONO_HEIGHT = 48;

export default function Telefono({ body }: TelefonoProps) {
  return (
    <Image
      accessibilityLabel="Telefono movil"
      source={require("../../assets/Teléfono.png")}
      resizeMode="contain"
      style={{
        position: "absolute",
        width: TELEFONO_WIDTH,
        height: TELEFONO_HEIGHT,
        left: body.position.x - TELEFONO_WIDTH / 2,
        top: body.position.y - TELEFONO_HEIGHT / 2,
      }}
    />
  );
}
