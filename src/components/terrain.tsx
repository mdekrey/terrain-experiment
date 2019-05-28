import React from "react";
import { TerrainGenerator, TerrainResult } from "../terrain-generation/TerrainGenerator";
import { BiomeCategory } from "../terrain-generation/BiomeCategory";

export function Terrain() {
    const terrainGenerator = React.useMemo(() => new TerrainGenerator(), []);
    return <TerrainGrid rows={40 * 5} columns={60 * 5} terrain={terrainGenerator} gridSize={0.01} />
}

export function TerrainGrid({ rows, columns, terrain, gridSize }: { gridSize: number, rows: number, columns: number, terrain: TerrainGenerator }) {
    return <div style={{display: "inline-grid", gridAutoColumns:"auto", gridAutoRows:"auto"}}>
        {Array.from(Array(rows).keys()).map(row =>
        Array.from(Array(columns).keys()).map(column =>
            <TerrainSpot key={`${row}x${column}`} style={{ gridRowStart:row+1, gridColumnStart: column+1 }} terrain={terrain.getTerrain(row * gridSize, column * gridSize)}></TerrainSpot>
        )
            )}
    </div>
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

export function TerrainSpot({ terrain, style, ...props }: { terrain: TerrainResult } & React.HTMLProps<HTMLDivElement>) {
    return <div {...props} style={{ overflow: "hidden", height: "3px", width: "3px", backgroundColor: color[terrain.biomeCategory], ...style }}></div>
}