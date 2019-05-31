import React from "react";
import { GameCoordinates } from "../game/GameCoordinates";

export interface IViewportContext {
    center(): GameCoordinates;
    x: number;
    y: number;
    width: number;
    height: number;
    pixelSize: number;
    gridSize: number;
}

export const ViewportContext = React.createContext<IViewportContext>({
    center: (): GameCoordinates => ({ x: 0, y: 0 }),
    x: 0,
    y: 0,
    width: 600,
    height: 400,
    pixelSize: 16,
    gridSize: 1
});

export function Viewport({ center, children, x, y, width, height, pixelSize, gridSize }: {
    center: { position(): GameCoordinates };
    x: number;
    y: number;
    width: number;
    height: number;
    pixelSize: number;
    gridSize: number;
    children?: React.ReactNode
}) {
    const result = React.useMemo((): IViewportContext => ({
        center: () => center.position(),
        x, y, width, height, pixelSize,
        gridSize
    }), [center, x, y, width, height, pixelSize, gridSize]);
    return (<ViewportContext.Provider value={result}>{children}</ViewportContext.Provider>)
}
