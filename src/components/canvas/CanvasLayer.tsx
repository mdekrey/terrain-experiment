import React from "react";
import { CanvasContext } from "./CanvasContext";
import { useCanvas } from "./useCanvas";
import { useRenderers } from "./useRenderers";

export function CanvasLayer({ children }: { children?: React.ReactNode }) {
    const [renderers, context] = useRenderers();

    useCanvas(React.useCallback(context => {
        for (const renderer of renderers.values()) {
            renderer(context);
        }
    }, [renderers]));

    return (
        <CanvasContext.Provider value={context}>
            {children}
        </CanvasContext.Provider>
    );
}