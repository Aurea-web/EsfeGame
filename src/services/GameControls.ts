import Matter from "matter-js";

export const moveLeft = (
  player: Matter.Body
) => {

  Matter.Body.setVelocity(
    player,
    {
      x: -5,
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
      x: 5,
      y: player.velocity.y,
    }
  );

};

export const jump = (
  player: Matter.Body
) => {

  Matter.Body.setVelocity(
    player,
    {
      x: player.velocity.x,
      y: -10,
    }
  );

};