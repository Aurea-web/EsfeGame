import Matter from "matter-js";

export const moveLeft = (
  player: Matter.Body
) => {

  Matter.Body.setVelocity(
    player,
    {
      x: -8,
      y: player.velocity.y,
    }
  );

};

export const moveRight = (
  player: Matter.Body
) => {

  Matter.Body.setVelocity(
    player,
    {
      x: 8,
      y: player.velocity.y,
    }
  );

};

export const jump = (
  player: Matter.Body
) => {
  if (Math.abs(player.velocity.y) > 0.75) return;

  Matter.Body.setVelocity(
    player,
    {
      x: player.velocity.x,
      y: -6.5,
    }
  );

};