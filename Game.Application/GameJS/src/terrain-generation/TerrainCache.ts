import { TerrainGenerator } from "./TerrainGenerator";
import { GameCoordinates } from "../game/GameCoordinates";
import { VisualTerrainType, VisualTerrainTypeFromDotNet } from "./VisualTerrainType";
import { zoomFactor } from "./ZoomLevels";

export type TerrainTileInfo = VisualTerrainType[];

const cacheRadius = 10;

export class TerrainCache {
    private readonly terrain: TerrainGenerator;
    private readonly cache = new Map<string, TerrainTileInfo>();
    private readonly promiseLoading = new Map<string, Promise<void>>();
    private readonly maxCount: number;

    constructor(terrain: TerrainGenerator, maxCount: number = 10000) {
        this.terrain = terrain;
        this.maxCount = maxCount;
    }

    getBlock(isDetail: boolean) {
        const factor = zoomFactor(isDetail);
        return (x: number, y: number, tileStep: number): TerrainTileInfo[][] | null => {
            const result: TerrainTileInfo[][] = [];
            let failed = false;
            for (let iy = 0; iy < tileStep; iy++) {
                result[iy] = [];
                for (let ix = 0; ix < tileStep; ix++) {
                    const terrainX = x + ix / factor;
                    const terrainY = y + iy / factor;
                    const at = this.getAt(terrainX, terrainY, isDetail)
                    if (at) {
                        result[iy][ix] = at;
                    } else {
                        failed = true;
                    }
                }
            }
            if (failed) {
                return null;
            }
            return result;
        };
    }

    getAt(x: number, y: number, isDetail: boolean): TerrainTileInfo | null {
        const key = this.toKey(x, y);
        const cached = this.cache.get(key);
        if (cached) {
            return cached;
        }
        this.cacheMiss(x, y, isDetail);
        return null;
    }

    private cacheMiss(x: number, y: number, isDetail: boolean) {
        const factor = zoomFactor(isDetail);
        return this.loadCache(Math.floor(x * factor / cacheRadius) * cacheRadius, Math.floor(y * factor / cacheRadius) * cacheRadius, isDetail);
    }
    private loadCache(x: number, y: number, isDetail: boolean) {
        const promiseKey = this.toPromiseKey(x, y, isDetail);

        const oldPromise = this.promiseLoading.get(promiseKey);
        if (oldPromise) {
            return oldPromise;
        }
        const result = (async () => {
            const factor = zoomFactor(isDetail);

            for (let iy = 0; iy < cacheRadius; iy++) {
                for (let ix = 0; ix < cacheRadius; ix++) {
                    const terrainX = (x + ix) / factor;
                    const terrainY = (y + iy) / factor;
                    const terrainPoint = this.terrain.getTerrain(terrainX, terrainY);
                    const result = [isDetail ? terrainPoint.detailVisualCategory : terrainPoint.visualCategory];
                    if (terrainPoint.hasCave) {
                        result.push("Cave");
                    }
                    const k = this.toKey(terrainX, terrainY);
                    this.cache.set(k, result);
                }
            }

            // this.promiseLoading.delete(promiseKey);
        })();
        this.promiseLoading.set(promiseKey, result);
        return result;
    }

    async getAtAsync(x: number, y: number, isDetail: boolean): Promise<TerrainTileInfo> {
        const result = await this.getAt(x,y,isDetail);
        if (result) {
            return result;
        }
        await this.cacheMiss(x, y, isDetail);
        return this.getAtAsync(x, y, isDetail);
    }

    toPromiseKey(x: number, y: number, isDetail: boolean) {
        return `${x.toFixed(0)}x${y.toFixed(0)}x${isDetail}`;
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
