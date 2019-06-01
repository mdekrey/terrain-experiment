import React from "react";
import "../game";
import { Canvas, CanvasLayer } from "./canvas";
import { TerrainGrid } from "./terrain";
import { useService } from "../injector";
import { Avatar } from "./Avatar";
import { Direction, Pawn } from "../game";
import { Viewport } from "./Viewport";
import { GameControls } from "./GameControls";

const pixelSize = 32;
export function GameContainer() {
    const zoomExp = 2;
    const terrainGenerator = useService("terrainGenerator");
    const player = useService("player");
    const width = 1200;
    const height = 800;
    const zoom = Math.pow(10, zoomExp) * 4;
    const gridSize = 1 / zoom;
    const p2 = React.useMemo(() => {
        const result = new Pawn();
        result.moveTo({ x: gridSize, y: gridSize }, Direction.Up);
        return result;
        // eslint-disable-next-line
    }, [])
    return (<>
        <br />
        <Canvas width={width} height={height}>
            <Viewport center={player} x={0} y={0} width={width} height={height}
                pixelSize={pixelSize} gridSize={gridSize}>
                <GameControls />
                <CanvasLayer>
                    <TerrainGrid
                        terrain={terrainGenerator}
                        key={zoomExp.toFixed(0)} />
                </CanvasLayer>
                <CanvasLayer>
                    <Avatar pawn={p2}
                        frameDelay={250}
                    />
                </CanvasLayer>
                <CanvasLayer>
                    <Avatar pawn={player}
                        frameDelay={250}
                    />
                </CanvasLayer>
            </Viewport>
        </Canvas>
    </>);

}
