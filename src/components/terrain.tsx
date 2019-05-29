import React, { useEffect } from "react";
import { TerrainGenerator, TerrainResult } from "../terrain-generation/TerrainGenerator";
import { BiomeCategory } from "../terrain-generation/BiomeCategory";
import { v4 as uuid } from "uuid";

const px = "15px";

export function Terrain() {
    const terrainGenerator = React.useMemo(() => new TerrainGenerator(), []);
    return <TerrainGrid rows={40} columns={60} terrain={terrainGenerator} gridSize={0.001} />
}

type CanvasCallback = (canvas: CanvasRenderingContext2D) => void;
type CanvasCallbackEntry = { callback: CanvasCallback, key: string };
interface CanvasContext {
    add: (key: string, callback: CanvasCallback) => void;
    remove: (key: string) => void;
}
interface AddAction {
    action: "add";
    key: string;
    callback: CanvasCallback;
}
interface RemoveAction {
    action: "remove";
    key: string;
}

const canvasContext = React.createContext<CanvasContext>({ add: () => { }, remove: () => { } });
function useCanvas(callback: CanvasCallback) {
    const key = uuid();
    const context = React.useContext(canvasContext);
    React.useEffect(() => {
        context.add(key, callback);
        return () => context.remove(key);
    }, [key, context, callback])
}

export function TerrainGrid({ rows, columns, terrain, gridSize }: { gridSize: number, rows: number, columns: number, terrain: TerrainGenerator }) {
    const ref = React.useRef<HTMLCanvasElement | null>(null);
    const [renderers, dispatch] = React.useReducer(function (state: CanvasCallbackEntry[], action: AddAction | RemoveAction) {
        if (action.action === 'add') {
            return [...state, { key: action.key, callback: action.callback }]
        } else {
            return state.filter(s => s.key !== action.key);
        }
        return state;
    }, []);
    const context = React.useMemo((): CanvasContext => ({
        add: (key, callback) => dispatch({ action: "add", key, callback }),
        remove: (key) => dispatch({ action: "remove", key }),
    }), [dispatch]);
    useEffect(() => {
        if (!ref.current) {
            return;
        }
        const context = ref.current.getContext("2d");
        if (!context) {
            return;
        }
        for (const callback of renderers) {
            callback.callback(context);
        }
    }, [ref.current, renderers]);
    return <canvas ref={ref} width={1200} height={800}>
        <canvasContext.Provider value={context}>
            {Array.from(Array(rows).keys()).map(row =>
                Array.from(Array(columns).keys()).map(column =>
                    <TerrainSpot key={`${row}x${column}`} x={column} y={row} terrain={terrain.getTerrain(row * gridSize, column * gridSize)} />
                )
            )}
        </canvasContext.Provider>
    </canvas>
}

const color: Record<BiomeCategory, string> = {
    [BiomeCategory.Ice]: "white",
    [BiomeCategory.Tundra]: "rgb(15,59,59)",
    [BiomeCategory.ColdParklands]: "rgb(144,144,122)",
    [BiomeCategory.ConiferousForests]: "rgb(29, 96, 96)",
    [BiomeCategory.CoolDeserts]: "rgb(170, 192, 102)",
    [BiomeCategory.Steppes]: "rgb(82, 154, 82)",
    [BiomeCategory.MixedForests]: "rgb(10, 154, 118)",
    [BiomeCategory.HotDeserts]: "rgb(212, 255, 77)",
    [BiomeCategory.Chaparral]: "rgb(82, 205, 82)",
    [BiomeCategory.DeciduousForests]: "rgb(0, 205, 123)",
    [BiomeCategory.Savanna]: "rgb(144, 255, 77)",
    [BiomeCategory.TropicalSeasonalForests]: "rgb(77, 255, 77)",
    [BiomeCategory.TropicalRainForests]: "rgb(28, 178, 66)",
}

const pxSize = 20;
export function TerrainSpot({ terrain, x, y }: { terrain: TerrainResult, x: number, y: number }) {
    const backgroundColor = terrain.altitude < 0.3 ? "#000088" : terrain.altitude < 0.4 ? "blue" : color[terrain.biomeCategory];
    useCanvas(React.useCallback((context: CanvasRenderingContext2D) => {
        context.fillStyle = backgroundColor;
        context.fillRect(x * pxSize, y * pxSize, pxSize, pxSize);
    }, [backgroundColor]));
    return null;
}