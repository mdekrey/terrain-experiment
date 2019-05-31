import React from "react";
import "../game";
import { Canvas, CanvasLayer } from "./canvas";
import { TerrainGrid } from "./terrain";
import { useSubscription } from "../rxjs";
import { useCommand } from "./keymap";
import { useService } from "../injector";

const pixelSize = 32;
const gameReducer = (
    { centerX = 0, centerY = 0, zoomExp = 4 },
    action: "left" | "right" | "up" | "down" | "zoomIn" | "zoomOut") => {
    const zoom = Math.pow(10, zoomExp);
    const gridSize = 1 / zoom;
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
            if (zoomExp > 1) {
                zoomExp -= 1;
            }
            break;
    }
    const newZoom = Math.pow(10, zoomExp);
    const newGridSize = 1 / newZoom;
    centerX = Math.round(centerX / newGridSize) * newGridSize;
    centerY = Math.round(centerY / newGridSize) * newGridSize;

    return { centerX, centerY, zoomExp };
};
export function GameContainer() {
    const [{ centerX, centerY, zoomExp }, dispatch] = React.useReducer(
        gameReducer, { centerX: 0, centerY: 0, zoomExp: 4 });
    const terrainGenerator = useService("terrainGenerator");
    const width = 1216;
    const height = 800;
    const zoom = Math.pow(10, zoomExp);
    const gridSize = 1 / zoom;
    useSubscription(useCommand("MOVE_LEFT"), React.useCallback(() => dispatch("left"), []));
    useSubscription(useCommand("MOVE_RIGHT"), React.useCallback(() => dispatch("right"), []));
    useSubscription(useCommand("MOVE_UP"), React.useCallback(() => dispatch("up"), []));
    useSubscription(useCommand("MOVE_DOWN"), React.useCallback(() => dispatch("down"), []));
    return (<>
        <button onClick={() => dispatch("left")}>Left</button>
        <button onClick={() => dispatch("down")}>Down</button>
        <button onClick={() => dispatch("up")}>Up</button>
        <button onClick={() => dispatch("right")}>Right</button>
        <button onClick={() => dispatch("zoomIn")}>Zoom In</button>
        <button onClick={() => dispatch("zoomOut")} disabled={zoomExp < 2}>Zoom Out</button>
        <br />
        <span>{centerX.toFixed(zoomExp)}x{centerY.toFixed(zoomExp)}</span>
        <br />
        <Canvas width={width} height={height}>
            <CanvasLayer>
                <TerrainGrid rows={height / pixelSize}
                            columns={width / pixelSize}
                            terrain={terrainGenerator}
                            gridSize={gridSize}
                            pixelSize={pixelSize}
                            centerX={centerX}
                            centerY={centerY}
                            key={zoomExp.toFixed(0)}/>
            </CanvasLayer>
        </Canvas>
    </>);
}
