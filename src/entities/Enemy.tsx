import React from "react";
import { View } from "react-native";

export default function Enemy({ body }: any) {
  return (
    <View
      style={{
        position: "absolute",
        width: 50,
        height: 30,
        borderRadius: 10,
        backgroundColor: "#ff6b6b",
        left: body.position.x - 25,
        top: body.position.y - 15,
      }}
    />
  );
}