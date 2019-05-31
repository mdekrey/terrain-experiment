import React from "react";
import { TerrainCache, TerrainGenerator } from "../terrain-generation";
import { useCanvas } from "./canvas";
import { useTerrainSprites } from "./renderers/useTerrainSprites";
import { renderTerrainSpot } from "./renderers/renderTerrainSpot";
import { ViewportContext } from "./Viewport";

function* coordinates(startX: number, startY: number, endX: number, endY: number, gridSize: number) {
    const columns = (endX - startX) / gridSize;
    const rows = (endY - startY) / gridSize;
    // console.log(columns, rows);

    // return;
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            yield { screenX: x, screenY: y, terrainX: x * gridSize + startX, terrainY: y * gridSize + startY }
        }
    }
}

export function TerrainGrid(props: { terrain: TerrainGenerator }) {
    const { terrain } = props;
    const { x, y, width, height, center , pixelSize, gridSize} = React.useContext(ViewportContext);
    const terrainCache = React.useMemo(() => new TerrainCache(terrain), [terrain]);
    const sprites = useTerrainSprites();
    const gridWidth = width / pixelSize;
    const gridHeight = height / pixelSize;
    // console.log(gridWidth, gridHeight);

    useCanvas(React.useCallback(context => {
        const { x: centerX, y: centerY } = center();
        const leftX = centerX / gridSize - gridWidth / 2;
        const offsetX = Math.floor(leftX) - leftX;
        const topY = centerY / gridSize - gridHeight / 2;
        const offsetY = Math.floor(topY) - topY;
        const startX = Math.floor(leftX) * gridSize;
        const startY = Math.floor(topY) * gridSize;
        const endX = Math.ceil(leftX + gridWidth) * gridSize;
        const endY = Math.ceil(topY + gridHeight) * gridSize;

        // console.log(startX, startY, endX, endY);
        for (const { screenX, screenY, terrainX, terrainY } of coordinates(startX, startY, endX, endY, gridSize)) {
            const terrain = terrainCache.getAt(terrainX, terrainY);
            renderTerrainSpot({ x: x + screenX + offsetX, y: y + screenY + offsetY, pixelSize, context, terrain, sprites });
        }
    }, [pixelSize, center, gridSize, sprites, terrainCache, x, y, gridWidth, gridHeight]));
    return null;
}
