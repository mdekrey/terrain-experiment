import React from "react";
import { CanvasContext } from "./CanvasContext";
import { useRenderers } from "./useRenderers";
import { useAnimationFrame } from "../useAnimationFrame";

export function Canvas({ children, ...props }: { children?: React.ReactNode } & React.HTMLProps<HTMLCanvasElement>) {
    const ref = React.useRef<HTMLCanvasElement | null>(null);
    const [renderers, context] = useRenderers();
    useAnimationFrame(React.useCallback(() => {
        if (!ref.current) {
            return;
        }
        const context = ref.current.getContext("2d");
        if (!context) {
            return;
        }
        context.imageSmoothingEnabled = false;
        for (const callback of renderers.values()) {
            callback(context);
        }
    }, [ref, renderers]));
    return (
        <canvas ref={ref} {...props}>
            <CanvasContext.Provider value={context}>
                {children}
            </CanvasContext.Provider>
        </canvas>
    );
}