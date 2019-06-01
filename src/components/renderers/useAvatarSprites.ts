import dw4Characters from "../../images/dw4-character-sprites.png";
import { SpriteDefinition, useSpritelookup } from "../canvas";
import { Direction } from "../../game";

const dw4HeroY = 2;
const dw4FemSoldierY = 38;
const dw4Columns = {
    Up: [ 20, 38 ],
    Down: [ 56, 74 ],
    Right: [ 92, 110 ],
    Left: [ 128, 146 ]
}

const avatarSpriteDefinitions: Record<Direction, SpriteDefinition> = {
    [Direction.Up]: { image: dw4Characters, coords: [{ y: dw4FemSoldierY, x: dw4Columns.Up[0] }, { y: dw4FemSoldierY, x: dw4Columns.Up[1] }] },
    [Direction.Down]: { image: dw4Characters, coords: [{ y: dw4FemSoldierY, x: dw4Columns.Down[0] }, { y: dw4FemSoldierY, x: dw4Columns.Down[1] }] },
    [Direction.Right]: { image: dw4Characters, coords: [{ y: dw4FemSoldierY, x: dw4Columns.Right[0] }, { y: dw4FemSoldierY, x: dw4Columns.Right[1] }] },
    [Direction.Left]: { image: dw4Characters, coords: [{ y: dw4FemSoldierY, x: dw4Columns.Left[0] }, { y: dw4FemSoldierY, x: dw4Columns.Left[1] }] },
}

export function useAvatarSprites() {
    return useSpritelookup(avatarSpriteDefinitions);
}