import { VisualTerrainType, VisualTerrainTypeFromDotNet } from "./VisualTerrainType";
import { zoomFactor } from "./ZoomLevels";
import { ajax } from "rxjs/ajax";

export type TerrainTileInfo = VisualTerrainType[];

const cacheRadius = 50;

export class TerrainCache {
    private readonly cache = new Map<string, TerrainTileInfo>();
    private readonly promiseLoading = new Map<string, Promise<void>>();
    private readonly maxCount: number;

    constructor(maxCount: number = 100000) {
        console.log(this);
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
        const key = this.toKey(x, y, isDetail);
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

            const response = await ajax({ url: "/api/terrain", body: { Coordinates: { X: Math.round(x), Y: Math.round(y) }, Width: cacheRadius, Height: cacheRadius, IsDetail: isDetail }, method: "POST", headers: { 'Content-Type': 'application/json' } })
                .toPromise();
            const result = response.response as number[][][];
            this.cleanCache();

            for (let iy = 0; iy < cacheRadius; iy++) {
                for (let ix = 0; ix < cacheRadius; ix++) {
                    const terrainX = (x + ix) / factor;
                    const terrainY = (y + iy) / factor;
                    const k = this.toKey(terrainX, terrainY, isDetail);
                    this.cache.set(k, result[iy][ix].map(v => VisualTerrainTypeFromDotNet[v]));
                }
            }

            this.promiseLoading.delete(promiseKey);
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
    toKey(x: number, y: number, isDetail: boolean) {
        function part(v: number) { return (Math.round(v * 1e6) / 1e6).toFixed(6).replace(/\.?0+$/,''); }
        return `${part(x)}x${part(y)}x${isDetail}`;
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
