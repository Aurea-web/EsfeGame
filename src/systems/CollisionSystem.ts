// src/systems/CollisionSystem.ts
import Matter from "matter-js";
import { setGroundContact } from "../services/GameControls";

const initializedEngines = new WeakSet<Matter.Engine>();

const updateGroundContacts = (
  pairs: Matter.Pair[],
  isTouching: boolean
) => {
  pairs.forEach((pair) => {
    const player =
      pair.bodyA.label === "player"
        ? pair.bodyA
        : pair.bodyB.label === "player"
          ? pair.bodyB
          : null;
    if (!player) return;

    const surface = player === pair.bodyA ? pair.bodyB : pair.bodyA;
    if (surface.label !== "ground" && surface.label !== "platform") return;

    if (
      surface.label === "platform" &&
      player.velocity.y < 0 &&
      player.position.y > surface.position.y
    ) {
      pair.isSensor = true;
      return;
    }

    if (pair.isSensor) return;

    const normalY =
      player === pair.bodyA
        ? pair.collision.normal.y
        : -pair.collision.normal.y;

    if (normalY < -0.5) {
      setGroundContact(player, pair.id, isTouching);
    }
  });
};

const CollisionSystem = (
  entities: any,
  { dispatch }: any
) => {
  const engine = entities?.physics?.engine;
  const world = engine?.world;

  if (!engine || !world) return entities;

  if (!initializedEngines.has(engine)) {
    Matter.Events.on(
      engine,
      "collisionStart",
      (event) => {
        updateGroundContacts(
          (event as Matter.IEventCollision<Matter.Engine>).pairs,
          true
        );
      }
    );
    Matter.Events.on(
      engine,
      "collisionEnd",
      (event) => {
        updateGroundContacts(
          (event as Matter.IEventCollision<Matter.Engine>).pairs,
          false
        );
      }
    );
    Matter.Events.on(
      engine,
      "collisionStart",
      (event) => {
        (event as Matter.IEventCollision<Matter.Engine>).pairs.forEach((pair) => {
          const bodyA = pair.bodyA;
          const bodyB = pair.bodyB;
          const labels = [bodyA.label, bodyB.label];

          // Colisión con monedas / ítems
          if (
            labels.includes("player") &&
            labels.includes("coin")
          ) {
            // Identificar cuál de los dos cuerpos es la moneda
            const coinBody = bodyA.label === "coin" ? bodyA : bodyB;

            coinBody.label = "collected";
            coinBody.collisionFilter.mask = 0;

            dispatch({
              type: "coin-collected",
            });
          }

          // Colisión con la puerta (Meta / Victoria)
          if (
            labels.includes("player") &&
            labels.includes("door")
          ) {
            dispatch({
              type: "win",
            });
          }

          if (
            labels.includes("player") &&
            labels.includes("enemy")
          ) {
            dispatch({
              type: "enemy-hit",
            });
          }
        });
      }
    );

    initializedEngines.add(engine);
  }

  return entities;
};

export default CollisionSystem;