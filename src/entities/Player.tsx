import React from "react";
import { View } from "react-native";

const Player = ({ body }: any) => {
  const width = 40;
  const height = 40;

  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2;

  return (
    <View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        backgroundColor: "#2563eb",
        borderRadius: 8,
      }}
    />
  );
};

export default Player;