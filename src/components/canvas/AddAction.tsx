import { CanvasCallback } from "./CanvasCallback";
export interface AddAction {
    action: "add";
    key: string;
    callback: CanvasCallback;
}
