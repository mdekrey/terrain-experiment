import React from "react";
import { CanvasCallback } from "./CanvasCallback";
import { CanvasContext } from "./CanvasContext";

export function useRenderers(): [Map<string, CanvasCallback>, CanvasContext] {
    const renderers = React.useMemo(() => new Map<string, CanvasCallback>(), []);
    const context = React.useMemo((): CanvasContext => ({
        add: (key, callback) => renderers.set(key, callback),
        remove: (key) => renderers.delete(key),
    }), [renderers]);
    return [renderers, context];
}
