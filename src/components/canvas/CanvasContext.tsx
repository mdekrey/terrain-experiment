import React from "react";

import { CanvasCallback } from "./CanvasCallback";
export interface CanvasContext {
    add: (key: string, callback: CanvasCallback) => void;
    remove: (key: string) => void;
}

export const CanvasContext = React.createContext<CanvasContext>({ add: () => { }, remove: () => { } });
