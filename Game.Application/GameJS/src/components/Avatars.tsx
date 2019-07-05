import React from "react";
import { useCanvas } from "./canvas";
import { useAvatarSprites } from "./renderers/useAvatarSprites";
import { Pawn, PawnType } from "../game";
import { ViewportContext } from "./Viewport";
import { renderAvatar } from "./renderAvatar";

export function Avatars({ pawns, frameDelay, zoomFactor }: { pawns: Record<string, Pawn>, frameDelay: number, zoomFactor: number }) {
    const sprites = useAvatarSprites(PawnType.MaleWizard);
    const viewportContext = React.useContext(ViewportContext);

    useCanvas(React.useCallback(context => {
        for (const characterId in pawns) {
            if (pawns.hasOwnProperty(characterId)) {
                const pawn = pawns[characterId];
                renderAvatar({
                    context,
                    pawn,
                    sprites,
                    frameDelay,
                    zoomFactor,
                    viewportContext
                });
            }
        }
    }, [pawns, sprites, frameDelay, zoomFactor, viewportContext]));
    return null;
}
