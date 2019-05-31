import dw4Characters from "../../images/dw4-character-sprites.png";
import { SpriteDefinition, useSpritelookup } from "../canvas";

const dw4HeroY = 2;
const dw4FemSoldierY = 38;
const dw4Columns = {
    Up: [ 20, 38 ],
    Down: [ 56, 74 ],
    Right: [ 92, 110 ],
    Left: [ 128, 146 ]
}

const avatarSpriteDefinitions: SpriteDefinition<string>[] = [
    { image: dw4Characters, coords: { y: dw4HeroY, x: dw4Columns.Up[0] }, key: "Up0" },
    { image: dw4Characters, coords: { y: dw4HeroY, x: dw4Columns.Up[1] }, key: "Up1" },
    { image: dw4Characters, coords: { y: dw4HeroY, x: dw4Columns.Down[0] }, key: "Down0" },
    { image: dw4Characters, coords: { y: dw4HeroY, x: dw4Columns.Down[1] }, key: "Down1" },
    { image: dw4Characters, coords: { y: dw4HeroY, x: dw4Columns.Right[0] }, key: "Right0" },
    { image: dw4Characters, coords: { y: dw4HeroY, x: dw4Columns.Right[1] }, key: "Right1" },
    { image: dw4Characters, coords: { y: dw4HeroY, x: dw4Columns.Left[0] }, key: "Left0" },
    { image: dw4Characters, coords: { y: dw4HeroY, x: dw4Columns.Left[1] }, key: "Left1" },
]

export function useAvatarSprites() {
    return useSpritelookup(avatarSpriteDefinitions);
}