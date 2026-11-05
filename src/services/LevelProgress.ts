import AsyncStorage from "@react-native-async-storage/async-storage";

export const LEVELS = [
  "La cama",
  "El autobús",
  "El campus",
  "El aula",
] as const;

const COMPLETED_LEVEL_KEY = "@esfe-game/highest-completed-level";

export async function getHighestCompletedLevel(): Promise<number> {
  const storedProgress = await AsyncStorage.getItem(COMPLETED_LEVEL_KEY);

  if (storedProgress === null) {
    return 0;
  }

  const highestCompletedLevel = Number(storedProgress);
  if (
    !/^(0|[1-9]\d*)$/.test(storedProgress) ||
    !Number.isInteger(highestCompletedLevel) ||
    highestCompletedLevel < 0 ||
    highestCompletedLevel > LEVELS.length
  ) {
    throw new Error("Saved level progress is invalid.");
  }

  return highestCompletedLevel;
}

export async function completeLevel(level: number): Promise<number> {
  if (!Number.isInteger(level) || level < 1 || level > LEVELS.length) {
    throw new Error(`Cannot save completion for level ${level}.`);
  }

  const highestCompletedLevel = await getHighestCompletedLevel();
  if (level <= highestCompletedLevel) {
    return highestCompletedLevel;
  }
  if (level !== highestCompletedLevel + 1) {
    throw new Error("Levels must be completed in order.");
  }

  await AsyncStorage.setItem(COMPLETED_LEVEL_KEY, String(level));
  return level;
}
