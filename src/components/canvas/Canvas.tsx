import React from "react";
import { CanvasCallback } from "./CanvasCallback";
import { AddAction } from "./AddAction";
import { RemoveAction } from "./RemoveAction";
import { CanvasContext } from "./CanvasContext";

export function Canvas({ children, ...props }: { children?: React.ReactNode } & React.HTMLProps<HTMLCanvasElement>) {
    const ref = React.useRef<HTMLCanvasElement | null>(null);
    const [renderer, dispatch] = React.useReducer(function ({ renderers }: { renderers: Map<string, CanvasCallback> }, action: AddAction | RemoveAction) {
        if (action.action === 'add') {
            renderers.set(action.key, action.callback);
        } else {
            renderers.delete(action.key);
        }
        return { renderers };
    }, { renderers: new Map<string, CanvasCallback>() });
    const context = React.useMemo((): CanvasContext => ({
        add: (key, callback) => dispatch({ action: "add", key, callback }),
        remove: (key) => dispatch({ action: "remove", key }),
    }), [dispatch]);
    React.useEffect(() => {
        if (!ref.current) {
            return;
        }
        const context = ref.current.getContext("2d");
        if (!context) {
            return;
        }
        for (const callback of renderer.renderers.values()) {
            callback(context);
        }
    }, [ref, renderer]);
    return (
        <canvas ref={ref} {...props}>
            <CanvasContext.Provider value={context}>
                {children}
            </CanvasContext.Provider>
        </canvas>
    );
}