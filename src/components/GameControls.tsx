import React from "react";
import { useSubscription } from "../rxjs";
import { useCommand, ContinuousContext } from "./keymap";
import { useService } from "../injector";
import { ViewportContext } from "./Viewport";
import { Direction } from "../game";
import { useAnimationFrame } from "./useAnimationFrame";

export function GameControls() {
    const player = useService("player");
    const game = useService("game");
    const { gridSize } = React.useContext(ViewportContext);
    const currentContinuous = React.useContext(ContinuousContext);

    useAnimationFrame(React.useCallback(() => {
        if (!player.isDoneMoving()) {
            return;
        }
        const moveAmount = 1 * gridSize;
        let { x: centerX, y: centerY } = player.position();
        let facing = Direction.Down;
        switch (Array.from(currentContinuous.values()).filter(k => k.startsWith("MOVE_"))[0]) {
            case "MOVE_LEFT":
                centerX -= moveAmount;
                facing = Direction.Left;
                break;
            case "MOVE_RIGHT":
                centerX += moveAmount;
                facing = Direction.Right;
                break;
            case "MOVE_UP":
                centerY -= moveAmount;
                facing = Direction.Up;
                break;
            case "MOVE_DOWN":
                centerY += moveAmount;
                facing = Direction.Down;
                break;
            default:
                return;
        }
        player.moveTo({ x: centerX, y: centerY }, facing, 10);
    }, [player, gridSize, currentContinuous]));

    useSubscription(useCommand("ACTIVATE"), React.useCallback(() => {
        switch (game.gameMode$.value.mode) {
            case "Overworld":
                game.enterCave();
                break;
            case "Cave":
                game.leaveCave();
                break;
        }
    }, [game]));

    return null;
}
