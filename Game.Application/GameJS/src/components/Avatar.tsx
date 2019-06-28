import React from "react";
import { useCanvas } from "./canvas";
import { useAvatarSprites } from "./renderers/useAvatarSprites";
import { Pawn } from "../game";
import { ViewportContext } from "./Viewport";
import { useService } from "../injector";

export function Avatar({ pawn, frameDelay }: { pawn: Pawn, frameDelay: number }) {
    const originalNow = React.useMemo(() => Date.now(), []);
    const sprites = useAvatarSprites(pawn.type);
    const { x, y, width, height, center, pixelSize } = React.useContext(ViewportContext);
    const screenCenterX = x + (width / 2);
    const screenCenterY = y + (height / 2);
    const game = useService("game");
    const zoomFactor = game.getZoomFactor();

    useCanvas(React.useCallback(context => {
        const pawnPosition = pawn.position();
        const worldPosition = center();
        const x = (pawnPosition.x - worldPosition.x) * zoomFactor, y = (pawnPosition.y - worldPosition.y) * zoomFactor;
        const timer = Math.floor((Date.now() - originalNow) / frameDelay) % 2;
        const sprite = sprites[pawn.facing];
        sprite.render(timer, context, x * pixelSize + screenCenterX, y * pixelSize + screenCenterY, pixelSize, pixelSize);
    }, [pawn, pixelSize, originalNow, sprites, frameDelay, zoomFactor, center, screenCenterX, screenCenterY]));
    return null;
}
