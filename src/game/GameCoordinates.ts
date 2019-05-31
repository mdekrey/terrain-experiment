export interface GameCoordinates {
    readonly x: number;
    readonly y: number;
}

export function interpolate(factor: number, { x: x1, y: y1 }: GameCoordinates, { x: x2, y: y2 }: GameCoordinates) {
    return { x: factor * (x2 - x1) + x1, y: factor * (y2 - y1) + y1  };
}