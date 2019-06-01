import dw4Tiles from "../../images/dw4-world-sprites.png";
import { SpriteDefinition, useSpritelookup, SpriteLookup } from "../canvas";
import { Cave } from "../../cave-generation";

export enum CaveSpotType {
    Ceiling,
    Wall,
    Open,
    Stairway,
    Treasure
}

const dw4CaveCeiling =  { image: dw4Tiles, coords: [{ x: 256, y: 176 }, { x: 272, y: 176 }] };
const dw4CaveWall =  { image: dw4Tiles, coords: [{ x: 272, y: 192 }, { x: 256, y: 192 }] };
const dw4Floor =  { image: dw4Tiles, coords: [{ x: 240, y: 64 }] };
const dw4Stairway =  { image: dw4Tiles, coords: [{ x: 448, y: 48 }] };
const dw4Treasure =  { image: dw4Tiles, coords: [{ x: 416, y: 144 }] };

const caveSpriteDefinitions: Record<CaveSpotType, SpriteDefinition> = {
    [CaveSpotType.Ceiling]: { ...dw4CaveCeiling, fallbackColor: "#000000" },
    [CaveSpotType.Wall]: { ...dw4CaveWall, fallbackColor: "#000000" },
    [CaveSpotType.Open]: { ...dw4Floor, fallbackColor: "#6E2C00" },
    [CaveSpotType.Stairway]: { ...dw4Stairway, fallbackColor: "#6E2C00" },
    [CaveSpotType.Treasure]: { ...dw4Treasure, fallbackColor: "#6E2C00" },
}

export function useCaveSprites() {
    return useSpritelookup(caveSpriteDefinitions);
}

export function renderCaveSpot({ cave, screenX: x, screenY: y, context, pixelSize, sprites, caveX, caveY }: { cave: Cave, screenX: number, screenY: number, context: CanvasRenderingContext2D, pixelSize: number, sprites: SpriteLookup<CaveSpotType>, caveX: number, caveY: number }) {
    function isSolid(x: number, y: number) {
        return (cave.isSolid[y] && cave.isSolid[y][x]) !== false
    }
    function caveSpotType(x: number, y: number) {
        return !isSolid(x, y) ? CaveSpotType.Open
            : isSolid(x, y + 1) ? CaveSpotType.Ceiling
            : CaveSpotType.Wall
    }

    const sprite = sprites[caveSpotType(caveX, caveY)];
    const frame = Math.abs(caveX + caveY) % sprite.frameCount;
    sprite.render(frame, context, x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    if (cave.entrance.x === caveX && cave.entrance.y === caveY) {
        sprites[CaveSpotType.Stairway].render(0, context, x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    }
    else if (cave.treasure.find(t => t.x === caveX && t.y === caveY)) {
        sprites[CaveSpotType.Treasure].render(0, context, x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    }
}
