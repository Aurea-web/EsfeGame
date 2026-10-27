import { StyleSheet } from "react-native";

export const pauseMenuStyles = StyleSheet.create({
  pauseButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    elevation: 4,
    zIndex: 2,
  },
  pressedPauseButton: {
    opacity: 0.75,
  },
  pauseIcon: {
    flexDirection: "row",
    gap: 5,
  },
  pauseBar: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: "#0f172a",
  },
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    zIndex: 3,
  },
  menu: {
    width: "100%",
    maxWidth: 320,
    padding: 24,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    gap: 12,
  },
  title: {
    marginBottom: 8,
    color: "#0f172a",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  action: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  resumeAction: {
    backgroundColor: "#16a34a",
  },
  exitAction: {
    backgroundColor: "#dc2626",
  },
  restartAction: {
    backgroundColor: "#2563eb",
  },
  pressedAction: {
    opacity: 0.8,
  },
  actionText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
