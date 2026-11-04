import { useCallback, useEffect, useRef, useState } from "react";
import { BackHandler, Platform, Text, View } from "react-native";
import Matter from "matter-js";
import { useFocusEffect } from "@react-navigation/native";
import { useAudioPlayer } from "expo-audio";
import { NavigationBar } from "expo-navigation-bar";
import { LinearGradient } from "expo-linear-gradient";

import GameScene from "../components/GameScene";
import MobileControls from "../components/MobileControls";
import PauseMenu from "../components/PauseMenu";
import ScoreDisplay from "../components/ScoreDisplay";
import { createGameState } from "../services/GameState";
import { jump, moveLeft, moveRight } from "../services/GameControls";
import { gameScreenStyles } from "../styles/GameScreenStyles";

type MovementDirection = "left" | "right" | null;

export default function GameScreen({ navigation, route }: any) {
  const levelMusicPlayer = useAudioPlayer(
    require("../../levelbackgroundmusic.mpeg")
  );
  const pauseSoundPlayer = useAudioPlayer(require("../../menu_pause .mpeg"));
  const coinSoundPlayer = useAudioPlayer(require("../../coinpickup.mpeg"));
  const walkingSoundPlayer = useAudioPlayer(require("../../walking.mpeg"));
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
  const movementDirectionRef = useRef<MovementDirection>(null);
  const [movementDirection, setMovementDirection] =
    useState<MovementDirection>(null);

  const playSound = (soundPlayer: ReturnType<typeof useAudioPlayer>) => {
    void soundPlayer
      .seekTo(0)
      .then(() => soundPlayer.play())
      .catch((error: unknown) => {
        console.warn("Unable to play a game sound.", error);
      });
  };

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== "android") return;

      NavigationBar.setHidden(true);
      return () => NavigationBar.setHidden(false);
    }, [])
  );

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

  useEffect(() => {
    // AudioPlayer.loop is a mutable playback setting exposed by expo-audio.
    // eslint-disable-next-line react-hooks/immutability
    levelMusicPlayer.loop = true;
    if (isPaused) {
      levelMusicPlayer.pause();
    } else {
      levelMusicPlayer.play();
    }

    return () => levelMusicPlayer.pause();
  }, [isPaused, levelMusicPlayer]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    walkingSoundPlayer.loop = true;
    if (movementDirection && !isPaused) {
      walkingSoundPlayer.play();
    } else {
      walkingSoundPlayer.pause();
    }
  }, [isPaused, movementDirection, walkingSoundPlayer]);

  const clearMovement = () => {
    pressedDirections.current = { left: false, right: false };
    movementDirectionRef.current = null;
    setMovementDirection(null);
    Matter.Body.setVelocity(playerRef.current, {
      x: 0,
      y: playerRef.current.velocity.y,
    });
  };

  const setDirectionPressed = (
    direction: "left" | "right",
    isPressed: boolean
  ) => {
    if (isPaused) return;

    pressedDirections.current[direction] = isPressed;

    if (isPressed) {
      movementDirectionRef.current = direction;
    } else if (movementDirectionRef.current === direction) {
      movementDirectionRef.current = pressedDirections.current.left
        ? "left"
        : pressedDirections.current.right
          ? "right"
          : null;
    }

    const nextDirection = movementDirectionRef.current;
    setMovementDirection(nextDirection);

    if (nextDirection === "left") {
      moveLeft(playerRef.current);
    } else if (nextDirection === "right") {
      moveRight(playerRef.current);
    } else {
      Matter.Body.setVelocity(playerRef.current, {
        x: 0,
        y: playerRef.current.velocity.y,
      });
    }
  };

  const pauseGame = () => {
    clearMovement();
    playSound(pauseSoundPlayer);
    setIsPaused(true);
  };

  const restartGame = () => {
    clearMovement();
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
      playSound(coinSoundPlayer);
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
          getMovementDirection={() => movementDirectionRef.current}
          onEvent={handleEvent}
          level={route.params?.level ?? 1}
        />
        <PauseMenu
          isPaused={isPaused}
          onPause={pauseGame}
          onResume={() => {
            playSound(pauseSoundPlayer);
            setIsPaused(false);
          }}
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
