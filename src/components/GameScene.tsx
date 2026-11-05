import Matter from "matter-js";
import { GameEngine } from "react-native-game-engine";

import { moveLeft, moveRight } from "../services/GameControls";
import CollisionSystem from "../systems/CollisionSystem";
import { gameScreenStyles } from "../styles/GameScreenStyles";
import GameWorldRenderer from "./GameWorldRenderer";

const MAX_PHYSICS_STEP_MS = 16.6;
const ENEMY_FLOAT_SPEED = 75;

type MovementDirection = "left" | "right" | null;

type GameSceneProps = {
  engine: Matter.Engine;
  entities: Record<string, any>;
  gameKey: number;
  isPaused: boolean;
  getMovementDirection: () => MovementDirection;
  onEvent: (event: { type: string }) => void;
  level?: number;
};

export default function GameScene({
  engine,
  entities,
  gameKey,
  isPaused,
  getMovementDirection,
  onEvent,
  level = 1,
}: GameSceneProps) {
  return (
    <GameEngine
      key={gameKey}
      style={gameScreenStyles.engine}
      running={!isPaused}
      renderer={(entities: Record<string, any>, screen: any, layout: any) =>
        GameWorldRenderer(entities, screen, layout, level)
      }
      systems={[
        (currentEntities: any, { time }: any) => {
          const player = currentEntities.player?.body as Matter.Body | undefined;
          const direction = getMovementDirection();

          if (player && direction === "left") {
            moveLeft(player);
          } else if (player && direction === "right") {
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

            const distance =
              (ENEMY_FLOAT_SPEED * delta) / 1000 * enemy.patrolDirection;
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
      entities={entities}
    />
  );
}
