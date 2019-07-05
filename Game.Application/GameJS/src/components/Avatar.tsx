import React from "react";
import { useCanvas } from "./canvas";
import { useAvatarSprites } from "./renderers/useAvatarSprites";
import { Pawn } from "../game";
import { ViewportContext } from "./Viewport";
import { renderAvatar } from "./renderAvatar";

export function Avatar({ pawn, frameDelay, zoomFactor }: { pawn: Pawn, frameDelay: number, zoomFactor: number }) {
    const sprites = useAvatarSprites(pawn.type);
    const viewportContext = React.useContext(ViewportContext);

    useCanvas(React.useCallback(context => renderAvatar({
        context,
        pawn,
        sprites,
        frameDelay,
        zoomFactor,
        viewportContext
    }), [pawn, sprites, frameDelay, zoomFactor, viewportContext]));
    return null;
}
