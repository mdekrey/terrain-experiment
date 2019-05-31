import { TerrainGenerator } from "./TerrainGenerator";
import { TerrainPoint } from "./TerrainPoint";

export class TerrainCache {
    private readonly terrain: TerrainGenerator;
    private readonly cache = new Map<string, TerrainPoint>();

    constructor(terrain: TerrainGenerator) {
        this.terrain = terrain;
    }

    getAt(x: number, y: number): TerrainPoint {
        const key = `${x.toFixed(6).replace(/\.0+$/,'')}x${y.toFixed(6).replace(/\.0+$/,'')}`;
        const result = this.cache.get(key);
        if (!result) {
            const result = this.terrain.getTerrain(x, y);
            this.cache.set(key, result);
            return result;
        }
        return result;
    }
}