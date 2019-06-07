import dw4Characters from "../../images/dw4-character-sprites.png";
import { SpriteDefinition, useSpritelookup } from "../canvas";
import { Direction, PawnType } from "../../game";

const y: Record<PawnType, number> = {
    [PawnType.Hero]: 2,
    [PawnType.MaleSoldier]: 20,
    [PawnType.FemaleSoldier]: 38,
    [PawnType.MaleSage]: 56,
    [PawnType.FemaleSage]: 74,
    [PawnType.MaleGoofoff]: 92,
    [PawnType.FemaleGoofoff]: 110,
    [PawnType.MaleWizard]: 146,
    [PawnType.FemaleWizard]: 128,
    [PawnType.MaleMerchant]: 164,
    [PawnType.FemaleMerchant]: 182,
    [PawnType.MalePilgrim]: 218,
    [PawnType.FemalePilgrim]: 236,
    [PawnType.MaleFighter]: 272,
    [PawnType.FemaleFighter]: 290,
    [PawnType.Woman]: 308,
    [PawnType.Guard]: 326,
    [PawnType.OldMan]: 362,
    [PawnType.Priest1]: 380,
    [PawnType.Priest2]: 398,
    [PawnType.Princess]: 416,
    [PawnType.King]: 434,
    [PawnType.Ship]: 470,
    [PawnType.Demon]: 488,
    [PawnType.HornedMan]: 506,
    [PawnType.Boy]: 524,
    [PawnType.Bard]: 542,
    [PawnType.Seneschal]: 560,
    [PawnType.Man]: 578,
    [PawnType.Warrior]: 596,
    [PawnType.Bellydancer]: 614,
    [PawnType.Ghost]: 650,
    [PawnType.Shopkeeper]: 686,
    [PawnType.Horse]: 704,
    [PawnType.Cat]: 722,
    [PawnType.Girl1]: 740,
    [PawnType.Girl2]: 758,
    [PawnType.Dragon]: 776,
    [PawnType.Girl3]: 794,
    [PawnType.Elf]: 812,
    [PawnType.Slime]: 830,
    [PawnType.Dwarf]: 848,
    [PawnType.Prisoner]: 866,
    [PawnType.Dancer]: 884,
    [PawnType.Skeleton]: 902,
}

const dw4Columns = {
    Up: [ 20, 38 ],
    Down: [ 56, 74 ],
    Right: [ 92, 110 ],
    Left: [ 128, 146 ]
}

function createDw4SpriteDefinition(y: number) {
    return ({
        [Direction.Up]: { image: dw4Characters, coords: [{ y, x: dw4Columns.Up[0] }, { y, x: dw4Columns.Up[1] }] },
        [Direction.Down]: { image: dw4Characters, coords: [{ y, x: dw4Columns.Down[0] }, { y, x: dw4Columns.Down[1] }] },
        [Direction.Right]: { image: dw4Characters, coords: [{ y, x: dw4Columns.Right[0] }, { y, x: dw4Columns.Right[1] }] },
        [Direction.Left]: { image: dw4Characters, coords: [{ y, x: dw4Columns.Left[0] }, { y, x: dw4Columns.Left[1] }] },
    });
}

const avatarDefinitions =
    (Object.keys(y) as PawnType[]).reduce((defs, key) => {
        defs[key] = createDw4SpriteDefinition(y[key])
        return defs;
    }, {} as Record<PawnType, Record<Direction, SpriteDefinition>>)

export function useAvatarSprites(pawnType: PawnType) {
    return useSpritelookup(avatarDefinitions[pawnType]);
}
