import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import Matter from "matter-js";

import {
  getPlayerPositionStyle,
  getSpriteSheetStyle,
  playerFrameSize,
  playerStyles,
} from "../styles/PlayerStyles";
import { PlayerCharacter, playerSprites } from "./PlayerSprites";

const movementThreshold = 0.1;
const jumpThreshold = 0.75;

type PlayerProps = {
  body: Matter.Body;
  character?: PlayerCharacter;
  facingLeft?: boolean;
  isHit?: boolean;
};

export default function Player({
  body,
  character = "female",
  facingLeft = false,
  isHit = false,
}: PlayerProps) {
  const sprites = playerSprites[character];
  const isMoving = Math.abs(body.velocity.x) > movementThreshold;
  const isMovingLeft = body.velocity.x < -movementThreshold;
  const isJumping = Math.abs(body.velocity.y) > jumpThreshold;
  const isFacingLeft =
    isMovingLeft || (!isMoving && facingLeft);

  const animationName = isJumping ? "jump" : isMoving ? "walk" : "idle";
  const frameCount =
    animationName === "walk"
      ? sprites.walkFrameCount
      : animationName === "jump"
        ? sprites.jumpFrameCount
        : sprites.idleFrameCount;
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
          body.position.y - (playerFrameSize - 29)
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
              ? isFacingLeft
                ? sprites.jumpLeft
                : sprites.jumpRight
              : isMovingLeft
                ? sprites.walkLeft
                : isMoving
                  ? sprites.walkRight
                  : sprites.idle
          }
          resizeMode="stretch"
          style={[
            playerStyles.spriteSheet,
            getSpriteSheetStyle(frame, frameCount),
          ]}
        />
        {isHit && (
          <View
            accessibilityLabel="Personaje impactado"
            style={playerStyles.hitFlash}
          />
        )}
      </View>
    </View>
  );
}
