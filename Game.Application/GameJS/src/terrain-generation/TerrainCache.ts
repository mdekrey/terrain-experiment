import { zoomFactor, localZoom } from "./ZoomLevels";
import { TerrainService, VisualTerrainType } from "../rxjs-api";
import { GameCoordinates } from "../game";

export type TerrainTileInfo = VisualTerrainType[];

const cacheRadius = 50;

export class TerrainCache {
    private readonly cache = new Map<string, TerrainTileInfo>();
    private readonly specialLocationCache = new Map<string, GameCoordinates>();
    private readonly promiseLoading = new Map<string, Promise<void>>();
    private readonly maxCount: number;
    private readonly service: TerrainService;

    constructor(service: TerrainService, maxCount: number = 100000) {
        this.service = service;
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

            const response = await this.service.getTerrain({ coordinate: { x: Math.round(x), y: Math.round(y) }, size: { width: cacheRadius, height: cacheRadius }, isDetail: isDetail })
                .toPromise();
            const result = response.data;
            this.cleanCache();

            for (let iy = 0; iy < cacheRadius; iy++) {
                for (let ix = 0; ix < cacheRadius; ix++) {
                    const terrainX = (x + ix) / factor;
                    const terrainY = (y + iy) / factor;
                    const k = this.toKey(terrainX, terrainY, isDetail);
                    this.cache.set(k, result.terrain[iy][ix].map(v => v as VisualTerrainType));
                }
            }

            if (!isDetail) {
                result.specialLocations.forEach(({ initial, target }) => {
                    const key = this.toKey(initial.x * factor, initial.y * factor, isDetail);
                    this.specialLocationCache.set(key, { x: target.x / localZoom, y: target.y / localZoom })
                });
            }

            this.promiseLoading.delete(promiseKey);
        })();
        this.promiseLoading.set(promiseKey, result);
        return result;
    }

    getSpecialLocationAt(x: number, y: number, isDetail: boolean) {
        return this.specialLocationCache.get(this.toKey(x, y, isDetail));
    }

    async getAtAsync(x: number, y: number, isDetail: boolean): Promise<TerrainTileInfo> {
        const result = await this.getAt(x,y,isDetail);
        if (result) {
            return result;
        }
        await this.cacheMiss(x, y, isDetail);
        // TODO - this is a bad way of doing it, as it has been getting in endless loops
        console.log("cache miss", x, y);
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
