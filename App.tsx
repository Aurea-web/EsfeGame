import { useFonts } from "expo-font";
import { useEffect } from "react";
import { setAudioModeAsync } from "expo-audio";
import * as ScreenOrientation from "expo-screen-orientation";
import { NavigationBar } from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import { AppState, Platform } from "react-native";
import Navigation from "./src/navigation";

export default function App() {
  const [fontsLoaded] = useFonts({
    PixelifySans: require("./assets/fonts/PixelifySans.ttf"),
    Fredoka: require("./assets/fonts/Fredoka.ttf"),
  });

  useEffect(() => {
    if (Platform.OS === "web") return;

    void ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE
    ).catch(() => {
      console.warn("No se pudo bloquear la orientación horizontal.");
    });
  }, []);

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const hideNavigationBar = () => NavigationBar.setHidden(true);
    hideNavigationBar();
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") hideNavigationBar();
    });

    return () => {
      subscription.remove();
      NavigationBar.setHidden(false);
    };
  }, []);

  useEffect(() => {
    void setAudioModeAsync({ playsInSilentMode: true }).catch((error: unknown) => {
      console.warn("No se pudo configurar el audio del juego.", error);
    });
  }, []);

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar hidden />
      <Navigation />
    </>
  );
}
