import { Dimensions } from "react-native";
import Matter from "matter-js";

import Coin from "../entities/Coin";
import Door from "../entities/Door";
import Enemy from "../entities/Enemy";
import Ground from "../entities/Ground";
import Player from "../entities/Player";

const { width, height } = Dimensions.get("window");
export const worldWidth = Math.max(width * 3, width + 600);
export const worldHeight = Math.max(height * 1.35, 420);
const groundY = worldHeight - 58;
const enemyPlatformIndexes = new Set([1, 4, 7]);
const enemyPatrolDistance = 40;
const maxPlatformGap = 160;
const maxPlatformHeightStep = 40;

export type GameState = {
  engine: Matter.Engine;
  player: Matter.Body;
  entities: Record<string, any>;
};

export const createGameState = (level = 1): GameState => {
  const engine = Matter.Engine.create();
  const world = engine.world;
  engine.gravity.y = 1.5;
  engine.gravity.scale = 0.001;

  const player = Matter.Bodies.rectangle(100, groundY - 59, 58, 58, {
    friction: 0.05,
    frictionAir: 0.005,
    frictionStatic: 0,
    restitution: 0,
  });
  player.label = "player";

  const ground = Matter.Bodies.rectangle(
    worldWidth / 2,
    groundY,
    worldWidth,
    58,
    { isStatic: true, restitution: 0 }
  );
  ground.label = "ground";
  const platformPositions = Array.from({ length: 10 }, (_, index) =>
    170 + ((worldWidth - 340) / 9) * index
  );
  const platformHeights = [105, 155, 125, 180, 145, 195, 160, 210, 175, 225];
  const platforms = platformPositions.map((x, index) => {
    const isEnemyBed = enemyPlatformIndexes.has(index);
    const platform = Matter.Bodies.rectangle(
      x,
      groundY - platformHeights[index],
      isEnemyBed ? 90 : 150,
      isEnemyBed ? 64 : 20,
      { isStatic: true, restitution: 0 }
    );
    platform.label = isEnemyBed ? "enemy" : "platform";
    const coin = Matter.Bodies.circle(x, platform.position.y - 35, 10, {
      isStatic: true,
      isSensor: true,
    });
    coin.label = "coin";

    return { platform, coin, isEnemyBed };
  });
  const createAccessPlatforms = (
    startX: number,
    endX: number,
    startTopHeight: number,
    endTopHeight: number
  ) => {
    const segmentLength = endX - startX;
    const stepCount = Math.max(
      Math.ceil(segmentLength / maxPlatformGap),
      Math.ceil(Math.abs(endTopHeight - startTopHeight) / maxPlatformHeightStep)
    );

    return Array.from({ length: stepCount - 1 }, (_, stepIndex) => {
      const progress = (stepIndex + 1) / stepCount;
      const platform = Matter.Bodies.rectangle(
        startX + segmentLength * progress,
        groundY -
          (startTopHeight +
            (endTopHeight - startTopHeight) * progress -
            10),
        130,
        20,
        { isStatic: true, restitution: 0 }
      );
      platform.label = "platform";
      return { platform };
    });
  };
  const accessPlatforms = platformPositions
    .slice(1)
    .flatMap((x, segmentIndex) => {
      const previousIndex = segmentIndex;
      const previousTopHeight =
        platformHeights[previousIndex] +
        (enemyPlatformIndexes.has(previousIndex) ? 32 : 10);
      const nextTopHeight =
        platformHeights[previousIndex + 1] +
        (enemyPlatformIndexes.has(previousIndex + 1) ? 32 : 10);

      return createAccessPlatforms(
        platformPositions[previousIndex],
        x,
        previousTopHeight,
        nextTopHeight
      );
    });

  const parkourPlatforms =
    level === 1
      ? [
          { x: worldWidth * 0.43, heightAboveGround: 70, width: 110 },
          { x: worldWidth * 0.49, heightAboveGround: 115, width: 110 },
          { x: worldWidth * 0.55, heightAboveGround: 160, width: 110 },
          { x: worldWidth * 0.61, heightAboveGround: 205, width: 110 },
          { x: worldWidth * 0.67, heightAboveGround: 250, width: 110 },
          { x: worldWidth * 0.73, heightAboveGround: 295, width: 110 },
        ].map(({ x, heightAboveGround, width: platformWidth }, index) => {
          const platform = Matter.Bodies.rectangle(
            x,
            groundY - heightAboveGround,
            platformWidth,
            20,
            { isStatic: true, restitution: 0 }
          );
          platform.label = "platform";
          const coin = Matter.Bodies.circle(x, platform.position.y - 38, 10, {
            isStatic: true,
            isSensor: true,
          });
          coin.label = "coin";
          return { platform, coin, index };
        })
      : [];
  const parkourAccessPlatforms = parkourPlatforms
    .slice(1)
    .flatMap(({ platform }, index) => {
      const previousPlatform = parkourPlatforms[index].platform;

      return createAccessPlatforms(
        previousPlatform.position.x,
        platform.position.x,
        groundY - previousPlatform.bounds.min.y,
        groundY - platform.bounds.min.y
      );
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
    ...accessPlatforms.map(({ platform }) => platform),
    ...parkourAccessPlatforms.map(({ platform }) => platform),
    ...parkourPlatforms.map(({ platform }) => platform),
    ...parkourPlatforms.map(({ coin }) => coin),
    ...sideWalls,
    ...platforms.flatMap(({ platform, coin }) => [platform, coin]),
  ]);

  const entities: Record<string, any> = {
    physics: { engine, world },
    player: { body: player, renderer: Player },
    ground: { body: ground, renderer: Ground },
    door: { body: door, renderer: Door },
  };

  platforms.forEach(({ platform, coin, isEnemyBed }, index) => {
    if (isEnemyBed) {
      entities[`enemy${index + 1}`] = {
        body: platform,
        renderer: Enemy,
        patrolMinY: platform.position.y - enemyPatrolDistance,
        patrolMaxY: platform.position.y + enemyPatrolDistance,
        patrolDirection: 1,
      };
    } else {
      entities[`platform${index + 1}`] = {
        body: platform,
        renderer: Ground,
      };
    }
    entities[`coin${index + 1}`] = {
      body: coin,
      renderer: Coin,
    };
  });

  accessPlatforms.forEach(({ platform }, index) => {
    entities[`accessPlatform${index + 1}`] = {
      body: platform,
      renderer: Ground,
    };
  });

  parkourAccessPlatforms.forEach(({ platform }, index) => {
    entities[`parkourAccessPlatform${index + 1}`] = {
      body: platform,
      renderer: Ground,
    };
  });

  parkourPlatforms.forEach(({ platform, coin, index }) => {
    entities[`parkourPlatform${index + 1}`] = {
      body: platform,
      renderer: Ground,
    };
    entities[`parkourCoin${index + 1}`] = {
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
