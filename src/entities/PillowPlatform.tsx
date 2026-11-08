import Matter from "matter-js";
import { Image } from "react-native";

type PillowPlatformProps = {
  body: Matter.Body;
};

const pillowTexture = require("../../assets/memory-foam-pillow.png");

export default function PillowPlatform({ body }: PillowPlatformProps) {
  const width = body.bounds.max.x - body.bounds.min.x;
  const height = body.bounds.max.y - body.bounds.min.y;

  return (
    <Image
      accessibilityLabel="Plataforma de almohada"
      source={pillowTexture}
      resizeMode="contain"
      style={{
        position: "absolute",
        width,
        height,
        left: body.position.x - width / 2,
        top: body.position.y - height / 2,
      }}
    />
  );
}
