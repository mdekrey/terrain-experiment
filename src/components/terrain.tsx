import React from "react";
import { TerrainGenerator, TerrainResult } from "../terrain-generation/TerrainGenerator";
import { BiomeCategory } from "../terrain-generation/BiomeCategory";
import { useCanvas } from "./canvas/useCanvas";
import { Canvas } from "./canvas/Canvas";

export function Terrain() {
    const [{ centerX, centerY }, setCenter] = React.useState({ centerX: 0, centerY: 0 });
    const terrainGenerator = React.useMemo(() => new TerrainGenerator(), []);
    const width = 1200;
    const height = 800;
    const pixelSize = 20;
    const zoom = 2000;
    const moveAmount = 1;
    return (
        <>
            <button onClick={() => setCenter({ centerX: centerX - moveAmount, centerY })}>Left</button>
            <button onClick={() => setCenter({ centerX, centerY: centerY + moveAmount })}>Down</button>
            <button onClick={() => setCenter({ centerX, centerY: centerY - moveAmount })}>Up</button>
            <button onClick={() => setCenter({ centerX: centerX + moveAmount, centerY })}>Right</button>
            <Canvas width={width} height={height}>
                <TerrainGrid rows={height / pixelSize} columns={width / pixelSize} terrain={terrainGenerator} gridSize={1 / zoom * pixelSize} pixelSize={pixelSize} centerX={centerX} centerY={centerY} />
            </Canvas>
        </>
    );
}

export function TerrainGrid({ rows, columns, terrain, gridSize, pixelSize, centerX, centerY }: { gridSize: number, rows: number, columns: number, terrain: TerrainGenerator, pixelSize: number, centerX: number, centerY: number }) {
    const offsetX = columns / -2 + centerX;
    const offsetY = rows / -2 + centerY;

    const terrainSpots = React.useMemo(() => {
        const columnArray = Array.from(Array(columns).keys())
        return Array.from(Array(rows).keys()).map(row =>
            columnArray.map(column => terrain.getTerrain((column + offsetX) * gridSize, (row + offsetY) * gridSize))
        );
    }, [rows, columns, terrain, gridSize, offsetX, offsetY]);

    useCanvas(React.useCallback(context => {
        terrainSpots.forEach((rowData, row) =>
            rowData.forEach((terrain, column) => renderTerrainSpot({ x: column, y: row, pixelSize, context, terrain })));
    }, [pixelSize, terrainSpots]))
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

export function renderTerrainSpot({ terrain, x, y, context, pixelSize }: { terrain: TerrainResult, x: number, y: number, context: CanvasRenderingContext2D, pixelSize: number }) {
    const backgroundColor = color[terrain.biomeCategory];
    // const backgroundColor = `rgb(${toRgbRange(terrain.heat * 2 - 1)}, ${toRgbRange(1 - terrain.heat)}, 0)`
    // const backgroundColor = `rgb(${toRgbRange(1 - terrain.humidity)}, 200, 0)`
    // const backgroundColor = `rgb(${toRgbRange(terrain.altitude)}, ${toRgbRange(terrain.altitude)}, ${toRgbRange(terrain.altitude)})`

    const withWater = terrain.altitude < 0.4 ? "#000088" : terrain.altitude < 0.5 ? "blue" : backgroundColor;

    context.fillStyle = withWater;
    context.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
}