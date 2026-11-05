import { Image } from "react-native";
import Matter from "matter-js";

type EnemyProps = {
  body: Matter.Body;
};

const BED_WIDTH = 100;
const BED_HEIGHT = (BED_WIDTH * 166) / 219;

export default function Enemy({ body }: EnemyProps) {
  return (
    <Image
      accessibilityLabel="Enemigo: cama flotante"
      source={require("../../assets/camaflotante.png")}
      resizeMode="stretch"
      style={{
        position: "absolute",
        width: BED_WIDTH,
        height: BED_HEIGHT,
        left: body.position.x - BED_WIDTH / 2,
        top: body.position.y - BED_HEIGHT / 2,
      }}
    />
  );
}
