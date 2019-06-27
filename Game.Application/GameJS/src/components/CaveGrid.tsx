import React from "react";
import { useCanvas } from "./canvas";
import { ViewportContext } from "./Viewport";
import { useCaveSprites, getCaveSpotRenderer, CaveSpotType, getCaveSpotLoader } from "./renderers/renderCaveSpot";
import { Cave } from "../cave-generation";
import { TileCache } from "./renderers/TileCache";

function* coordinates(startX: number, startY: number, endX: number, endY: number, step: number) {
    const gridStartX = Math.floor(startX / step) * step;
    const gridStartY = Math.floor(startY / step) * step;
    const gridEndX = Math.ceil(endX / step) * step;
    const gridEndY = Math.ceil(endY / step) * step;

    const columns = (gridEndX - gridStartX);
    const rows = (gridEndY - gridStartY);

    for (let x = 0; x < columns; x+=step) {
        for (let y = 0; y < rows; y+=step) {
            yield { screenX: x, screenY: y, caveX: x + startX, caveY: y + startY }
        }
    }
}

export function CaveGrid(cave: Cave) {
    const { x, y, width, height, center , pixelSize, gridSize} = React.useContext(ViewportContext);
    const sprites = useCaveSprites();
    const gridWidth = width / pixelSize;
    const gridHeight = height / pixelSize;
    const tileCache = React.useMemo(() => new TileCache<CaveSpotType[]>(getCaveSpotLoader(cave),
        1, pixelSize, () => !Object.values(sprites).some(s => !s.isFinal), x, y, getCaveSpotRenderer(cave, sprites)),
        [cave, pixelSize, sprites, x, y]
    );

    useCanvas(React.useCallback(context => {
        const { x: centerX, y: centerY } = center();
        const leftX = (centerX - cave.offset.x) / gridSize - gridWidth / 2;
        const topY = (centerY - cave.offset.y) / gridSize - gridHeight / 2;
        const tileCountStartX = Math.floor(leftX / tileCache.tileStep) * tileCache.tileStep;
        const tileCountStartY = Math.floor(topY / tileCache.tileStep) * tileCache.tileStep;
        const startX = tileCountStartX;
        const startY = tileCountStartY;
        const offsetX = tileCountStartX - leftX;
        const offsetY = tileCountStartY - topY;
        const endX = Math.ceil(leftX + gridWidth);
        const endY = Math.ceil(topY + gridHeight);

        for (const { screenX, screenY, caveX, caveY } of coordinates(startX, startY, endX, endY, tileCache.tileStep)) {
            tileCache.render(context, { screenX, screenY, terrainX: caveX, terrainY: caveY, offsetX, offsetY });
        }
        tileCache.incrementUseCountAndCull();
    }, [center, gridSize, gridWidth, gridHeight, tileCache, cave]));
    return null;
}
