import { StyleSheet } from "react-native";

export const mobileControlsStyles = StyleSheet.create({
  container: {
    height: 128,
    flexShrink: 0,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#e0f2fe",
    borderTopWidth: 1,
    borderTopColor: "#7dd3fc",
    zIndex: 1,
  },
  button: {
    minWidth: 56,
    minHeight: 48,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2563eb",
    borderRadius: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "bold",
  },
  pressedButton: {
    opacity: 0.75,
  },
});
