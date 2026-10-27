import { useRef, useState } from "react";
import { View } from "react-native";
import Matter from "matter-js";

import GameScene from "../components/GameScene";
import MobileControls from "../components/MobileControls";
import PauseMenu from "../components/PauseMenu";
import ScoreDisplay from "../components/ScoreDisplay";
import { createGameState } from "../services/GameState";
import { jump, moveLeft, moveRight } from "../services/GameControls";
import { gameScreenStyles } from "../styles/GameScreenStyles";

export default function GameScreen({ navigation }: any) {
  const [score, setScore] = useState(0);
  const [game, setGame] = useState(createGameState);
  const [gameKey, setGameKey] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { engine, player, entities } = game;
  const playerRef = useRef(player);
  const pressedDirections = useRef({ left: false, right: false });

  const setDirectionPressed = (
    direction: "left" | "right",
    isPressed: boolean
  ) => {
    if (isPaused) return;

    pressedDirections.current[direction] = isPressed;

    if (pressedDirections.current.left && !pressedDirections.current.right) {
      moveLeft(playerRef.current);
    } else if (
      pressedDirections.current.right &&
      !pressedDirections.current.left
    ) {
      moveRight(playerRef.current);
    } else {
      Matter.Body.setVelocity(playerRef.current, {
        x: 0,
        y: playerRef.current.velocity.y,
      });
    }
  };

  const getMovementDirection = () => {
    if (pressedDirections.current.left && !pressedDirections.current.right) {
      return "left";
    }

    if (pressedDirections.current.right && !pressedDirections.current.left) {
      return "right";
    }

    return null;
  };

  const pauseGame = () => {
    pressedDirections.current = { left: false, right: false };
    Matter.Body.setVelocity(playerRef.current, {
      x: 0,
      y: playerRef.current.velocity.y,
    });
    setIsPaused(true);
  };

  const restartGame = () => {
    pressedDirections.current = { left: false, right: false };
    const restartedGame = createGameState();
    playerRef.current = restartedGame.player;
    setGame(restartedGame);
    setGameKey((key) => key + 1);
    setScore(0);
    setIsPaused(false);
  };

  const handleEvent = (event: { type: string }) => {
    if (event.type === "coin-collected") {
      setScore((previousScore) => previousScore + 10);
    }
    if (event.type === "win") {
      alert("Nivel completado");
    }
  };

  return (
    <View style={gameScreenStyles.container}>
      <View style={gameScreenStyles.gameArea}>
        <ScoreDisplay score={score} />
        <GameScene
          engine={engine}
          entities={entities}
          gameKey={gameKey}
          isPaused={isPaused}
          getMovementDirection={getMovementDirection}
          onEvent={handleEvent}
        />
        <PauseMenu
          isPaused={isPaused}
          onPause={pauseGame}
          onResume={() => setIsPaused(false)}
          onExit={() => navigation.navigate("Levels")}
          onRestart={restartGame}
        />
      </View>
      <MobileControls
        onMoveLeftIn={() => setDirectionPressed("left", true)}
        onMoveLeftOut={() => setDirectionPressed("left", false)}
        onJump={() => {
          if (!isPaused) jump(playerRef.current);
        }}
        onMoveRightIn={() => setDirectionPressed("right", true)}
        onMoveRightOut={() => setDirectionPressed("right", false)}
      />
    </View>
  );
}
