import Matter from "matter-js";

const MovementSystem = (entities: any, { touches }: any) => {
  const player = entities.player.body;

  touches
    .filter((t: any) => t.type === "move")
    .forEach((t: any) => {

      if (t.event.pageX < 150) {
        Matter.Body.setVelocity(player, {
          x: -5,
          y: player.velocity.y,
        });
      }

      if (t.event.pageX > 250) {
        Matter.Body.setVelocity(player, {
          x: 5,
          y: player.velocity.y,
        });
      }
    });

  return entities;
};

export default MovementSystem;