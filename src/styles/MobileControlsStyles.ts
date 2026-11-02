import { StyleSheet } from "react-native";

export const mobileControlsStyles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    height: 76,
    flexShrink: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 120,
    pointerEvents: "box-none",
  },
  movementControls: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    width: 70,
    height: 70,
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(37,99,235,0.18)",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "rgba(125,211,252,0.72)",
    shadowColor: "#00CFFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 8,
  },
  gradientButton: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
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
