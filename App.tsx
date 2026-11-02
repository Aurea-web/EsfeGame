import { useFonts } from "expo-font";
import { useEffect } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import Navigation from "./src/navigation";

export default function App() {
  const [fontsLoaded] = useFonts({
    PixelifySans: require("./assets/fonts/PixelifySans.ttf"),
    Fredoka: require("./assets/fonts/Fredoka.ttf"),
  });

  useEffect(() => {
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE
    );
  }, []);

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar hidden />
      <Navigation />
    </>
  );
}
