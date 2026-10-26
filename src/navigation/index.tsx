import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import LevelScreen from "../screens/LevelScreen";
import GameScreen from "../screens/GameScreen";
import WinScreen from "../screens/WinScreen";
import LoseScreen from "../screens/LoseScreen";

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />

        <Stack.Screen
          name="Levels"
          component={LevelScreen}
        />

        <Stack.Screen
          name="Game"
          component={GameScreen}
        />

        <Stack.Screen
          name="Win"
          component={WinScreen}
        />

        <Stack.Screen
          name="Lose"
          component={LoseScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
