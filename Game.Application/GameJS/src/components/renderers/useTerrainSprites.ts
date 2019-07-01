import dw4Tiles from "../../images/dw4-world-sprites.png";
import { VisualTerrainType } from "../../rxjs-api";
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
    "DeepWater": "#000088",
    "ShallowWater": "blue",
    "Ice": "white",
    "Snow": "white",
    "SnowWithGrass": "rgb(15,59,59)",
    "SnowWithBushes": "rgb(144,144,122)",
    "SnowWithConiferousForests": "rgb(29, 96, 96)",
    "Grassland": "rgb(170, 192, 102)",
    "Bushes": "rgb(82, 154, 82)",
    "ConiferousForests": "rgb(10, 154, 118)",
    "HotDeserts": "rgb(212, 255, 77)",
    "DeciduousForests": "rgb(0, 205, 123)",
    "TropicalRainForests": "rgb(28, 178, 66)",
    "SnowyHills": "white",
    "SnowyMountains": "white",
    "Hills": "grey",
    "Mountains": "grey",
    "Cave": "transparent"
}

const terrainSpriteDefinitions: Record<VisualTerrainType, SpriteDefinition> = {
    "DeepWater": { ...dw4Ocean, fallbackColor: color["DeepWater"] },
    "ShallowWater": { ...dw4Pool, fallbackColor: color["ShallowWater"] },
    "HotDeserts": { ...dw4Desert, fallbackColor: color["HotDeserts"] },
    "Grassland": { ...dw4Plains, fallbackColor: color["Grassland"] },
    "Bushes": { ...dw4Bushes, fallbackColor: color["Bushes"] },
    "SnowWithBushes": { ...dw4SnowyBushes, fallbackColor: color["SnowWithBushes"] },
    "SnowWithGrass": { ...dw4SnowyPlains, fallbackColor: color["SnowWithGrass"] },
    "SnowWithConiferousForests": { ...dw4SnowyTwoTrees, fallbackColor: color["SnowWithConiferousForests"] },
    "Snow": { ...dw4Clouds, fallbackColor: color["Snow"] },
    "DeciduousForests": { ...dw4SingleDeciduousTree, fallbackColor: color["DeciduousForests"] },
    "TropicalRainForests": { ...dw4GreenSomething, fallbackColor: color["TropicalRainForests"] },
    "ConiferousForests": { ...dw4GreenTwoTrees, fallbackColor: color["ConiferousForests"] },
    "SnowyHills": { ...dw4SnowyHill, fallbackColor: color["SnowyHills"] },
    "SnowyMountains": { ...dw4SnowyMountain, fallbackColor: color["SnowyMountains"] },
    "Hills": { ...dw4GreenHill, fallbackColor: color["Hills"] },
    "Mountains": { ...dw4GreenMountain, fallbackColor: color["Mountains"] },
    "Ice": { ...dw4Ice, fallbackColor: color["Ice"] },
    "Cave": { ...dw4Cave, fallbackColor: color["Cave"] },
}

export function useTerrainSprites() {
    return useSpritelookup(terrainSpriteDefinitions);
}