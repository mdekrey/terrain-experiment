import React from "react";
import "../game";
import { Canvas, CanvasLayer } from "./canvas";
import { TerrainGrid } from "./terrain";
import { useService } from "../injector";
import { Avatar } from "./Avatar";
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

    const gridSize = 1 / zoom;
    const width = 1200;
    const height = 800;
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
                    {/* TODO - need an "avatars" display for this */}
                    {game.otherPlayers.map((p, i) =>
                    <Avatar key={i} pawn={p} frameDelay={250} />
                    )}
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
