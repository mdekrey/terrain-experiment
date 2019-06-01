import React from "react";
import "../game";
import { Canvas, CanvasLayer } from "./canvas";
import { TerrainGrid } from "./terrain";
import { useService } from "../injector";
import { Avatar } from "./Avatar";
import { Direction, Pawn } from "../game";
import { Viewport } from "./Viewport";
import { GameControls } from "./GameControls";
import { Cave, CaveGenerator } from "../cave-generation";
import { GameCoordinates } from "../game/GameCoordinates";
import { CaveGrid } from "./CaveGrid";

const pixelSize = 32;
export function GameContainer() {
    const player = useService("player");

    const zoomExp = 2;
    // const terrainGenerator = useService("terrainGenerator");
    // const zoom = Math.pow(10, zoomExp) * 4;
    // const gridSize = 1 / zoom;

    let [cave, setCave] = React.useState<Cave>({ isSolid: [] as boolean[][], treasure: [] as GameCoordinates[], entrance: {x: 0, y: 0}})
    React.useMemo(async () => {
        const gen = new CaveGenerator(50000, 50, 50, 2);
        const cave = await gen.cave;
        setCave(cave);
    }, []);
    React.useEffect(() => {
        player.moveTo(cave.entrance, Direction.Down);
    }, [cave, player])
    const gridSize = 1;

    const width = 1200;
    const height = 800;
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
                    {/* <TerrainGrid
                        terrain={terrainGenerator}
                        key={zoomExp.toFixed(0)} /> */}
                    <CaveGrid {...cave}
                        />
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
