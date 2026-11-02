import { Dimensions } from "react-native";
import Matter from "matter-js";

import Coin from "../entities/Coin";
import Door from "../entities/Door";
import Ground from "../entities/Ground";
import Player from "../entities/Player";

const { width, height } = Dimensions.get("window");
export const worldWidth = Math.max(width * 3, width + 600);
export const worldHeight = Math.max(height * 1.35, 420);
const groundY = worldHeight - 58;

export type GameState = {
  engine: Matter.Engine;
  player: Matter.Body;
  entities: Record<string, any>;
};

export const createGameState = (): GameState => {
  const engine = Matter.Engine.create();
  const world = engine.world;

  const player = Matter.Bodies.rectangle(100, groundY - 59, 58, 58, {
    friction: 0.05,
    frictionAir: 0.005,
    frictionStatic: 0,
    restitution: 0.12,
  });
  player.label = "player";

  const ground = Matter.Bodies.rectangle(
    worldWidth / 2,
    groundY,
    worldWidth,
    58,
    { isStatic: true, restitution: 0.12 }
  );
  const platformPositions = Array.from({ length: 10 }, (_, index) =>
    170 + ((worldWidth - 340) / 9) * index
  );
  const platformHeights = [105, 155, 125, 180, 145, 195, 160, 210, 175, 225];
  const platforms = platformPositions.map((x, index) => {
    const platform = Matter.Bodies.rectangle(
      x,
      groundY - platformHeights[index],
      150,
      20,
      { isStatic: true, restitution: 0.12 }
    );
    const coin = Matter.Bodies.circle(x, platform.position.y - 35, 10, {
      isStatic: true,
      isSensor: true,
    });
    coin.label = "coin";

    return { platform, coin };
  });
  const lastPlatform = platforms[platforms.length - 1].platform;
  const door = Matter.Bodies.rectangle(
    lastPlatform.position.x,
    lastPlatform.position.y - 55,
    50,
    80,
    {
      isStatic: true,
      isSensor: true,
    }
  );
  door.label = "door";

  const sideWalls = [
    Matter.Bodies.rectangle(-20, worldHeight / 2, 40, worldHeight, {
      isStatic: true,
    }),
    Matter.Bodies.rectangle(
      worldWidth + 20,
      worldHeight / 2,
      40,
      worldHeight,
      { isStatic: true }
    ),
  ];

  Matter.World.add(world, [
    player,
    ground,
    door,
    ...sideWalls,
    ...platforms.flatMap(({ platform, coin }) => [platform, coin]),
  ]);

  const entities: Record<string, any> = {
    physics: { engine, world },
    player: { body: player, renderer: Player },
    ground: { body: ground, renderer: Ground },
    door: { body: door, renderer: Door },
  };

  platforms.forEach(({ platform, coin }, index) => {
    entities[`platform${index + 1}`] = {
      body: platform,
      renderer: Ground,
    };
    entities[`coin${index + 1}`] = {
      body: coin,
      renderer: Coin,
    };
  });

  return {
    engine,
    player,
    entities,
  };
};
