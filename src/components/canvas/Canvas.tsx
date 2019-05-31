import React from "react";
import { CanvasCallback } from "./CanvasCallback";
import { CanvasContext } from "./CanvasContext";

export function Canvas({ children, ...props }: { children?: React.ReactNode } & React.HTMLProps<HTMLCanvasElement>) {
    const ref = React.useRef<HTMLCanvasElement | null>(null);
    const renderers = React.useMemo(() => new Map<string, CanvasCallback>(), []);
    const context = React.useMemo((): CanvasContext => ({
        add: (key, callback) => renderers.set(key, callback),
        remove: (key) => renderers.delete(key),
    }), [renderers]);
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