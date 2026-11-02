import Matter from "matter-js";
import { GameEngine } from "react-native-game-engine";

import { moveLeft, moveRight } from "../services/GameControls";
import CollisionSystem from "../systems/CollisionSystem";
import { gameScreenStyles } from "../styles/GameScreenStyles";
import GameWorldRenderer from "./GameWorldRenderer";

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

          Matter.Engine.update(engine, 16.667);
          return currentEntities;
        },
        CollisionSystem,
      ]}
      onEvent={onEvent}
      entities={entities}
    />
  );
}
