import Matter from "matter-js";

import Coin from "../entities/Coin";
import Door from "../entities/Door";
import Enemy from "../entities/Enemy";
import Ground from "../entities/Ground";
import Player from "../entities/Player";
import Telefono from "../entities/Telefono";
import { LevelContext, LevelEntities } from "./LevelTypes";

export function createBusLevel({
  engine,
  world,
  player,
  ground,
  worldWidth,
  worldHeight,
  groundY,
}: LevelContext): LevelEntities {
  const platformHeight = 20;
  const platforms = [
    [0.06, 95],
    [0.13, 165],
    [0.20, 210],
    [0.27, 255],
    [0.34, 255],
    [0.43, 300],
    [0.50, 255],
    [0.57, 215],
    [0.64, 260],
    [0.71, 205],
    [0.78, 250],
  ].map(([ratio, heightAboveGround], index) => {
    const isBed = index === 4;
    const platform = Matter.Bodies.rectangle(
      worldWidth * ratio,
      groundY - heightAboveGround,
      isBed ? 100 : 150,
      isBed ? 76 : platformHeight,
      { isStatic: true, restitution: 0 }
    );
    platform.label = isBed ? "enemy" : "platform";
    return { platform, isBed };
  });

  const firstDynamic = Matter.Bodies.rectangle(
    worldWidth * 0.83,
    groundY - 205,
    150,
    platformHeight,
    { isStatic: true, restitution: 0 }
  );
  firstDynamic.label = "platform";

  const phoneRoute = [0.88, 0.94, 0.98].map((ratio, index) =>
    Matter.Bodies.rectangle(
      worldWidth * ratio,
      groundY - [220, 265, 310][index],
      150,
      platformHeight,
      { isStatic: true, restitution: 0 }
    )
  );
  phoneRoute.forEach((platform) => {
    platform.label = "platform";
  });

  const secondDynamic = Matter.Bodies.rectangle(
    worldWidth * 0.955,
    groundY - 205,
    150,
    platformHeight,
    { isStatic: true, restitution: 0 }
  );
  secondDynamic.label = "platform";

  const blockers = [worldWidth * 0.968, worldWidth * 0.982].map((x) => {
    const blocker = Matter.Bodies.rectangle(x, groundY - 44, 62, 88, {
      isStatic: true,
      restitution: 0,
    });
    blocker.label = "enemy";
    return blocker;
  });

  const bedHazards = [
    [0.68, 135, 70],
  ].map(([ratio, minHeight]) => {
    const bed = Matter.Bodies.rectangle(
      worldWidth * ratio,
      groundY - minHeight,
      100,
      76,
      { isStatic: true, restitution: 0 }
    );
    bed.label = "enemy";
    return {
      bed,
      minY: groundY - minHeight - 30,
      maxY: groundY - minHeight + 30,
    };
  });

  const door = Matter.Bodies.rectangle(
    worldWidth * 0.995,
    phoneRoute[2].position.y - 55,
    50,
    80,
    { isStatic: true, isSensor: true }
  );
  door.label = "door";

  const phones = [
    [platforms[8].platform.position.x, platforms[8].platform.position.y],
    [phoneRoute[0].position.x, phoneRoute[0].position.y],
    [phoneRoute[2].position.x, phoneRoute[2].position.y],
    [worldWidth * 0.52, groundY - 175],
    [worldWidth * 0.73, groundY - 145],
  ].map(([x, platformY]) => {
    const phone = Matter.Bodies.rectangle(x, platformY - 55, 48, 48, {
      isStatic: true,
      isSensor: true,
      restitution: 0,
    });
    phone.label = "telefono";
    return phone;
  });

  const coinPositions = [
    [0.06, 170], [0.13, 215], [0.20, 260], [0.27, 305], [0.34, 350],
    [0.43, 175], [0.50, 220], [0.57, 265], [0.64, 310], [0.71, 255],
    [0.78, 300], [0.83, 260], [0.86, 205], [0.88, 270], [0.91, 240],
    [0.94, 340], [0.96, 285], [0.98, 285], [0.991, 190], [0.995, 190],
  ];
  const coins = coinPositions.map(([ratio, heightAboveGround]) => {
    const coin = Matter.Bodies.circle(
      worldWidth * ratio,
      groundY - heightAboveGround,
      10,
      { isStatic: true, isSensor: true }
    );
    coin.label = "coin";
    return coin;
  });

  const sideWalls = [
    Matter.Bodies.rectangle(-20, worldHeight / 2, 40, worldHeight, {
      isStatic: true,
    }),
    Matter.Bodies.rectangle(worldWidth + 20, worldHeight / 2, 40, worldHeight, {
      isStatic: true,
    }),
  ];

  Matter.World.add(world, [
    player,
    ground,
    door,
    ...platforms.map(({ platform }) => platform),
    ...phoneRoute,
    firstDynamic,
    secondDynamic,
    ...blockers,
    ...bedHazards.map(({ bed }) => bed),
    ...phones,
    ...coins,
    ...sideWalls,
  ]);

  const entities: LevelEntities = {
    physics: { engine, world },
    player: { body: player, renderer: Player, facingLeft: false },
    ground: { body: ground, renderer: Ground },
    door: { body: door, renderer: Door },
  };

  platforms.forEach(({ platform, isBed }, index) => {
    entities[isBed ? `enemyBed${index + 1}` : `platform${index + 1}`] = {
      body: platform,
      renderer: isBed ? Enemy : Ground,
      ...(isBed
        ? {
            patrolMinY: platform.position.y - 15,
            patrolMaxY: platform.position.y + 15,
            patrolDirection: 1,
          }
        : {}),
    };
  });

  bedHazards.forEach(({ bed, minY, maxY }, index) => {
    entities[`busBedHazard${index + 1}`] = {
      body: bed,
      renderer: Enemy,
      patrolMinY: minY,
      patrolMaxY: maxY,
      patrolDirection: index % 2 === 0 ? 1 : -1,
      dodgeHeight: 64,
    };
  });

  entities.busDynamic1 = {
    body: firstDynamic,
    renderer: Ground,
    patrolMinY: groundY - 295,
    patrolMaxY: groundY - 205,
    patrolDirection: 1,
  };
  entities.busDynamic2 = {
    body: secondDynamic,
    renderer: Ground,
    patrolMinY: groundY - 295,
    patrolMaxY: groundY - 205,
    patrolDirection: -1,
  };

  phoneRoute.forEach((platform, index) => {
    entities[`phonePlatform${index + 1}`] = {
      body: platform,
      renderer: Ground,
    };
  });
  blockers.forEach((blocker, index) => {
    entities[`busBlocker${index + 1}`] = {
      body: blocker,
      renderer: Ground,
    };
  });
  phones.forEach((phone, index) => {
    entities[`telefono${index + 1}`] = {
      body: phone,
      renderer: Telefono,
      attackRange: worldWidth * (index < 3 ? 0.12 : 0.08),
      shootCooldown: 2200 + index * 650,
      shootingTimer: 0,
      patrolMinY: phone.position.y - 30,
      patrolMaxY: phone.position.y + 30,
      patrolDirection: index % 2 === 0 ? 1 : -1,
    };
  });
  coins.forEach((coin, index) => {
    entities[`busCoin${index + 1}`] = { body: coin, renderer: Coin };
  });

  return entities;
}
