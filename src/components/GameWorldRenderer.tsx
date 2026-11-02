import React from "react";
import { ImageBackground, View } from "react-native";

import { worldHeight, worldWidth } from "../services/GameState";
import {
  gameScreenStyles,
  getWorldContentStyle,
} from "../styles/GameScreenStyles";

export default function GameWorldRenderer(
  entities: Record<string, any> | null,
  screen: any,
  layout: any,
  level: number
) {
  if (!entities?.player || !layout) return null;

  const cameraX = Math.max(
    0,
    Math.min(
      entities.player.body.position.x - layout.width * 0.4,
      worldWidth - layout.width
    )
  );
  const cameraY = Math.max(
    0,
    Math.min(
      entities.player.body.position.y - layout.height * 0.48,
      worldHeight - layout.height
    )
  );

  return (
    <View style={gameScreenStyles.worldViewport}>
      {level === 1 && (
        <ImageBackground
          source={require("../../assets/La cama.jpg")}
          resizeMode="cover"
          style={gameScreenStyles.levelBackground}
          imageStyle={gameScreenStyles.levelBackgroundImage}
        />
      )}
      <View
        style={[
          gameScreenStyles.worldContent,
          getWorldContentStyle(cameraX, cameraY, worldWidth, worldHeight),
        ]}
      >
        {Object.keys(entities)
          .filter((key) => entities[key].renderer)
          .sort(
            (first, second) =>
              Number(first === "player") - Number(second === "player")
          )
          .map((key) => {
            const entity = entities[key];
            const Renderer = entity.renderer;

            return React.createElement(Renderer, {
              key,
              screen,
              layout,
              ...entity,
            });
          })}
      </View>
    </View>
  );
}
