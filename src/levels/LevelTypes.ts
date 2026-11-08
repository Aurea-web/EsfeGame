import Matter from "matter-js";

export type LevelEntities = Record<string, any>;

export type LevelContext = {
  engine: Matter.Engine;
  world: Matter.World;
  player: Matter.Body;
  ground: Matter.Body;
  worldWidth: number;
  worldHeight: number;
  groundY: number;
};

