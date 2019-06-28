import React from "react";
import { GameCoordinates } from "../game/GameCoordinates";

export interface IViewportContext {
    center(): GameCoordinates;
    x: number;
    y: number;
    width: number;
    height: number;
    pixelSize: number;
}

export const ViewportContext = React.createContext<IViewportContext>({
    center: (): GameCoordinates => ({ x: 0, y: 0 }),
    x: 0,
    y: 0,
    width: 600,
    height: 400,
    pixelSize: 16
});

export function Viewport({ center, children, x, y, width, height, pixelSize }: {
    center: { position(): GameCoordinates };
    x: number;
    y: number;
    width: number;
    height: number;
    pixelSize: number;
    children?: React.ReactNode
}) {
    const result = React.useMemo((): IViewportContext => ({
        center: () => center.position(),
        x, y, width, height, pixelSize
    }), [center, x, y, width, height, pixelSize]);
    return (<ViewportContext.Provider value={result}>{children}</ViewportContext.Provider>)
}
