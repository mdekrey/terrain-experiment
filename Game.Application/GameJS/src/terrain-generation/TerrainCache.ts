import { TerrainGenerator } from "./TerrainGenerator";
import { TerrainPoint } from "./TerrainPoint";
import { GameCoordinates } from "../game/GameCoordinates";

export class TerrainCache {
    private readonly terrain: TerrainGenerator;
    private readonly cache = new Map<string, TerrainPoint>();
    private readonly maxCount: number;

    constructor(terrain: TerrainGenerator, maxCount: number = 10000) {
        this.terrain = terrain;
        this.maxCount = maxCount;
    }

    getAll(coordinates: GameCoordinates[]) {
        const keys = coordinates.filter(({ x, y }) =>
            !Boolean(this.cache.get(this.toKey(x, y)))
        ).map(({ x, y }) => ({ X: x, Y: y }));
        if (keys.length) {
            const result = (window as any).DotNet.invokeMethod("Game.WebAsm", "GetTerrain", keys);
            console.log(result);
        }
        return coordinates.map(({ x, y }) => this.getAt(x, y, true));
    }

    getBlock(terrainX: number, terrainY: number, gridSize: number, tileStep: number) {
        /*const result = */(window as any).DotNet.invokeMethod("Game.WebAsm", "GetTerrainBlock", terrainX, terrainY, gridSize, tileStep, false);
        // const resultRecord: Record<string, any> = {};
        const steps = Array.from(Array(tileStep).keys());
        // for (let x = 0; x < tileStep; x++) {
        //     for (let y = 0; y < tileStep; y++) {
        //         const key = this.toKey(gridSize * x + terrainX, gridSize * y + terrainY);
        //         resultRecord[key] = result[y][x];
        //     }
        // }
        // console.log(resultRecord);
        return steps.map(y => steps.map(x => this.getAt(gridSize * x + terrainX, gridSize * y + terrainY, true)));
    }

    getAt(x: number, y: number, bypass = false): TerrainPoint {
        const key = this.toKey(x, y);
        const result = this.cache.get(key);
        if (!result) {
            if (!bypass) {
                throw new Error("getAt " + key);
            }
            const result = this.terrain.getTerrain(x, y);
            this.cache.set(key, result);
            this.cleanCache();
            return result;
        }
        this.cache.delete(key);
        this.cache.set(key, result);
        return result;
    }

    toKey(x: number, y: number) {
        function part(v: number) { return (Math.round(v * 1e6) / 1e6).toFixed(6).replace(/\.?0+$/,''); }
        return `${part(x)}x${part(y)}`;
    }

    getCaveSeedAt(point: GameCoordinates) {
        return this.terrain.getCaveSeedAt(point);
    }

    private cleanCache() {
        if (this.cache.size > this.maxCount * 1.1) {
            const keys = Array.from(this.cache.keys()).slice(0, this.cache.size - this.maxCount);
            for (const key of keys) {
                this.cache.delete(key);
            }
        }
    }
}
