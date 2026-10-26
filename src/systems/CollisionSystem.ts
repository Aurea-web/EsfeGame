// src/systems/CollisionSystem.ts
import Matter from "matter-js";

const initializedEngines = new WeakSet<Matter.Engine>();

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
        });
      }
    );

    initializedEngines.add(engine);
  }

  return entities;
};

export default CollisionSystem;