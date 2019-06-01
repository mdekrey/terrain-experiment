import dw4tiles from "../../images/dw4-world-sprites.png";
import { BiomeCategory } from "../../terrain-generation";
import { SpriteDefinition, useSpritelookup } from "../canvas";

const dw4desert =  { image: dw4tiles, coords: [{ x: 144, y: 0 }] };
const dw4plains =  { image: dw4tiles, coords: [{ x: 0, y: 128 }] };
const dw4bushes =  { image: dw4tiles, coords: [{ x: 48, y: 128 }] };
const dw4snowyBushes =  { image: dw4tiles, coords: [{ x: 208, y: 160 }] };
const dw4snowyPlains =  { image: dw4tiles, coords: [{ x: 208, y: 144 }] };
const dw4snowyTwoTrees =  { image: dw4tiles, coords: [{ x: 224, y: 144 }] };
const dw4clouds = { image: dw4tiles, coords: [{ x: 240, y: 96 }] };
const dw4singleDeciduousTree = { image: dw4tiles, coords: [{ x: 0, y: 192 }] };
const dw4greenTwoTrees =  { image: dw4tiles, coords: [{ x: 144, y: 128 }] };
const dw4greenSomething =  { image: dw4tiles, coords: [{ x: 208, y: 32 }] };

const color: Record<BiomeCategory, string> = {
    [BiomeCategory.Ice]: "white",
    [BiomeCategory.Tundra]: "rgb(15,59,59)",
    [BiomeCategory.ColdParklands]: "rgb(144,144,122)",
    [BiomeCategory.ConiferousForests]: "rgb(29, 96, 96)",
    [BiomeCategory.CoolDeserts]: "rgb(170, 192, 102)",
    [BiomeCategory.Steppes]: "rgb(82, 154, 82)",
    [BiomeCategory.MixedForests]: "rgb(10, 154, 118)",
    [BiomeCategory.HotDeserts]: "rgb(212, 255, 77)",
    [BiomeCategory.Chaparral]: "rgb(82, 205, 82)",
    [BiomeCategory.DeciduousForests]: "rgb(0, 205, 123)",
    [BiomeCategory.Savanna]: "rgb(144, 255, 77)",
    [BiomeCategory.TropicalSeasonalForests]: "rgb(77, 255, 77)",
    [BiomeCategory.TropicalRainForests]: "rgb(28, 178, 66)",
}

const terrainSpriteDefinitions: Record<BiomeCategory, SpriteDefinition> = {
    [BiomeCategory.HotDeserts]: { ...dw4desert, fallbackColor: color[BiomeCategory.HotDeserts] },
    [BiomeCategory.CoolDeserts]: { ...dw4plains, fallbackColor: color[BiomeCategory.CoolDeserts] },
    [BiomeCategory.Steppes]: { ...dw4bushes, fallbackColor: color[BiomeCategory.Steppes] },
    [BiomeCategory.Chaparral]: { ...dw4bushes, fallbackColor: color[BiomeCategory.Chaparral] },
    [BiomeCategory.ColdParklands]: { ...dw4snowyBushes, fallbackColor: color[BiomeCategory.ColdParklands] },
    [BiomeCategory.Tundra]: { ...dw4snowyPlains, fallbackColor: color[BiomeCategory.Tundra] },
    [BiomeCategory.ConiferousForests]: { ...dw4snowyTwoTrees, fallbackColor: color[BiomeCategory.ConiferousForests] },
    [BiomeCategory.Ice]: { ...dw4clouds, fallbackColor: color[BiomeCategory.Ice] },
    [BiomeCategory.Savanna]: { ...dw4plains, fallbackColor: color[BiomeCategory.Savanna] },
    [BiomeCategory.TropicalSeasonalForests]: { ...dw4greenSomething, fallbackColor: color[BiomeCategory.TropicalSeasonalForests] },
    [BiomeCategory.TropicalRainForests]: { ...dw4greenSomething, fallbackColor: color[BiomeCategory.TropicalRainForests] },
    [BiomeCategory.DeciduousForests]: { ...dw4singleDeciduousTree, fallbackColor: color[BiomeCategory.DeciduousForests] },
    [BiomeCategory.MixedForests]: { ...dw4greenTwoTrees, fallbackColor: color[BiomeCategory.MixedForests] }
}

export function useTerrainSprites() {
    return useSpritelookup(terrainSpriteDefinitions);
}