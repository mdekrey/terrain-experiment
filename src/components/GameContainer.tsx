import React from "react";
import "../game";
import { Canvas, CanvasLayer } from "./canvas";
import { TerrainGrid } from "./terrain";
import { useSubscription } from "../rxjs";
import { useCommand } from "./keymap";
import { useService } from "../injector";
import { Avatar } from "./Avatar";
import { Direction } from "../game";

const pixelSize = 32;
export function GameContainer() {
    const zoomExp = 2;
    const terrainGenerator = useService("terrainGenerator");
    const player = useService("player");
    const width = 1216;
    const height = 800;
    const zoom = Math.pow(10, zoomExp) * 4;
    const gridSize = 1 / zoom;
    const dispatch = React.useCallback(
        function (action: "left" | "right" | "up" | "down") {
            if (!player.isDoneMoving()) {
                return;
            }
            const moveAmount = 1 * gridSize;

            let { x: centerX, y: centerY } = player.center();
            let facing = Direction.Down;
            switch (action) {
                case "left":
                    centerX -= moveAmount;
                    facing = Direction.Left;
                    break;
                case "right":
                    centerX += moveAmount;
                    facing = Direction.Right;
                    break;
                case "up":
                    centerY -= moveAmount;
                    facing = Direction.Up;
                    break;
                case "down":
                    centerY += moveAmount;
                    facing = Direction.Down;
                    break;
            }
            player.moveTo({ x: centerX, y: centerY }, 500, facing);
        }, [player, gridSize])
    useSubscription(useCommand("MOVE_LEFT"), React.useCallback(() => dispatch("left"), [dispatch]));
    useSubscription(useCommand("MOVE_RIGHT"), React.useCallback(() => dispatch("right"), [dispatch]));
    useSubscription(useCommand("MOVE_UP"), React.useCallback(() => dispatch("up"), [dispatch]));
    useSubscription(useCommand("MOVE_DOWN"), React.useCallback(() => dispatch("down"), [dispatch]));
    const getCenter = React.useCallback(() => player.center(), [player]);
    return (<>
        <button onClick={() => dispatch("left")}>Left</button>
        <button onClick={() => dispatch("down")}>Down</button>
        <button onClick={() => dispatch("up")}>Up</button>
        <button onClick={() => dispatch("right")}>Right</button>
        <br />
        <Canvas width={width} height={height}>
            <CanvasLayer>
                <TerrainGrid x={0} y={0} width={width} height={height}
                            terrain={terrainGenerator}
                            gridSize={gridSize}
                            pixelSize={pixelSize}
                            center={getCenter}
                            key={zoomExp.toFixed(0)}/>
            </CanvasLayer>
            <Avatar pawn={player}
                            pixelSize={pixelSize}
                            frameDelay={250}
                            />
        </Canvas>
    </>);

}
