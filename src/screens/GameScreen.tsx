
import { useState, useRef } from "react";
import { Dimensions, View, Button, Text } from "react-native";
import Matter from "matter-js";
import { GameEngine } from "react-native-game-engine";

import Player from "../entities/Player";
import Ground from "../entities/Ground";
import Coin from "../entities/Coin";
import Door from "../entities/Door";
import CollisionSystem from "../systems/CollisionSystem"; // Asegúrate de que la ruta sea correcta

import { moveLeft, moveRight, jump } from "../services/GameControls";

const { width, height } = Dimensions.get("window");

export default function GameScreen() {
  const [score, setScore] = useState(0);

  const [game] = useState(() => {
    const engine = Matter.Engine.create();
    const world = engine.world;

    const player = Matter.Bodies.rectangle(100, 100, 40, 40);
    player.label = "player";

    const ground = Matter.Bodies.rectangle(
      width / 2,
      height - 50,
      width,
      50,
      { isStatic: true }
    );
    const platform1 = Matter.Bodies.rectangle(
      150,
      height - 180,
      120,
      20,
      { isStatic: true }
    );
    const platform2 = Matter.Bodies.rectangle(
      320,
      height - 300,
      120,
      20,
      { isStatic: true }
    );
    const coin1 = Matter.Bodies.circle(150, height - 220, 10, {
      isStatic: true,
      isSensor: true,
    });
    coin1.label = "coin";

    const coin2 = Matter.Bodies.circle(320, height - 340, 10, {
      isStatic: true,
      isSensor: true,
    });
    coin2.label = "coin";

    const door = Matter.Bodies.rectangle(
      width - 80,
      height - 100,
      50,
      80,
      {
        isStatic: true,
        isSensor: true,
      }
    );
    door.label = "door";

    Matter.World.add(world, [
      player,
      ground,
      platform1,
      platform2,
      coin1,
      coin2,
      door,
    ]);

    return {
      engine,
      world,
      player,
      ground,
      platform1,
      platform2,
      coin1,
      coin2,
      door,
    };
  });
  const {
    engine,
    world,
    player,
    ground,
    platform1,
    platform2,
    coin1,
    coin2,
    door,
  } = game;
  const playerRef = useRef(player);

  return (
    <View style={{ flex: 1 }}>
      {/* Contador de Puntos en pantalla */}
      <Text
        style={{
          position: "absolute",
          top: 60,
          left: 20,
          fontSize: 20,
          fontWeight: "bold",
          zIndex: 100,
        }}
      >
        Puntos: {score}
      </Text>

      <GameEngine
        style={{ flex: 1 }}
        systems={[
          // Sistema físico del motor
          (entities: any, { time }: any) => {
            Matter.Engine.update(
              engine,
              time.delta
            );
            return entities;
          },
          // Sistema de colisiones que despacha los eventos
          CollisionSystem,
        ]}
        onEvent={(event: { type: string; }) => {
          if (event.type === "coin-collected") {
            setScore((prevScore) => prevScore + 10);
          }
          if (event.type === "win") {
            alert("Nivel completado");
          }
        }}
        entities={{
          physics: { engine, world },
          player: {
            body: player,
            renderer: Player,
          },
          ground: {
            body: ground,
            renderer: Ground,
          },
          platform1: {
            body: platform1,
            renderer: Ground,
          },
          platform2: {
            body: platform2,
            renderer: Ground,
          },
          coin1: {
            body: coin1,
            renderer: Coin,
          },
          coin2: {
            body: coin2,
            renderer: Coin,
          },
          door: {
            body: door,
            renderer: Door,
          },
        }}
      />

      {/* Controles de movimiento */}
      <View
        style={{
          position: "absolute",
          bottom: 60,
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <Button
          title="←"
          onPress={() => moveLeft(playerRef.current)}
        />
        <Button
          title="↑"
          onPress={() => jump(playerRef.current)}
        />
        <Button
          title="→"
          onPress={() => moveRight(playerRef.current)}
        />
      </View>
    </View>
  );
}
