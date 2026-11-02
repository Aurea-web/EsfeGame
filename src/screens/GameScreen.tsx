import { useEffect, useRef, useState } from "react";
import { BackHandler, Text, View } from "react-native";
import Matter from "matter-js";
import { LinearGradient } from "expo-linear-gradient";

import GameScene from "../components/GameScene";
import MobileControls from "../components/MobileControls";
import PauseMenu from "../components/PauseMenu";
import ScoreDisplay from "../components/ScoreDisplay";
import { createGameState } from "../services/GameState";
import { jump, moveLeft, moveRight } from "../services/GameControls";
import { gameScreenStyles } from "../styles/GameScreenStyles";

export default function GameScreen({ navigation, route }: any) {
  const [score, setScore] = useState(0);
  const [game, setGame] = useState(() =>
    createGameState(route.params?.level ?? 1)
  );
  const [gameKey, setGameKey] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(120);
  const { engine, player, entities } = game;
  const playerRef = useRef(player);
  const scoreRef = useRef(0);
  const winHandledRef = useRef(false);
  const pressedDirections = useRef({ left: false, right: false });

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.reset({
          index: 0,
          routes: [{ name: "Levels" }],
        });
        return true;
      }
    );

    return () => subscription.remove();
  }, [navigation]);

  useEffect(() => {
    if (isPaused || remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, remainingSeconds]);

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
    const restartedGame = createGameState(route.params?.level ?? 1);
    playerRef.current = restartedGame.player;
    setGame(restartedGame);
    setGameKey((key) => key + 1);
    setScore(0);
    scoreRef.current = 0;
    winHandledRef.current = false;
    setIsPaused(false);
    setRemainingSeconds(120);
  };

  const elapsedRatio = (120 - remainingSeconds) / 120;
  const concentration = Math.max(0, 100 - Math.round(elapsedRatio * 100));

  const handleEvent = (event: { type: string }) => {
    if (event.type === "coin-collected") {
      scoreRef.current += 10;
      setScore(scoreRef.current);
    }
    if (event.type === "win" && !winHandledRef.current) {
      winHandledRef.current = true;
      setIsPaused(true);
      navigation.replace("Win", {
        score: scoreRef.current,
        concentration,
        level: route.params?.level ?? 1,
      });
    }
  };

  const concentrationColor =
    concentration > 60
      ? "#22C55E"
      : concentration > 30
        ? "#FACC15"
        : "#EF4444";
  const timerText = `${Math.floor(remainingSeconds / 60)}:${String(
    remainingSeconds % 60
  ).padStart(2, "0")}`;

  return (
    <View style={gameScreenStyles.container}>
      <View style={gameScreenStyles.gameArea}>
        <View style={gameScreenStyles.hud}>
          <View style={gameScreenStyles.timerContainer}>
            <Text style={gameScreenStyles.clockIcon}>◷</Text>
            <Text style={gameScreenStyles.timer}>{timerText}</Text>
          </View>
          <View style={gameScreenStyles.concentrationContainer}>
            <View style={gameScreenStyles.concentrationTrack}>
              <LinearGradient
                colors={["#22C55E", "#FACC15", "#EF4444"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={[
                  gameScreenStyles.concentrationFill,
                  { width: `${concentration}%` },
                ]}
              />
            </View>
            <Text
              style={[
                gameScreenStyles.concentrationLabel,
                { color: concentrationColor },
              ]}
            >
              {concentration}%
            </Text>
          </View>
        </View>
        <ScoreDisplay score={score} />
        <GameScene
          engine={engine}
          entities={entities}
          gameKey={gameKey}
          isPaused={isPaused}
          getMovementDirection={getMovementDirection}
          onEvent={handleEvent}
          level={route.params?.level ?? 1}
        />
        <PauseMenu
          isPaused={isPaused}
          onPause={pauseGame}
          onResume={() => setIsPaused(false)}
          onExit={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: "Levels" }],
            })
          }
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
