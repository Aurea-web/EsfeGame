import { StyleSheet, ViewStyle } from "react-native";

export const gameScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gameArea: {
    flex: 1,
    minHeight: 0,
  },
  hud: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 80,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    zIndex: 100,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  clockIcon: {
    color: "#EF4444",
    fontSize: 28,
    lineHeight: 32,
  },
  timer: {
    color: "#EF4444",
    fontFamily: "Fredoka",
    fontSize: 24,
    fontWeight: "800",
  },
  concentrationContainer: {
    flex: 1,
    maxWidth: 220,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  concentrationTrack: {
    flex: 1,
    height: 14,
    overflow: "hidden",
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    backgroundColor: "#334155",
  },
  concentrationFill: {
    height: "100%",
    borderRadius: 7,
  },
  concentrationLabel: {
    width: 38,
    fontFamily: "Fredoka",
    fontSize: 12,
    fontWeight: "800",
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
