import { Image } from "react-native";
import Matter from "matter-js";

type BedPlatformProps = {
  body: Matter.Body;
};

const bedTexture = require("../../assets/camaflotante.png");
const BED_IMAGE_RATIO = 166 / 219;
const BED_PLATFORM_TOP_RATIO = 0.4;

export default function BedPlatform({ body }: BedPlatformProps) {
  const width = body.bounds.max.x - body.bounds.min.x;
  const height = width * BED_IMAGE_RATIO;

  return (
    <Image
      accessibilityLabel="Cama flotante"
      source={bedTexture}
      resizeMode="stretch"
      style={{
        position: "absolute",
        width,
        height,
        left: body.position.x - width / 2,
        top: body.position.y - height * BED_PLATFORM_TOP_RATIO,
      }}
    />
  );
}
