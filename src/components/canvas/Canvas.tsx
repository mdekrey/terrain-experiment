import React from "react";
import { CanvasContext } from "./CanvasContext";
import { useRenderers } from "./useRenderers";

export function Canvas({ children, ...props }: { children?: React.ReactNode } & React.HTMLProps<HTMLCanvasElement>) {
    const ref = React.useRef<HTMLCanvasElement | null>(null);
    const [renderers, context] = useRenderers();
    React.useEffect(() => {
        let request = requestAnimationFrame(renderAll);
        function renderAll() {
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
            request = requestAnimationFrame(renderAll);
        };
        return () => cancelAnimationFrame(request);
    }, [ref, renderers]);
    return (
        <canvas ref={ref} {...props}>
            <CanvasContext.Provider value={context}>
                {children}
            </CanvasContext.Provider>
        </canvas>
    );
}