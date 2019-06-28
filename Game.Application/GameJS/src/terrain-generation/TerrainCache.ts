import { TerrainGenerator } from "./TerrainGenerator";
import { GameCoordinates } from "../game/GameCoordinates";
import { VisualTerrainType, VisualTerrainTypeFromDotNet } from "./VisualTerrainType";

export class TerrainCache {
    private readonly terrain: TerrainGenerator;
    private readonly cache = new Map<string, VisualTerrainType[]>();
    private readonly maxCount: number;

    constructor(terrain: TerrainGenerator, maxCount: number = 10000) {
        this.terrain = terrain;
        this.maxCount = maxCount;
    }

    getBlock(isDetail: boolean) {
        return (x: number, y: number, gridSize: number, tileStep: number): VisualTerrainType[][][] => {
            // const result = (window as any).DotNet.invokeMethod("Game.WebAsm", "GetTerrainBlock", terrainX, terrainY, gridSize, tileStep, isDetail) as number[][];
            this.cleanCache();
            // for (let x = 0; x < tileStep; x++) {
            //     for (let y = 0; y < tileStep; y++) {
            //         const key = this.toKey(gridSize * x + terrainX, gridSize * y + terrainY);
            //         this.cache.set(key, VisualTerrainTypeFromDotNet[result[y][x]]);
            //     }
            // }
            // return result.map(n => n.map(v => VisualTerrainTypeFromDotNet[v]));
            // TODO
            const steps = Array.from(Array(tileStep).keys())
            return steps.map(iy => steps.map((ix => {
                const terrainX = x + ix * gridSize;
                const terrainY = y + iy * gridSize;
                const terrainPoint = this.terrain.getTerrain(terrainX, terrainY);
                const result = [isDetail ? terrainPoint.detailVisualCategory : terrainPoint.visualCategory];
                if (terrainPoint.hasCave) {
                    result.push("Cave");
                }
                return result;
            })));
        };
    }

    getAt(x: number, y: number, isDetail: boolean) {
        const key = this.toKey(x, y);
        const cached = this.cache.get(key);
        return cached || this.getBlock(isDetail)(x, y, 0, 1)[0][0];
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
