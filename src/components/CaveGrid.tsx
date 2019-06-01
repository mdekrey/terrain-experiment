import React from "react";
import { useCanvas } from "./canvas";
import { ViewportContext } from "./Viewport";
import { useCaveSprites, renderCaveSpot } from "./renderers/renderCaveSpot";
import { Cave } from "../cave-generation";

function* coordinates(startX: number, startY: number, endX: number, endY: number) {
    const columns = (endX - startX);
    const rows = (endY - startY);

    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            yield { screenX: x, screenY: y, caveX: x + startX, caveY: y + startY }
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
        const leftX = (centerX - cave.offset.x) / gridSize - gridWidth / 2;
        const offsetX = Math.floor(leftX) - leftX;
        const topY = (centerY - cave.offset.y) / gridSize - gridHeight / 2;
        const offsetY = Math.floor(topY) - topY;
        const startX = Math.floor(leftX);
        const startY = Math.floor(topY);
        const endX = Math.ceil(leftX + gridWidth);
        const endY = Math.ceil(topY + gridHeight);

        for (const { screenX, screenY, caveX, caveY } of coordinates(startX, startY, endX, endY)) {
            renderCaveSpot({ screenX: x + screenX + offsetX, screenY: y + screenY + offsetY, pixelSize, context, cave, sprites, caveX, caveY });
        }
    }, [pixelSize, center, gridSize, sprites, cave, x, y, gridWidth, gridHeight]));
    return null;
}
