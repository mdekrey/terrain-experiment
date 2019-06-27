import dw4Tiles from "../../images/dw4-world-sprites.png";
import { SpriteDefinition, useSpritelookup, SpriteLookup } from "../canvas";
import { Cave } from "../../cave-generation";
import { TilePieceRenderer, BlockLoader } from "./TileCache";

export enum CaveSpotType {
    Ceiling1,
    Wall1,
    Ceiling2,
    Wall2,
    Open,
    Stairway,
    Treasure
}

const dw4CaveCeiling1 =  { image: dw4Tiles, coords: [{ x: 256, y: 176 }] };
const dw4CaveWall1 =  { image: dw4Tiles, coords: [{ x: 272, y: 192 }] };
const dw4CaveCeiling2 =  { image: dw4Tiles, coords: [{ x: 272, y: 176 }] };
const dw4CaveWall2 =  { image: dw4Tiles, coords: [{ x: 256, y: 192 }] };
const dw4Floor =  { image: dw4Tiles, coords: [{ x: 240, y: 64 }] };
const dw4Stairway =  { image: dw4Tiles, coords: [{ x: 448, y: 48 }] };
const dw4Treasure =  { image: dw4Tiles, coords: [{ x: 416, y: 144 }] };

const caveSpriteDefinitions: Record<CaveSpotType, SpriteDefinition> = {
    [CaveSpotType.Ceiling1]: { ...dw4CaveCeiling1, fallbackColor: "rgb(244, 174, 92)" },
    [CaveSpotType.Wall1]: { ...dw4CaveWall1, fallbackColor: "rgb(228, 110, 28)" },
    [CaveSpotType.Ceiling2]: { ...dw4CaveCeiling2, fallbackColor: "rgb(244, 174, 92)" },
    [CaveSpotType.Wall2]: { ...dw4CaveWall2, fallbackColor: "rgb(228, 110, 28)" },
    [CaveSpotType.Open]: { ...dw4Floor, fallbackColor: "#6E2C00" },
    [CaveSpotType.Stairway]: { ...dw4Stairway, fallbackColor: "#6E2C00" },
    [CaveSpotType.Treasure]: { ...dw4Treasure, fallbackColor: "#6E2C00" },
}

export function useCaveSprites() {
    return useSpritelookup(caveSpriteDefinitions);
}

export function getCaveSpotLoader(cave: Cave): BlockLoader<CaveSpotType[]> {
    function isSolid(x: number, y: number) {
        return (cave.isSolid[y] && cave.isSolid[y][x]) !== false
    }
    function caveSpotType(x: number, y: number) {
        const isOdd = Math.abs(x + y) % 2;
        return !isSolid(x, y) ? CaveSpotType.Open
            : isSolid(x, y + 1) ? (isOdd ? CaveSpotType.Ceiling1 : CaveSpotType.Ceiling2)
            : (isOdd ? CaveSpotType.Wall1 : CaveSpotType.Wall2)
    }
    return (x, y, gridSize, tileStep) => {
        const steps = Array.from(Array(tileStep).keys())
        return steps.map(iy => steps.map((ix => {
            const caveX = x + ix * gridSize;
            const caveY = y + iy * gridSize;
            const base = [caveSpotType(caveX, caveY)]

            if (cave.entrance.x === caveX && cave.entrance.y === caveY) {
                base.push(CaveSpotType.Stairway);
            }
            else if (cave.treasure.find(t => t.x === caveX && t.y === caveY)) {
                base.push(CaveSpotType.Treasure);
            }

            return base;
        })));
    };
}

export function getCaveSpotRenderer(
    cave: Cave,
    sprites: SpriteLookup<CaveSpotType>
  ): TilePieceRenderer<CaveSpotType[]> {
    return function renderTerrainSpot({
      context,
      screenCoordinates: { x, y },
      terrain,
      pixelSize
    }) {
        for (const entry of terrain) {
            const sprite = sprites[entry];
            sprite.render(0, context, x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
    };
  }
