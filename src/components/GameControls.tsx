import React from "react";
import { useSubscription } from "../rxjs";
import { useCommand } from "./keymap";
import { useService } from "../injector";
import { ViewportContext } from "./Viewport";
import { Direction } from "../game";

export function GameControls() {
    const player = useService("player");
    const { gridSize } = React.useContext(ViewportContext);

    const dispatch = React.useCallback(
        function (action: "left" | "right" | "up" | "down") {
            if (!player.isDoneMoving()) {
                return;
            }
            const moveAmount = 1 * gridSize;

            let { x: centerX, y: centerY } = player.position();
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
            player.moveTo({ x: centerX, y: centerY }, facing, 250);
        }, [player, gridSize])
    useSubscription(useCommand("MOVE_LEFT"), React.useCallback(() => dispatch("left"), [dispatch]));
    useSubscription(useCommand("MOVE_RIGHT"), React.useCallback(() => dispatch("right"), [dispatch]));
    useSubscription(useCommand("MOVE_UP"), React.useCallback(() => dispatch("up"), [dispatch]));
    useSubscription(useCommand("MOVE_DOWN"), React.useCallback(() => dispatch("down"), [dispatch]));

    return <>
        <button onClick={() => dispatch("left")}>Left</button>
        <button onClick={() => dispatch("down")}>Down</button>
        <button onClick={() => dispatch("up")}>Up</button>
        <button onClick={() => dispatch("right")}>Right</button>
    </>;
}
