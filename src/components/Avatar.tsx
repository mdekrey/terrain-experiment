import React from "react";
import { useCanvas } from "./canvas";
import { useAvatarSprites } from "./renderers/useAvatarSprites";
import { Pawn, Direction } from "../game";
import { ViewportContext } from "./Viewport";

export function Avatar({ pawn, frameDelay }: { pawn: Pawn, frameDelay: number }) {
    const originalNow = React.useMemo(() => Date.now(), []);
    const sprites = useAvatarSprites();
    const { x, y, width, height, center, pixelSize, gridSize } = React.useContext(ViewportContext);
    const screenCenterX = x + (width / 2);
    const screenCenterY = y + (height / 2);

    useCanvas(React.useCallback(context => {
        const pawnPosition = pawn.position();
        const worldPosition = center();
        const x = (pawnPosition.x - worldPosition.x) / gridSize, y = (pawnPosition.y - worldPosition.y) / gridSize;
        const timer = Math.floor((Date.now() - originalNow) / frameDelay) % 2;
        const key = Direction[pawn.facing] + timer;
        const sprite = sprites[key as string];
        if (sprite) {
            const p = sprite.toDrawImageParams();
            context.drawImage(p[0], p[1], p[2], p[3], p[4], x * pixelSize + screenCenterX, y * pixelSize + screenCenterY, pixelSize, pixelSize);
        } else {
            const backgroundColor = "#fff";
            context.fillStyle = backgroundColor;
            context.fillRect(x * pixelSize + screenCenterX, y * pixelSize + screenCenterY, pixelSize, pixelSize);
        }
    }, [pawn, pixelSize, originalNow, sprites, frameDelay, gridSize, center, screenCenterX, screenCenterY]));
    return null;
}
