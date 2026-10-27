import { StyleSheet, ViewStyle } from "react-native";

export const gameScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gameArea: {
    flex: 1,
    minHeight: 0,
  },
  engine: {
    flex: 1,
  },
  score: {
    position: "absolute",
    top: 60,
    left: 20,
    fontSize: 20,
    fontWeight: "bold",
    zIndex: 100,
  },
  worldViewport: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "#bae6fd",
  },
  worldContent: {
    position: "absolute",
  },
});

export const getWorldContentStyle = (
  cameraX: number,
  cameraY: number,
  width: number,
  height: number
): ViewStyle => ({
  left: -cameraX,
  top: -cameraY,
  width,
  height,
});
