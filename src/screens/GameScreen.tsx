import { useCallback, useEffect, useRef, useState } from "react";
import { BackHandler, Text, View } from "react-native";
import Matter from "matter-js";
import { useAudioPlayer } from "expo-audio";
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
  const character = route.params?.character === "male" ? "male" : "female";
  const level = route.params?.level ?? 1;
  const levelMusicPlayer = useAudioPlayer(
    require("../../assets/levelbackgroundmusic.mpeg")
  );
  const pauseSoundPlayer = useAudioPlayer(
    require("../../assets/menu_pause .mpeg")
  );
  const coinSoundPlayer = useAudioPlayer(
    require("../../assets/coinpickup.mpeg")
  );
  const walkingSoundPlayer = useAudioPlayer(
    require("../../assets/walking.mpeg")
  );
  const [score, setScore] = useState(0);
  const [game, setGame] = useState(() =>
    createGameState(level)
  );
  const [gameKey, setGameKey] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(120);
  const [health, setHealth] = useState(100);
  const [playerHit, setPlayerHit] = useState(false);
  const { engine, player, entities } = game;
  const playerRef = useRef(player);
  const scoreRef = useRef(0);
  const healthRef = useRef(100);
  const hitFlashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gameEndedRef = useRef(false);
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

  const clearMovement = useCallback(() => {
    pressedDirections.current = { left: false, right: false };
    movementDirectionRef.current = null;
    setMovementDirection(null);
    Matter.Body.setVelocity(playerRef.current, {
      x: 0,
      y: playerRef.current.velocity.y,
    });
  }, []);

  const setDirectionPressed = useCallback((
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
  }, [isPaused]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setDirectionPressed("left", true);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setDirectionPressed("right", true);
      } else if ((event.key === " " || event.key === "ArrowUp") && !event.repeat) {
        event.preventDefault();
        if (!isPaused) jump(playerRef.current);
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setDirectionPressed("left", false);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setDirectionPressed("right", false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isPaused, setDirectionPressed]);

  const pauseGame = () => {
    clearMovement();
    playSound(pauseSoundPlayer);
    setIsPaused(true);
  };

  const restartGame = () => {
    clearMovement();
    const restartedGame = createGameState(level);
    playerRef.current = restartedGame.player;
    setGame(restartedGame);
    setGameKey((key) => key + 1);
    setScore(0);
    scoreRef.current = 0;
    healthRef.current = 100;
    setHealth(100);
    gameEndedRef.current = false;
    setIsPaused(false);
    setRemainingSeconds(120);
  };

  const elapsedRatio = (120 - remainingSeconds) / 120;
  const concentration = Math.max(
    0,
    Math.round(health - elapsedRatio * 100)
  );

  useEffect(() => {
    if (remainingSeconds > 0 || gameEndedRef.current) return;

    gameEndedRef.current = true;
    clearMovement();
    setIsPaused(true);
    navigation.replace("Lose", {
      score: scoreRef.current,
      level,
      character,
    });
  }, [character, clearMovement, level, navigation, remainingSeconds]);

  const handleEvent = (event: { type: string }) => {
    if (event.type === "coin-collected") {
      playSound(coinSoundPlayer);
      scoreRef.current += 10;
      setScore(scoreRef.current);
    }
    if (event.type === "enemy-hit" && !gameEndedRef.current) {
      gameEndedRef.current = true;
      clearMovement();
      setPlayerHit(true);
      healthRef.current = 0;
      setHealth(0);
      hitFlashTimeoutRef.current = setTimeout(() => {
        setPlayerHit(false);
        setIsPaused(true);
        navigation.replace("Lose", {
          score: scoreRef.current,
          level,
          character,
        });
      }, 250);
    }
    if (event.type === "telefono-hit" && !gameEndedRef.current) {
      setPlayerHit(true);
      if (hitFlashTimeoutRef.current) {
        clearTimeout(hitFlashTimeoutRef.current);
      }
      hitFlashTimeoutRef.current = setTimeout(
        () => setPlayerHit(false),
        250
      );
      const nextHealth = Math.max(0, healthRef.current - 10);
      healthRef.current = nextHealth;
      setHealth(nextHealth);

      if (nextHealth === 0) {
        gameEndedRef.current = true;
        clearMovement();
        setIsPaused(true);
        navigation.replace("Lose", {
          score: scoreRef.current,
          level,
          character,
        });
      }
    }
    if (event.type === "win" && !gameEndedRef.current) {
      gameEndedRef.current = true;
      clearMovement();
      setIsPaused(true);
      navigation.replace("Win", {
        score: scoreRef.current,
        concentration,
        level,
        character,
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
          character={character}
          level={level}
          playerHit={playerHit}
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
