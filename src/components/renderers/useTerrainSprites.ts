import dw4Tiles from "../../images/dw4-world-sprites.png";
import { BiomeCategory, AltitudeCategory, VisualTerrainType } from "../../terrain-generation";
import { SpriteDefinition, useSpritelookup } from "../canvas";

const dw4Ocean =  { image: dw4Tiles, coords: [{ x: 160, y: 224 }] };
const dw4Pool =  { image: dw4Tiles, coords: [{ x: 0, y: 48 }] };
const dw4Desert =  { image: dw4Tiles, coords: [{ x: 144, y: 0 }] };
const dw4Plains =  { image: dw4Tiles, coords: [{ x: 0, y: 128 }] };
const dw4Bushes =  { image: dw4Tiles, coords: [{ x: 48, y: 128 }] };
const dw4SnowyBushes =  { image: dw4Tiles, coords: [{ x: 208, y: 160 }] };
const dw4SnowyPlains =  { image: dw4Tiles, coords: [{ x: 208, y: 144 }] };
const dw4SnowyTwoTrees =  { image: dw4Tiles, coords: [{ x: 224, y: 144 }] };
const dw4Clouds = { image: dw4Tiles, coords: [{ x: 240, y: 96 }] };
const dw4SingleDeciduousTree = { image: dw4Tiles, coords: [{ x: 0, y: 192 }] };
const dw4GreenTwoTrees =  { image: dw4Tiles, coords: [{ x: 144, y: 128 }] };
const dw4GreenSomething =  { image: dw4Tiles, coords: [{ x: 208, y: 32 }] };

const dw4GreenHill =  { image: dw4Tiles, coords: [{ x: 48, y: 192 }] };
const dw4GreenMountain =  { image: dw4Tiles, coords: [{ x: 96, y: 128 }] };
const dw4SnowyHill =  { image: dw4Tiles, coords: [{ x: 224, y: 160 }] };
const dw4SnowyMountain =  { image: dw4Tiles, coords: [{ x: 240, y: 144 }] };
const dw4Ice =  { image: dw4Tiles, coords: [{ x: 208, y: 176 }] };



const color: Record<VisualTerrainType, string> = {
    [AltitudeCategory.DeepWater]: "#000088",
    [AltitudeCategory.ShallowWater]: "blue",
    "Ice": "white",
    [BiomeCategory.Permafrost]: "white",
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
    "SnowyHill": "white",
    "SnowyMountain": "white",
    "Hills": "grey",
    "Mountain": "grey",
}

const terrainSpriteDefinitions: Record<VisualTerrainType, SpriteDefinition> = {
    [AltitudeCategory.DeepWater]: { ...dw4Ocean, fallbackColor: color[AltitudeCategory.DeepWater] },
    [AltitudeCategory.ShallowWater]: { ...dw4Pool, fallbackColor: color[AltitudeCategory.ShallowWater] },
    [BiomeCategory.HotDeserts]: { ...dw4Desert, fallbackColor: color[BiomeCategory.HotDeserts] },
    [BiomeCategory.CoolDeserts]: { ...dw4Plains, fallbackColor: color[BiomeCategory.CoolDeserts] },
    [BiomeCategory.Steppes]: { ...dw4Bushes, fallbackColor: color[BiomeCategory.Steppes] },
    [BiomeCategory.Chaparral]: { ...dw4Bushes, fallbackColor: color[BiomeCategory.Chaparral] },
    [BiomeCategory.ColdParklands]: { ...dw4SnowyBushes, fallbackColor: color[BiomeCategory.ColdParklands] },
    [BiomeCategory.Tundra]: { ...dw4SnowyPlains, fallbackColor: color[BiomeCategory.Tundra] },
    [BiomeCategory.ConiferousForests]: { ...dw4SnowyTwoTrees, fallbackColor: color[BiomeCategory.ConiferousForests] },
    [BiomeCategory.Permafrost]: { ...dw4Clouds, fallbackColor: color[BiomeCategory.Permafrost] },
    [BiomeCategory.Savanna]: { ...dw4Plains, fallbackColor: color[BiomeCategory.Savanna] },
    [BiomeCategory.TropicalSeasonalForests]: { ...dw4GreenSomething, fallbackColor: color[BiomeCategory.TropicalSeasonalForests] },
    [BiomeCategory.TropicalRainForests]: { ...dw4GreenSomething, fallbackColor: color[BiomeCategory.TropicalRainForests] },
    [BiomeCategory.DeciduousForests]: { ...dw4SingleDeciduousTree, fallbackColor: color[BiomeCategory.DeciduousForests] },
    [BiomeCategory.MixedForests]: { ...dw4GreenTwoTrees, fallbackColor: color[BiomeCategory.MixedForests] },
    "SnowyHill": { ...dw4SnowyHill, fallbackColor: color["SnowyHill"] },
    "SnowyMountain": { ...dw4SnowyMountain, fallbackColor: color["SnowyMountain"] },
    "Hills": { ...dw4GreenHill, fallbackColor: color["Hills"] },
    "Mountain": { ...dw4GreenMountain, fallbackColor: color["Mountain"] },
    "Ice": { ...dw4Ice, fallbackColor: color["Ice"] },
}

export function useTerrainSprites() {
    return useSpritelookup(terrainSpriteDefinitions);
}