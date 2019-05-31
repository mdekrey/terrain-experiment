import React from "react";
import { useCanvas } from "./canvas";
import { useAvatarSprites } from "./renderers/useAvatarSprites";
import { Pawn, Direction } from "../game";

export function Avatar({ pawn, pixelSize, frameDelay }: { pawn: Pawn, pixelSize: number, frameDelay: number }) {
    const originalNow = React.useMemo(() => new Date().getTime(), []);
    const sprites = useAvatarSprites();
    useCanvas(React.useCallback(context => {
        // TODO - placement
        const x = 10, y = 10;
        const timer = Math.floor((new Date().getTime() - originalNow) / frameDelay) % 2;
        const key = Direction[pawn.facing] + timer;
        const sprite = sprites[key as string];
        if (sprite) {
            const p = sprite.toDrawImageParams();
            context.drawImage(p[0], p[1], p[2], p[3], p[4], x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        } else {
            const backgroundColor = "#fff";
            context.fillStyle = backgroundColor;
            context.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
    }, [pawn, pixelSize, originalNow, sprites]));
    return null;
}
