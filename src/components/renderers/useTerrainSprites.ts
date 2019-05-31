import dw4tiles from "../../images/dw4-world-sprites.png";
import { BiomeCategory } from "../../terrain-generation";
import { SpriteDefinition, useSpritelookup } from "../canvas";

const dw4desert =  { image: dw4tiles, coords: { x: 144, y: 0 } };
const dw4plains =  { image: dw4tiles, coords: { x: 0, y: 128 } };
const dw4bushes =  { image: dw4tiles, coords: { x: 48, y: 128 } };
const dw4snowyBushes =  { image: dw4tiles, coords: { x: 208, y: 160 } };
const dw4snowyPlains =  { image: dw4tiles, coords: { x: 208, y: 144 } };
const dw4snowyTwoTrees =  { image: dw4tiles, coords: { x: 224, y: 144 } };
const dw4clouds = { image: dw4tiles, coords: { x: 240, y: 96 } };
const dw4singleDeciduousTree = { image: dw4tiles, coords: { x: 0, y: 192 } };
const dw4greenTwoTrees =  { image: dw4tiles, coords: { x: 144, y: 128 } };
const dw4greenSomething =  { image: dw4tiles, coords: { x: 208, y: 32 } };

const terrainSpriteDefinitions: SpriteDefinition<BiomeCategory>[] = [
    { ...dw4desert, key: BiomeCategory.HotDeserts },
    { ...dw4plains, key: BiomeCategory.CoolDeserts },
    { ...dw4bushes, key: BiomeCategory.Steppes },
    { ...dw4bushes, key: BiomeCategory.Chaparral },
    { ...dw4snowyBushes, key: BiomeCategory.ColdParklands },
    { ...dw4snowyPlains, key: BiomeCategory.Tundra },
    { ...dw4snowyTwoTrees, key: BiomeCategory.ConiferousForests },
    { ...dw4clouds, key: BiomeCategory.Ice },
    { ...dw4plains, key: BiomeCategory.Savanna },
    { ...dw4greenSomething, key: BiomeCategory.TropicalSeasonalForests },
    { ...dw4greenSomething, key: BiomeCategory.TropicalRainForests },
    { ...dw4singleDeciduousTree, key: BiomeCategory.DeciduousForests },
    { ...dw4greenTwoTrees, key: BiomeCategory.MixedForests }
]

export function useTerrainSprites() {
    return useSpritelookup(terrainSpriteDefinitions);
}