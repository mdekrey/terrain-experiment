import React from "react";
import { useCanvas } from "./canvas";
import { ViewportContext } from "./Viewport";
import { useCaveSprites, renderCaveSpot } from "./renderers/renderCaveSpot";
import { Cave } from "../cave-generation";

function* coordinates(startX: number, startY: number, endX: number, endY: number, gridSize: number) {
    const columns = (endX - startX) / gridSize;
    const rows = (endY - startY) / gridSize;

    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            yield { screenX: x, screenY: y, caveX: x * gridSize + startX, caveY: y * gridSize + startY }
        }
    }
}

export function CaveGrid(cave: Cave) {
    const { x, y, width, height, center , pixelSize, gridSize} = React.useContext(ViewportContext);
    const sprites = useCaveSprites();
    const gridWidth = width / pixelSize;
    const gridHeight = height / pixelSize;

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

        for (const { screenX, screenY, caveX, caveY } of coordinates(startX, startY, endX, endY, gridSize)) {
            renderCaveSpot({ screenX: x + screenX + offsetX, screenY: y + screenY + offsetY, pixelSize, context, cave, sprites, caveX, caveY });
        }
    }, [pixelSize, center, gridSize, sprites, cave, x, y, gridWidth, gridHeight]));
    return null;
}
