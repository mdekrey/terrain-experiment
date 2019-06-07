import dw4Tiles from "../../images/dw4-world-sprites.png";
import { VisualTerrainType } from "../../terrain-generation";
import { SpriteDefinition, useSpritelookup } from "../canvas";

const dw4Ocean = { image: dw4Tiles, coords: [{ x: 160, y: 224 }] };
const dw4Pool = { image: dw4Tiles, coords: [{ x: 0, y: 48 }] };
const dw4Desert = { image: dw4Tiles, coords: [{ x: 144, y: 0 }] };
const dw4Plains = { image: dw4Tiles, coords: [{ x: 0, y: 128 }] };
const dw4Bushes = { image: dw4Tiles, coords: [{ x: 48, y: 128 }] };
const dw4SnowyBushes = { image: dw4Tiles, coords: [{ x: 208, y: 160 }] };
const dw4SnowyPlains = { image: dw4Tiles, coords: [{ x: 208, y: 144 }] };
const dw4SnowyTwoTrees = { image: dw4Tiles, coords: [{ x: 224, y: 144 }] };
const dw4Clouds = { image: dw4Tiles, coords: [{ x: 240, y: 96 }] };
const dw4SingleDeciduousTree = { image: dw4Tiles, coords: [{ x: 0, y: 192 }] };
const dw4GreenTwoTrees = { image: dw4Tiles, coords: [{ x: 144, y: 128 }] };
const dw4GreenSomething = { image: dw4Tiles, coords: [{ x: 208, y: 32 }] };
const dw4GreenHill = { image: dw4Tiles, coords: [{ x: 48, y: 192 }] };
const dw4GreenMountain = { image: dw4Tiles, coords: [{ x: 96, y: 128 }] };
const dw4SnowyHill = { image: dw4Tiles, coords: [{ x: 224, y: 160 }] };
const dw4SnowyMountain = { image: dw4Tiles, coords: [{ x: 240, y: 144 }] };
const dw4Ice = { image: dw4Tiles, coords: [{ x: 208, y: 176 }] };
const dw4Cave = { image: dw4Tiles, coords: [{ x: 448, y: 176 }] };



const color: Record<VisualTerrainType, string> = {
    [VisualTerrainType.DeepWater]: "#000088",
    [VisualTerrainType.ShallowWater]: "blue",
    [VisualTerrainType.Ice]: "white",
    [VisualTerrainType.Permafrost]: "white",
    [VisualTerrainType.Tundra]: "rgb(15,59,59)",
    [VisualTerrainType.ColdParklands]: "rgb(144,144,122)",
    [VisualTerrainType.ConiferousForests]: "rgb(29, 96, 96)",
    [VisualTerrainType.CoolDeserts]: "rgb(170, 192, 102)",
    [VisualTerrainType.Steppes]: "rgb(82, 154, 82)",
    [VisualTerrainType.MixedForests]: "rgb(10, 154, 118)",
    [VisualTerrainType.HotDeserts]: "rgb(212, 255, 77)",
    [VisualTerrainType.Chaparral]: "rgb(82, 205, 82)",
    [VisualTerrainType.DeciduousForests]: "rgb(0, 205, 123)",
    [VisualTerrainType.Savanna]: "rgb(144, 255, 77)",
    [VisualTerrainType.TropicalSeasonalForests]: "rgb(77, 255, 77)",
    [VisualTerrainType.TropicalRainForests]: "rgb(28, 178, 66)",
    [VisualTerrainType.SnowyHill]: "white",
    [VisualTerrainType.SnowyMountain]: "white",
    [VisualTerrainType.Hills]: "grey",
    [VisualTerrainType.Mountain]: "grey",
    [VisualTerrainType.Cave]: "transparent"
}

const terrainSpriteDefinitions: Record<VisualTerrainType, SpriteDefinition> = {
    [VisualTerrainType.DeepWater]: { ...dw4Ocean, fallbackColor: color[VisualTerrainType.DeepWater] },
    [VisualTerrainType.ShallowWater]: { ...dw4Pool, fallbackColor: color[VisualTerrainType.ShallowWater] },
    [VisualTerrainType.HotDeserts]: { ...dw4Desert, fallbackColor: color[VisualTerrainType.HotDeserts] },
    [VisualTerrainType.CoolDeserts]: { ...dw4Plains, fallbackColor: color[VisualTerrainType.CoolDeserts] },
    [VisualTerrainType.Steppes]: { ...dw4Bushes, fallbackColor: color[VisualTerrainType.Steppes] },
    [VisualTerrainType.Chaparral]: { ...dw4Bushes, fallbackColor: color[VisualTerrainType.Chaparral] },
    [VisualTerrainType.ColdParklands]: { ...dw4SnowyBushes, fallbackColor: color[VisualTerrainType.ColdParklands] },
    [VisualTerrainType.Tundra]: { ...dw4SnowyPlains, fallbackColor: color[VisualTerrainType.Tundra] },
    [VisualTerrainType.ConiferousForests]: { ...dw4SnowyTwoTrees, fallbackColor: color[VisualTerrainType.ConiferousForests] },
    [VisualTerrainType.Permafrost]: { ...dw4Clouds, fallbackColor: color[VisualTerrainType.Permafrost] },
    [VisualTerrainType.Savanna]: { ...dw4Plains, fallbackColor: color[VisualTerrainType.Savanna] },
    [VisualTerrainType.TropicalSeasonalForests]: { ...dw4GreenSomething, fallbackColor: color[VisualTerrainType.TropicalSeasonalForests] },
    [VisualTerrainType.TropicalRainForests]: { ...dw4GreenSomething, fallbackColor: color[VisualTerrainType.TropicalRainForests] },
    [VisualTerrainType.DeciduousForests]: { ...dw4SingleDeciduousTree, fallbackColor: color[VisualTerrainType.DeciduousForests] },
    [VisualTerrainType.MixedForests]: { ...dw4GreenTwoTrees, fallbackColor: color[VisualTerrainType.MixedForests] },
    [VisualTerrainType.SnowyHill]: { ...dw4SnowyHill, fallbackColor: color[VisualTerrainType.SnowyHill] },
    [VisualTerrainType.SnowyMountain]: { ...dw4SnowyMountain, fallbackColor: color[VisualTerrainType.SnowyMountain] },
    [VisualTerrainType.Hills]: { ...dw4GreenHill, fallbackColor: color[VisualTerrainType.Hills] },
    [VisualTerrainType.Mountain]: { ...dw4GreenMountain, fallbackColor: color[VisualTerrainType.Mountain] },
    [VisualTerrainType.Ice]: { ...dw4Ice, fallbackColor: color[VisualTerrainType.Ice] },
    [VisualTerrainType.Cave]: { ...dw4Cave, fallbackColor: color[VisualTerrainType.Cave] },
}

export function useTerrainSprites() {
    return useSpritelookup(terrainSpriteDefinitions);
}