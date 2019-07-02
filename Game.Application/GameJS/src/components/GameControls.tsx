import React from "react";
import { useSubscription } from "../rxjs";
import { useCommand, ContinuousContext } from "./keymap";
import { useService } from "../injector";
import { Direction } from "../game";
import { useAnimationFrame } from "./useAnimationFrame";

export function GameControls() {
    const player = useService("player");
    const game = useService("game");
    const zoomFactor = game.getZoomFactor();
    const currentContinuous = React.useContext(ContinuousContext);

    useAnimationFrame(React.useCallback(() => {
        if (!player.isDoneMoving()) {
            return;
        }
        let { x: centerX, y: centerY } = player.position();
        centerX *= zoomFactor;
        centerY *= zoomFactor;
        let facing = Direction.Down;
        switch (Array.from(currentContinuous.values()).filter(k => k.startsWith("MOVE_")).reverse()[0]) {
            case "MOVE_LEFT":
                centerX -= 1;
                facing = Direction.Left;
                break;
            case "MOVE_RIGHT":
                centerX += 1;
                facing = Direction.Right;
                break;
            case "MOVE_UP":
                centerY -= 1;
                facing = Direction.Up;
                break;
            case "MOVE_DOWN":
                centerY += 1;
                facing = Direction.Down;
                break;
            default:
                return;
        }
        centerX = Math.round(centerX);
        centerY = Math.round(centerY);
        game.movePlayerTo({ x: centerX / zoomFactor, y: centerY / zoomFactor }, facing);
    }, [player, zoomFactor, currentContinuous, game]));

    useSubscription(useCommand("ACTIVATE"), React.useCallback(() => {
        switch (game.gameMode$.value.mode) {
            case "Overworld":
                game.enterDetail();
                break;
            case "Detail":
                game.moveToOverworldOrCave();
                break;
            case "Cave":
                game.exitCave();
                break;
        }
    }, [game]));

    return null;
}
