import { View } from "react-native";
import Matter from "matter-js";

type RayoRojoProps = {
  body: Matter.Body;
};

const RAY_WIDTH = 70;
const RAY_HEIGHT = 8;

export default function RayoRojo({ body }: RayoRojoProps) {
  const angle =
    (Math.atan2(body.velocity.y, body.velocity.x) * 180) / Math.PI;

  return (
    <View
      accessibilityLabel="Rayo rojo"
      style={{
        position: "absolute",
        width: RAY_WIDTH,
        height: RAY_HEIGHT,
        left: body.position.x - RAY_WIDTH / 2,
        top: body.position.y - RAY_HEIGHT / 2,
        justifyContent: "center",
        transform: [{ rotate: `${angle}deg` }],
      }}
    >
      <View
        style={{
          width: RAY_WIDTH,
          height: 4,
          borderRadius: 2,
          backgroundColor: "#ff1744",
          opacity: 0.95,
          shadowColor: "#ff1744",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 5,
        }}
      />
      <View
        style={{
          position: "absolute",
          right: -4,
          width: 16,
          height: 16,
          borderRadius: 8,
          backgroundColor: "#ff1744",
          shadowColor: "#ff1744",
          shadowOpacity: 1,
          shadowRadius: 8,
        }}
      />
    </View>
  );
}
