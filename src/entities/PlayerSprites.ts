import { ImageSourcePropType } from "react-native";

export type PlayerCharacter = "male" | "female";

type PlayerSpriteSet = {
  idle: ImageSourcePropType;
  walkRight: ImageSourcePropType;
  walkLeft: ImageSourcePropType;
  jumpRight: ImageSourcePropType;
  jumpLeft: ImageSourcePropType;
  preview: ImageSourcePropType;
  idleFrameCount: number;
  walkFrameCount: number;
  jumpFrameCount: number;
};

export const playerSprites: Record<PlayerCharacter, PlayerSpriteSet> = {
  male: {
    idle: require("../../assets/Male_Idle.png"),
    walkRight: require("../../assets/Male_Walk.png"),
    walkLeft: require("../../assets/Male_Walk_izquierda.png"),
    jumpRight: require("../../assets/Male_Jump_Derecha.png"),
    jumpLeft: require("../../assets/Male_Jump_Izquierda.png"),
    preview: require("../../assets/Male_Idle.png"),
    idleFrameCount: 1,
    walkFrameCount: 12,
    jumpFrameCount: 12,
  },
  female: {
    idle: require("../../assets/Idle.png"),
    walkRight: require("../../assets/Walk.png"),
    walkLeft: require("../../assets/Walk_izquierda.png"),
    jumpRight: require("../../assets/Salto_Femenino_Derecha.png"),
    jumpLeft: require("../../assets/Salto_Femenino_Izquierda.png"),
    preview: require("../../assets/Female_Idle.png"),
    idleFrameCount: 9,
    walkFrameCount: 12,
    jumpFrameCount: 12,
  },
};
