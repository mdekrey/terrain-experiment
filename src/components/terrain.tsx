import React from "react";
import { TerrainGenerator, TerrainResult } from "../terrain-generation/TerrainGenerator";
import { BiomeCategory } from "../terrain-generation/BiomeCategory";
import { useCanvas, useSpritelookup, SpriteDefinition, SpriteLookup } from "./canvas";
import dw4tiles from "../images/dw4-world-sprites.png";
import { WaterCategory } from "../terrain-generation/WaterCategory";
import { TerrainCache } from "../terrain-generation/TerrainCache";

function* coordinates(columns: number, rows: number, centerX: number, centerY: number, gridSize: number) {
    const offsetX = Math.floor(columns / -2);
    const offsetY = Math.floor(rows / -2);

    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < columns; y++) {
            yield { screenX: x, screenY: y, terrainX: (x + offsetX) * gridSize + centerX, terrainY: (y + offsetY) * gridSize + centerY }
        }
    }
}

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

export function TerrainGrid({ rows, columns, terrain, gridSize, pixelSize, centerX, centerY }: { gridSize: number, rows: number, columns: number, terrain: TerrainGenerator, pixelSize: number, centerX: number, centerY: number }) {
    const terrainCache = React.useMemo(() => new TerrainCache(terrain), [terrain]);
    const sprites = useSpritelookup(terrainSpriteDefinitions);

    useCanvas(React.useCallback(context => {
        for (const { screenX, screenY, terrainX, terrainY } of coordinates(columns, rows, centerX, centerY, gridSize)) {
            const terrain = terrainCache.getAt(terrainX, terrainY);
            renderTerrainSpot({ x: screenX, y: screenY, pixelSize, context, terrain, sprites });
        }
    }, [pixelSize, columns, rows, centerX, centerY, gridSize, sprites, terrainCache]));
    return null;
}

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

function toRgbRange(input: number) {
    return Math.min(255, Math.max(0, 255 * (input)));
}

export function renderTerrainSpot({ terrain, x, y, context, pixelSize, sprites }: { terrain: TerrainResult, x: number, y: number, context: CanvasRenderingContext2D, pixelSize: number, sprites: Partial<SpriteLookup<BiomeCategory>> }) {
    if (terrain.waterCategory === WaterCategory.None && sprites[terrain.biomeCategory]) {
        const p = sprites[terrain.biomeCategory]!.toDrawImageParams();
        context.drawImage(p[0], p[1], p[2], p[3], p[4], x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    } else {
        const backgroundColor = color[terrain.biomeCategory];
        // const backgroundColor = `rgb(${toRgbRange(terrain.heat * 2 - 1)}, ${toRgbRange(1 - terrain.heat)}, 0)`
        // const backgroundColor = `rgb(${toRgbRange(1 - terrain.humidity)}, 200, 0)`
        // const backgroundColor = `rgb(${toRgbRange(terrain.altitude)}, ${toRgbRange(terrain.altitude)}, ${toRgbRange(terrain.altitude)})`

        const withWater = terrain.waterCategory === WaterCategory.None ? backgroundColor
        : terrain.waterCategory === WaterCategory.ShallowWater ? "blue"
        : terrain.waterCategory === WaterCategory.DeepWater ? "#000088"
        : backgroundColor;

        context.fillStyle = withWater;
        context.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    }
}