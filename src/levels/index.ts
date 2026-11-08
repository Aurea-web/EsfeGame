import { createBusLevel } from "./level2Bus";
import { LevelContext, LevelEntities } from "./LevelTypes";

type LevelFactory = (context: LevelContext) => LevelEntities;

export const LEVEL_FACTORIES: Record<number, LevelFactory> = {
  2: createBusLevel,
};

export function createLevelEntities(
  level: number,
  context: LevelContext
): LevelEntities | null {
  return LEVEL_FACTORIES[level]?.(context) ?? null;
}
