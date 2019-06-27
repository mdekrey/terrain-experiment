import React from "react";
import { useCanvas } from "./canvas";
import { useTerrainSprites } from "./renderers/useTerrainSprites";
import { ViewportContext } from "./Viewport";
import { TileCache } from "./renderers/TileCache";
import { getTerrainSpotRenderer } from "./renderers/renderTerrainSpot";
import { useService } from "../injector";

function* coordinates(startX: number, startY: number, endX: number, endY: number, gridSize: number, step: number) {
    const gridStartX = Math.floor(startX / gridSize / step) * step;
    const gridStartY = Math.floor(startY / gridSize / step) * step;
    const gridEndX = Math.ceil(endX / gridSize / step) * step;
    const gridEndY = Math.ceil(endY / gridSize / step) * step;
    const columns = (gridEndX - gridStartX);
    const rows = (gridEndY - gridStartY);
    for (let x = 0; x < columns; x += step) {
        for (let y = 0; y < rows; y += step) {
            yield { screenX: x, screenY: y, terrainX: x * gridSize + startX, terrainY: y * gridSize + startY }
        }
    }
}

export function TerrainGrid(props: { detail: boolean }) {
    const { detail } = props;
    const { x, y, width, height, center, pixelSize, gridSize } = React.useContext(ViewportContext);
    const terrainCache = useService("terrainCache");
    const sprites = useTerrainSprites();
    const tileCache = React.useMemo(() => new TileCache(terrainCache.getBlock(detail),
        gridSize, pixelSize, () => !Object.values(sprites).some(s => !s.isFinal), x, y, getTerrainSpotRenderer(terrainCache, sprites, detail)),
        [terrainCache, gridSize, pixelSize, sprites, x, y, detail]
    );
    const gridWidth = width / pixelSize;
    const gridHeight = height / pixelSize;

    useCanvas(React.useCallback(context => {
        const { x: centerX, y: centerY } = center();
        const leftX = x + centerX / gridSize - gridWidth / 2;
        const topY = y + centerY / gridSize - gridHeight / 2;
        const tileCountStartX = Math.floor(leftX / tileCache.tileStep) * tileCache.tileStep;
        const tileCountStartY = Math.floor(topY / tileCache.tileStep) * tileCache.tileStep;
        const startX = tileCountStartX * gridSize;
        const startY = tileCountStartY * gridSize;
        const offsetX = tileCountStartX - leftX;
        const offsetY = tileCountStartY - topY;
        const endX = Math.ceil(leftX + gridWidth) * gridSize;
        const endY = Math.ceil(topY + gridHeight) * gridSize;

        for (const { screenX, screenY, terrainX, terrainY } of coordinates(startX, startY, endX, endY, gridSize, tileCache.tileStep)) {
            tileCache.render(context, { screenX, screenY, terrainX, terrainY, offsetX, offsetY });
        }
        tileCache.incrementUseCountAndCull();
    }, [center, gridSize, x, y, gridWidth, gridHeight, tileCache]));
    return null;
}
