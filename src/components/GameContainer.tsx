import React from "react";
import "../game";
import { Canvas, CanvasLayer } from "./canvas";
import { TerrainGrid } from "./terrain";
import { useService } from "../injector";
import { Avatar } from "./Avatar";
import { Direction, Pawn } from "../game";
import { Viewport } from "./Viewport";
import { GameControls } from "./GameControls";
import { CaveGrid } from "./CaveGrid";
import { useObservable } from "../rxjs";
import { GameMode } from "../game/Game";

const pixelSize = 32;
export function GameContainer() {
    const player = useService("player");
    const game = useService("game");
    const gameMode = useObservable<GameMode>(game.gameMode$, { mode: "Overworld" });
    const zoom = gameMode.mode === "Overworld"
        ? game.overworldZoom
        : game.localZoom;

    // let [cave, setCave] = React.useState<Cave>({ isSolid: [] as boolean[][], treasure: [] as GameCoordinates[], entrance: {x: 0, y: 0}})
    // React.useMemo(async () => {
    //     const gen = new CaveGenerator(50000, 50, 50, 2);
    //     const cave = await gen.cave;
    //     setCave(cave);
    // }, []);
    // React.useEffect(() => {
    //     player.moveTo({ x: cave.entrance.x * gridSize, y: cave.entrance.y * gridSize }, Direction.Down);
    // }, [cave, player])
    // const zoom = Math.pow(10, zoomExp + 2) * 4;


    const gridSize = 1 / zoom;
    const width = 1200;
    const height = 800;
    const p2 = React.useMemo(() => {
        const result = new Pawn();
        result.moveTo({ x: gridSize, y: gridSize }, Direction.Up);
        return result;
        // eslint-disable-next-line
    }, []);
    if (gameMode.mode === "Loading") {
        return <>Loading</>;
    }
    return (<>
        {gameMode.mode === "Overworld"
            ? <button onClick={() => game.enterCave()}>Enter Cave</button>
            : <button onClick={() => game.leaveCave()}>Leave Cave</button>}
        <br />
        <Canvas width={width} height={height}>
            <Viewport center={player} x={0} y={0} width={width} height={height}
                pixelSize={pixelSize} gridSize={gridSize}>
                <GameControls />
                <CanvasLayer>
                    {gameMode.mode === "Overworld"
                        ? <TerrainGrid terrain={game.terrainGenerator} />
                        : <CaveGrid {...gameMode.cave} />}
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
