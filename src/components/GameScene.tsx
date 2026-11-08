import Matter from "matter-js";
import { GameEngine } from "react-native-game-engine";

import { moveLeft, moveRight } from "../services/GameControls";
import CollisionSystem from "../systems/CollisionSystem";
import { PlayerCharacter } from "../entities/PlayerSprites";
import { gameScreenStyles } from "../styles/GameScreenStyles";
import GameWorldRenderer from "./GameWorldRenderer";
import RayoRojo from "../entities/RayoRojo";

const MAX_PHYSICS_STEP_MS = 16.6;
const ENEMY_FLOAT_SPEED = 75;
const PHONE_SHOOT_INTERVAL = 3200;
const PHONE_PROJECTILE_SPEED = 54;
const PHONE_SHOOT_ANIMATION_MS = 300;

type MovementDirection = "left" | "right" | null;

type GameSceneProps = {
  engine: Matter.Engine;
  entities: Record<string, any>;
  gameKey: number;
  isPaused: boolean;
  getMovementDirection: () => MovementDirection;
  onEvent: (event: { type: string }) => void;
  character?: PlayerCharacter;
  level?: number;
  playerHit?: boolean;
};

export default function GameScene({
  engine,
  entities,
  gameKey,
  isPaused,
  getMovementDirection,
  onEvent,
  character = "female",
  level = 1,
  playerHit = false,
}: GameSceneProps) {
  return (
    <GameEngine
      key={gameKey}
      style={gameScreenStyles.engine}
      running={!isPaused}
      entities={{
        ...entities,
        player: {
          ...entities.player,
          isHit: playerHit,
        },
      }}
      renderer={(entities: Record<string, any>, screen: any, layout: any) =>
        GameWorldRenderer(entities, screen, layout, level, character)
      }
      systems={[
        (currentEntities: any, { time }: any) => {
          const playerEntity = currentEntities.player;
          const player = playerEntity?.body as Matter.Body | undefined;
          const direction = getMovementDirection();

          if (player && direction === "left") {
            playerEntity.facingLeft = true;
            moveLeft(player);
          } else if (player && direction === "right") {
            playerEntity.facingLeft = false;
            moveRight(player);
          } else if (player) {
            Matter.Body.setVelocity(player, {
              x: 0,
              y: player.velocity.y,
            });
          }

          const delta = Math.min(
            Math.max(time.delta || MAX_PHYSICS_STEP_MS, 1),
            MAX_PHYSICS_STEP_MS
          );
          Object.values(currentEntities).forEach((enemy: any) => {
            if (!enemy?.body || typeof enemy.patrolDirection !== "number") {
              return;
            }

            if (enemy.patrolDirection === 0) {
              return;
            }

            const patrolSpeed =
              typeof enemy.patrolSpeed === "number"
                ? enemy.patrolSpeed
                : ENEMY_FLOAT_SPEED;
            const distance =
              (patrolSpeed * delta) / 1000 * enemy.patrolDirection;
            let nextY = enemy.body.position.y + distance;

            if (nextY <= enemy.patrolMinY) {
              nextY = enemy.patrolMinY;
              enemy.patrolDirection = 1;
            } else if (nextY >= enemy.patrolMaxY) {
              nextY = enemy.patrolMaxY;
              enemy.patrolDirection = -1;
            }

            Matter.Body.setPosition(enemy.body, {
              x: enemy.body.position.x,
              y: nextY,
            });

            if (typeof enemy.shootCooldown === "number") {
              enemy.shootCooldown -= delta;
              enemy.shootingTimer = Math.max(
                (enemy.shootingTimer || 0) - delta,
                0
              );
              enemy.isShooting = enemy.shootingTimer > 0;

              const horizontalDistance = player
                ? Math.abs(player.position.x - enemy.body.position.x)
                : Infinity;
              const attackRange =
                typeof enemy.attackRange === "number"
                  ? enemy.attackRange
                  : Infinity;

              if (
                enemy.shootCooldown <= 0 &&
                player &&
                horizontalDistance <= attackRange
              ) {
                const shotDirection =
                  player.position.x >= enemy.body.position.x ? 1 : -1;
                const projectileId =
                  `telefonoProjectile${Date.now()}${Math.random()}`;
                const projectile = Matter.Bodies.rectangle(
                  enemy.body.position.x + shotDirection * 28,
                  enemy.body.position.y,
                  70,
                  8,
                  { isSensor: true, restitution: 0 }
                );
                projectile.label = "telefono-projectile";
                Matter.Body.setVelocity(projectile, {
                  x: shotDirection * PHONE_PROJECTILE_SPEED,
                  y: 0,
                });
                Matter.World.add(engine.world, projectile);
                currentEntities[projectileId] = {
                  body: projectile,
                  renderer: RayoRojo,
                  lifetime: 7000,
                };
                enemy.shootingTimer = PHONE_SHOOT_ANIMATION_MS;
                enemy.isShooting = true;
                enemy.shootCooldown = PHONE_SHOOT_INTERVAL;
              }
            }
          });

          Object.entries(currentEntities).forEach(([key, entity]: any) => {
            if (typeof entity.lifetime !== "number") return;
            entity.lifetime -= delta;
            if (
              entity.lifetime <= 0 ||
              entity.body.label === "collected"
            ) {
              Matter.World.remove(engine.world, entity.body);
              delete currentEntities[key];
            }
          });

          Matter.Engine.update(
            engine,
            delta
          );
          return currentEntities;
        },
        CollisionSystem,
      ]}
      onEvent={onEvent}
    />
  );
}
