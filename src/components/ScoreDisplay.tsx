import { Text } from "react-native";

import { gameScreenStyles } from "../styles/GameScreenStyles";

type ScoreDisplayProps = {
  score: number;
};

export default function ScoreDisplay({ score }: ScoreDisplayProps) {
  return <Text style={gameScreenStyles.score}>Puntos: {score}</Text>;
}
