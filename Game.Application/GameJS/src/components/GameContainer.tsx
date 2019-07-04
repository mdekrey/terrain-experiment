import React from "react";
import { Canvas, CanvasLayer } from "./canvas";
import { TerrainGrid } from "./terrain";
import { useService } from "../injector";
import { Avatar } from "./Avatar";
import { Viewport } from "./Viewport";
import { GameControls } from "./GameControls";
import { CaveGrid } from "./CaveGrid";
import { useObservable } from "../rxjs";
import { GameModes } from "../game";
import { useWindowSize } from "./useWindowSize";
import { subscribeOn } from "rxjs/operators";
import { animationFrameScheduler } from "rxjs";

export function GameContainer() {
    const player = useService("player");
    const game = useService("game");
    const gameMode$ = React.useMemo(() => game.gameMode$.pipe(subscribeOn(animationFrameScheduler)), [game.gameMode$]);
    const gameMode = useObservable(gameMode$, GameModes.Overworld());
    const { width, height } = useWindowSize({ width: 1200, height: 800 });
    const pixelSize = Math.max(1, Math.floor(Math.sqrt(width * height) / 16 / 20)) * 16;
    const zoomFactor = game.getZoomFactor();

    let gameModeJsx: JSX.Element;
    if (gameMode.mode === "Loading") {
        return <>Loading</>;
    }
    switch (gameMode.mode) {
        case "Overworld":
            gameModeJsx = <TerrainGrid detail={false} />;
            break;
        case "Detail":
            gameModeJsx = <TerrainGrid detail={true} />;
            break;
        case "Cave":
            gameModeJsx = <CaveGrid {...gameMode.cave} />;
            break;
        default:
            return <>Unknown state</>;
    }
    return (<>
        <Canvas width={width} height={height}>
            <Viewport center={player.position} x={0} y={0} width={width} height={height}
                pixelSize={pixelSize}>
                <GameControls />
                <CanvasLayer>
                    {gameModeJsx}
                </CanvasLayer>
                <CanvasLayer>
                    {/* TODO - need an "avatars" display for this */}
                    {game.otherPlayers.map((p, i) =>
                        <Avatar zoomFactor={zoomFactor} key={i} pawn={p} frameDelay={250} />
                    )}
                </CanvasLayer>
                <CanvasLayer>
                    <Avatar zoomFactor={zoomFactor} pawn={player} frameDelay={250} />
                </CanvasLayer>
            </Viewport>
        </Canvas>
    </>);
}
