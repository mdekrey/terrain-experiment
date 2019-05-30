import React from "react";
import { TerrainGenerator } from "../terrain-generation/TerrainGenerator";
import { Canvas } from "./canvas";
import { TerrainGrid } from "./terrain";
const pixelSize = 16;
const gameReducer = (
    { centerX = 0, centerY = 0, zoomExp = 4 },
    action: "left" | "right" | "up" | "down" | "zoomIn" | "zoomOut") => {
    const zoom = Math.pow(10, zoomExp) * 2;
    const gridSize = 1 / zoom * pixelSize;
    const moveAmount = 1 * gridSize;
    switch (action) {
        case "left":
            centerX -= moveAmount;
            break;
        case "right":
            centerX += moveAmount;
            break;
        case "up":
            centerY -= moveAmount;
            break;
        case "down":
            centerY += moveAmount;
            break;
        case "zoomIn":
            zoomExp += 1;
            break;
        case "zoomOut":
            if (zoomExp > 2) {
                zoomExp -= 1;
            }
            break;
    }
    const newZoom = Math.pow(10, zoomExp) * 2;
    const newGridSize = 1 / newZoom * pixelSize;
    centerX = Math.round(centerX / newGridSize) * newGridSize;
    centerY = Math.round(centerY / newGridSize) * newGridSize;

    return { centerX, centerY, zoomExp };
};
export function GameContainer() {
    const [{ centerX, centerY, zoomExp }, dispatch] = React.useReducer(
        gameReducer, { centerX: 0, centerY: 0, zoomExp: 4 });
    const terrainGenerator = React.useMemo(() => new TerrainGenerator(), []);
    const width = 1216;
    const height = 800;
    const zoom = Math.pow(10, zoomExp) * 2;
    const gridSize = 1 / zoom * pixelSize;
    const moveAmount = 10 * gridSize;
    return (<>
        <button onClick={() => dispatch("left")}>Left</button>
        <button onClick={() => dispatch("down")}>Down</button>
        <button onClick={() => dispatch("up")}>Up</button>
        <button onClick={() => dispatch("right")}>Right</button>
        <button onClick={() => dispatch("zoomIn")}>Zoom In</button>
        <button onClick={() => dispatch("zoomOut")} disabled={zoomExp < 3}>Zoom Out</button>
        <br />
        <span>{centerX.toFixed(zoomExp)}x{centerY.toFixed(zoomExp)}</span>
        <br />
        <Canvas width={width} height={height}>
            <TerrainGrid rows={height / pixelSize} columns={width / pixelSize} terrain={terrainGenerator} gridSize={gridSize} pixelSize={pixelSize} centerX={centerX} centerY={centerY} />
        </Canvas>
    </>);
}