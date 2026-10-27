import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import Matter from "matter-js";

import {
  getPlayerPositionStyle,
  getSpriteSheetStyle,
  playerFrameSize,
  playerStyles,
} from "../styles/PlayerStyles";

const walkSprite = require("../../assets/Walk.png");
const idleSprite = require("../../assets/Idle.png");
const walkFrameCount = 12;
const idleFrameCount = 9;
const movementThreshold = 0.1;

type PlayerProps = {
  body: Matter.Body;
};

export default function Player({ body }: PlayerProps) {
  const isMoving = Math.abs(body.velocity.x) > movementThreshold;
  const frameCount = isMoving ? walkFrameCount : idleFrameCount;
  const [animation, setAnimation] = useState({ isMoving: false, frame: 0 });
  const frame = animation.isMoving === isMoving ? animation.frame : 0;

  useEffect(() => {
    const interval = setInterval(
      () =>
        setAnimation((currentAnimation) => {
          const currentFrame =
            currentAnimation.isMoving === isMoving
              ? currentAnimation.frame
              : 0;

          return {
            isMoving,
            frame: (currentFrame + 1) % frameCount,
          };
        }),
      isMoving ? 90 : 140
    );

    return () => clearInterval(interval);
  }, [frameCount, isMoving]);

  return (
    <View
      style={[
        playerStyles.container,
        getPlayerPositionStyle(
          body.position.x - playerFrameSize / 2,
          body.position.y - (playerFrameSize - 20)
        ),
      ]}
    >
      {!isMoving && (
        <View style={playerStyles.speechBubble}>
          <Text style={playerStyles.speechText}>
            Necesito concentrarme y llegar a ESFE
          </Text>
          <View style={playerStyles.speechTail} />
        </View>
      )}
      <View style={playerStyles.spriteViewport}>
        <Image
          source={isMoving ? walkSprite : idleSprite}
          resizeMode="stretch"
          style={[
            playerStyles.spriteSheet,
            getSpriteSheetStyle(frame, frameCount),
          ]}
        />
      </View>
    </View>
  );
}
