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
  scoreContainer: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 100,
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FFE931",
    backgroundColor: "rgba(9, 6, 36, 0.78)",
  },
  scoreLabel: {
    color: "#FFE931",
    fontFamily: "PixelifySans",
    fontSize: 22,
    fontWeight: "800",
    textShadowColor: "#B33A0D",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  scoreValue: {
    color: "#FFE931",
    fontFamily: "PixelifySans",
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "900",
    textShadowColor: "#B33A0D",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 5,
  },
  worldViewport: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "#090D1D",
  },
  levelBackground: {
    position: "absolute",
    width: "100%",
    height: "120%",
    bottom: 0,
    overflow: "hidden",
  },
  levelBackgroundImage: {
    width: "100%",
    height: "100%",
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
