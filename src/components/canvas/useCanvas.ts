import React from "react";
import { v4 as uuid } from "uuid";
import { CanvasCallback } from "./CanvasCallback";
import { CanvasContext } from "./CanvasContext";

export function useCanvas(callback: CanvasCallback) {
    const key = React.useMemo(() => uuid(), []);
    const context = React.useContext(CanvasContext);
    React.useEffect(() => {
        context.add(key, callback);
        return () => context.remove(key);
    }, [key, context, callback]);
}
