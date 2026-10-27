import { ImageStyle, StyleSheet, ViewStyle } from "react-native";

export const playerFrameSize = 80;

export const playerStyles = StyleSheet.create({
  container: {
    position: "absolute",
    width: playerFrameSize,
    height: playerFrameSize,
  },
  spriteViewport: {
    position: "absolute",
    top: 0,
    left: 0,
    width: playerFrameSize,
    height: playerFrameSize,
    overflow: "hidden",
  },
  spriteSheet: {
    position: "absolute",
    top: 0,
    left: 0,
    height: playerFrameSize,
  },
  speechBubble: {
    position: "absolute",
    left: (playerFrameSize - 152) / 2,
    bottom: playerFrameSize + 4,
    width: 152,
    paddingHorizontal: 10,
    paddingVertical: 7,
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    elevation: 3,
    zIndex: 1,
  },
  speechText: {
    color: "#0f172a",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  speechTail: {
    position: "absolute",
    bottom: -7,
    width: 12,
    height: 12,
    backgroundColor: "#ffffff",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#cbd5e1",
    transform: [{ rotate: "45deg" }],
  },
});

export const getSpriteSheetStyle = (
  frame: number,
  frameCount: number
): ImageStyle => ({
  width: playerFrameSize * frameCount,
  transform: [{ translateX: -playerFrameSize * frame }],
});

export const getPlayerPositionStyle = (left: number, top: number): ViewStyle => ({
  left,
  top,
});
