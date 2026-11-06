import { Text, View } from "react-native";

import { gameScreenStyles } from "../styles/GameScreenStyles";

type ScoreDisplayProps = {
  score: number;
};

export default function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <View style={gameScreenStyles.scoreContainer}>
      <Text style={gameScreenStyles.scoreLabel}>Puntos</Text>
      <Text style={gameScreenStyles.scoreValue}>{score}</Text>
    </View>
  );
}
