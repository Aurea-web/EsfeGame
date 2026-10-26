import React from "react";
import { View } from "react-native";

export default function Coin({
  body,
}: any) {
  if (body.label !== "coin") return null;

  return (
    <View
      style={{
        position: "absolute",
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "gold",
        left: body.position.x - 10,
        top: body.position.y - 10,
      }}
    />
  );
}