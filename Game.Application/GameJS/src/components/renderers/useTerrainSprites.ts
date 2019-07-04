import dw4Tiles from "../../images/dw4-world-sprites.png";
import { VisualTerrainType } from "../../api";
import { SpriteDefinition, useSpritelookup } from "../canvas";

const tileSize = 16;

const dw4Ocean = {
  image: dw4Tiles,
  coords: [{ x: tileSize * 10, y: tileSize * 14 }]
};
const dw4Pool = {
  image: dw4Tiles,
  coords: [{ x: tileSize * 0, y: tileSize * 3 }]
};
const dw4Desert = {
  image: dw4Tiles,
  coords: [{ x: tileSize * 9, y: tileSize * 0 }]
};
const dw4Plains = {
  image: dw4Tiles,
  coords: [{ x: tileSize * 0, y: tileSize * 8 }]
};
const dw4Bushes = {
  image: dw4Tiles,
  coords: [{ x: tileSize * 3, y: tileSize * 8 }]
};
const dw4SnowyBushes = {
  image: dw4Tiles,
  coords: [{ x: tileSize * 13, y: tileSize * 10 }]
};
const dw4SnowyPlains = {
  image: dw4Tiles,
  coords: [{ x: tileSize * 13, y: tileSize * 9 }]
};
const dw4SnowyTwoTrees = {
  image: dw4Tiles,
  coords: [{ x: tileSize * 14, y: tileSize * 9 }]
};
const dw4Clouds = {
  image: dw4Tiles,
  coords: [{ x: tileSize * 15, y: tileSize * 6 }]
};
const dw4SingleDeciduousTree = {
  image: dw4Tiles,
  coords: [{ x: tileSize * 0, y: tileSize * 12 }]
};
const dw4GreenTwoTrees = {
  image: dw4Tiles,
  coords: [{ x: tileSize * 9, y: tileSize * 8 }]
};
const dw4GreenSomething = {
  image: dw4Tiles,
  coords: [{ x: tileSize * 13, y: 32 }]
};
const dw4GreenHill = {
  image: dw4Tiles,
  coords: [{ x: tileSize * 3, y: tileSize * 12 }]
};
const dw4GreenMountain = {
  image: dw4Tiles,
  coords: [{ x: tileSize * 6, y: tileSize * 8 }]
};
const dw4SnowyHill = {
  image: dw4Tiles,
  coords: [{ x: tileSize * 14, y: tileSize * 10 }]
};
const dw4SnowyMountain = {
  image: dw4Tiles,
  coords: [{ x: tileSize * 15, y: tileSize * 9 }]
};
const dw4Ice = {
  image: dw4Tiles,
  coords: [{ x: tileSize * 13, y: tileSize * 11 }]
};
const dw4Cave = {
  image: dw4Tiles,
  coords: [{ x: tileSize * 28, y: tileSize * 11 }]
};
const dw4Shrine = {
  image: dw4Tiles,
  coords: [{ x: tileSize * 29, y: tileSize * 12 }]
};
const dw4Teleportal = {
  image: dw4Tiles,
  coords: [
    { x: tileSize * 5, y: tileSize * 4 },
    { x: tileSize * 5, y: tileSize * 5 },
    { x: tileSize * 5, y: tileSize * 6 },
    { x: tileSize * 5, y: tileSize * 7 }]
};
const dw4ShrineFancyTile = {
  image: dw4Tiles,
  coords: [{ x: tileSize * 17, y: tileSize * 4 }]
};
const dw4DarkRedTile = {
  image: dw4Tiles,
  coords: [{ x: tileSize * 23, y: tileSize * 4 }]
};
const dw4Flowers = {
  image: dw4Tiles,
  coords: [{ x: tileSize * 26, y: tileSize * 4 }]
};
const dw4DogStatue = {
  image: dw4Tiles,
  coords: [{ x: tileSize * 27, y: tileSize * 4 }]
};

const color: Record<VisualTerrainType, string> = {
  DeepWater: "#000088",
  ShallowWater: "blue",
  Ice: "white",
  Snow: "white",
  SnowWithGrass: "rgb(15,59,59)",
  SnowWithBushes: "rgb(144,144,122)",
  SnowWithConiferousForests: "rgb(29, 96, 96)",
  Grassland: "rgb(170, 192, 102)",
  Bushes: "rgb(82, 154, 82)",
  ConiferousForests: "rgb(10, 154, 118)",
  HotDeserts: "rgb(212, 255, 77)",
  DeciduousForests: "rgb(0, 205, 123)",
  TropicalRainForests: "rgb(28, 178, 66)",
  SnowyHills: "white",
  SnowyMountains: "white",
  Hills: "grey",
  Mountains: "grey",
  Cave: "transparent",
  Shrine: "grey",
  Teleportal: "blue",
  ShrineFancyTile: 'transparent',
  DarkRedTile: 'transparent',
  Flowers: 'transparent',
  DogStatue: 'transparent',
};

const terrainSpriteDefinitions: Record<VisualTerrainType, SpriteDefinition> = {
  DeepWater: { ...dw4Ocean, fallbackColor: color["DeepWater"] },
  ShallowWater: { ...dw4Pool, fallbackColor: color["ShallowWater"] },
  HotDeserts: { ...dw4Desert, fallbackColor: color["HotDeserts"] },
  Grassland: { ...dw4Plains, fallbackColor: color["Grassland"] },
  Bushes: { ...dw4Bushes, fallbackColor: color["Bushes"] },
  SnowWithBushes: { ...dw4SnowyBushes, fallbackColor: color["SnowWithBushes"] },
  SnowWithGrass: { ...dw4SnowyPlains, fallbackColor: color["SnowWithGrass"] },
  SnowWithConiferousForests: { ...dw4SnowyTwoTrees, fallbackColor: color["SnowWithConiferousForests"] },
  Snow: { ...dw4Clouds, fallbackColor: color["Snow"] },
  DeciduousForests: { ...dw4SingleDeciduousTree, fallbackColor: color["DeciduousForests"] },
  TropicalRainForests: { ...dw4GreenSomething, fallbackColor: color["TropicalRainForests"] },
  ConiferousForests: { ...dw4GreenTwoTrees, fallbackColor: color["ConiferousForests"] },
  SnowyHills: { ...dw4SnowyHill, fallbackColor: color["SnowyHills"] },
  SnowyMountains: { ...dw4SnowyMountain, fallbackColor: color["SnowyMountains"] },
  Hills: { ...dw4GreenHill, fallbackColor: color["Hills"] },
  Mountains: { ...dw4GreenMountain, fallbackColor: color["Mountains"] },
  Ice: { ...dw4Ice, fallbackColor: color["Ice"] },
  Cave: { ...dw4Cave, fallbackColor: color["Cave"] },
  Shrine: { ...dw4Shrine, fallbackColor: color["Shrine"] },
  Teleportal: { ...dw4Teleportal, fallbackColor: color["Teleportal"] },
  ShrineFancyTile: { ...dw4ShrineFancyTile, fallbackColor: color["ShrineFancyTile"] },
  DarkRedTile: { ...dw4DarkRedTile, fallbackColor: color["DarkRedTile"] },
  Flowers: { ...dw4Flowers, fallbackColor: color["Flowers"] },
  DogStatue: { ...dw4DogStatue, fallbackColor: color["DogStatue"] },
};

export function useTerrainSprites() {
  return useSpritelookup(terrainSpriteDefinitions);
}
