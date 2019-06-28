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
        const moveAmount = 1 / zoomFactor;
        let { x: centerX, y: centerY } = player.position();
        let facing = Direction.Down;
        switch (Array.from(currentContinuous.values()).filter(k => k.startsWith("MOVE_")).reverse()[0]) {
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
        game.movePlayerTo({ x: centerX, y: centerY }, facing);
    }, [player, zoomFactor, currentContinuous, game]));

    useSubscription(useCommand("ACTIVATE"), React.useCallback(() => {
        switch (game.gameMode$.value.mode) {
            case "Overworld":
                game.enterDetail();
                break;
            case "Detail":
            case "Cave":
                game.moveToOverworld();
                break;
        }
    }, [game]));

    return null;
}
