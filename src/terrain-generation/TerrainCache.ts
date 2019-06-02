import { TerrainGenerator } from "./TerrainGenerator";
import { TerrainPoint } from "./TerrainPoint";

export class TerrainCache {
    private readonly terrain: TerrainGenerator;
    private readonly cache = new Map<string, TerrainPoint>();
    private readonly maxCount: number;

    constructor(terrain: TerrainGenerator, maxCount: number = 10000) {
        this.terrain = terrain;
        this.maxCount = maxCount;
    }

    getAt(x: number, y: number): TerrainPoint {
        const key = `${x.toFixed(6).replace(/\.0+$/,'')}x${y.toFixed(6).replace(/\.0+$/,'')}`;
        const result = this.cache.get(key);
        if (!result) {
            const result = this.terrain.getTerrain(x, y);
            this.cache.set(key, result);
            this.cleanCache();
            return result;
        }
        this.cache.delete(key);
        this.cache.set(key, result);
        return result;
    }

    private cleanCache() {
        if (this.cache.size > this.maxCount * 1.1) {
            const keys = Array.from(this.cache.keys()).slice(this.cache.size - this.maxCount);
            for (const key of keys) {
                this.cache.delete(key);
            }
        }
    }
}
