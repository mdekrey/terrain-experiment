import React, { useEffect } from "react";
import { TerrainGenerator, TerrainResult } from "../terrain-generation/TerrainGenerator";
import { BiomeCategory } from "../terrain-generation/BiomeCategory";
import { useCanvas } from "./canvas/useCanvas";
import { Canvas } from "./canvas/Canvas";
import { CanvasCallback } from "./canvas/CanvasCallback";

export function Terrain() {
    const terrainGenerator = React.useMemo(() => new TerrainGenerator(), []);
    return (
        <Canvas width={1200} height={800}>
            <TerrainGrid rows={400} columns={600} terrain={terrainGenerator} gridSize={0.01} pixelSize={2} />
        </Canvas>
    );
}

export function TerrainGrid({ rows, columns, terrain, gridSize, pixelSize }: { gridSize: number, rows: number, columns: number, terrain: TerrainGenerator, pixelSize: number }) {
    useCanvas(React.useCallback(context => {
        for (let row = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {
                renderTerrainSpot({ x: column, y: row, pixelSize, context, terrain: terrain.getTerrain(row * gridSize, column * gridSize) })
            }
        }
    }, [ rows, columns, terrain, gridSize ]))
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

export function renderTerrainSpot({ terrain, x, y, context, pixelSize }: { terrain: TerrainResult, x: number, y: number, context: CanvasRenderingContext2D, pixelSize: number }) {
    const backgroundColor = terrain.altitude < 0.3 ? "#000088" : terrain.altitude < 0.4 ? "blue" : color[terrain.biomeCategory];
    // const backgroundColor = `rgb(${Math.min(255, 255 * (2 - terrain.heat * 2))}, ${Math.min(255, Math.max(0, 255 * (terrain.heat)))}, 0)`

    context.fillStyle = backgroundColor;
    context.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
}