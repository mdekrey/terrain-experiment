export interface GameCoordinates {
    readonly x: number;
    readonly y: number;
}

export function interpolate(factor: number, { x: x1, y: y1 }: GameCoordinates, { x: x2, y: y2 }: GameCoordinates) {
    return { x: factor * (x2 - x1) + x1, y: factor * (y2 - y1) + y1  };
}

export function addCoordinates({ x: x1, y: y1 }: GameCoordinates, { x: x2, y: y2 }: GameCoordinates) {
    return { x: x1 + x2, y: y1 + y2 };
}

export function coordinatesEqual({ x: x1, y: y1 }: GameCoordinates, { x: x2, y: y2 }: GameCoordinates) {
    return x1 === x2 && y1 === y2;
}

export const eightDirections = Object.freeze([
    { x: -1, y: -1 },
    { x: -1, y: 0 },
    { x: -1, y: 1 },
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: 1, y: -1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
].map(e => Object.freeze(e)));

export const fourDirections = Object.freeze([
    { x: -1, y: 0 },
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: 1, y: 0 },
].map(e => Object.freeze(e)));
