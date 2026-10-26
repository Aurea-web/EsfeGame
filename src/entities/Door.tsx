// src/entities/Door.tsx

import React from "react";
import { View } from "react-native";

export default function Door({
  body,
}: any) {

  return (
    <View
      style={{
        position: "absolute",
        width: 50,
        height: 80,
        backgroundColor: "green",
        left: body.position.x - 25,
        top: body.position.y - 40,
      }}
    />
  );
}