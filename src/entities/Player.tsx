import { useEffect, useRef, useState } from "react";
import { Image, Text, View } from "react-native";
import Matter from "matter-js";

import {
  getPlayerPositionStyle,
  getSpriteSheetStyle,
  playerFrameSize,
  playerStyles,
} from "../styles/PlayerStyles";

const walkSprite = require("../../assets/Walk.png");
const walkLeftSprite = require("../../assets/Walk_izquierda.png");
const jumpRightSprite = require("../../assets/Salto_Femenino_Derecha.png");
const jumpLeftSprite = require("../../assets/Salto_Femenino_Izquierda.png");
const idleSprite = require("../../assets/Idle.png");
const walkFrameCount = 12;
const idleFrameCount = 9;
const movementThreshold = 0.1;
const jumpThreshold = 0.75;

type PlayerProps = {
  body: Matter.Body;
};

export default function Player({ body }: PlayerProps) {
  const isMoving = Math.abs(body.velocity.x) > movementThreshold;
  const isMovingLeft = body.velocity.x < -movementThreshold;
  const isJumping = Math.abs(body.velocity.y) > jumpThreshold;
  const facingLeft = useRef(false);

  if (isMovingLeft) facingLeft.current = true;
  if (body.velocity.x > movementThreshold) facingLeft.current = false;

  const animationName = isJumping ? "jump" : isMoving ? "walk" : "idle";
  const frameCount =
    animationName === "walk"
      ? walkFrameCount
      : animationName === "jump"
        ? walkFrameCount
        : idleFrameCount;
  const [animation, setAnimation] = useState({
    name: "idle",
    frame: 0,
  });
  const frame = animation.name === animationName ? animation.frame : 0;

  useEffect(() => {
    const interval = setInterval(
      () =>
        setAnimation((currentAnimation) => {
          const currentFrame =
            currentAnimation.name === animationName
              ? currentAnimation.frame
              : 0;

          return {
            name: animationName,
            frame: (currentFrame + 1) % frameCount,
          };
        }),
      animationName === "idle" ? 140 : 90
    );

    return () => clearInterval(interval);
  }, [animationName, frameCount]);

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
      {!isMoving && !isJumping && (
        <View style={playerStyles.speechBubble}>
          <Text style={playerStyles.speechText}>
            Necesito concentrarme y llegar a ESFE
          </Text>
          <View style={playerStyles.speechTail} />
        </View>
      )}
      <View style={playerStyles.spriteViewport}>
        <Image
          source={
            isJumping
              ? facingLeft.current
                ? jumpLeftSprite
                : jumpRightSprite
              : isMovingLeft
                ? walkLeftSprite
                : isMoving
                  ? walkSprite
                  : idleSprite
          }
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
