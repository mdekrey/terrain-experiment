import { TerrainPoint } from "./TerrainPoint";
import { GameCoordinates } from "../game/GameCoordinates";
import { InteropService } from "../dotnet-interop";

type Coord = {x: number, y: number};

function toKey(coord: Coord) {
    return `${coord.x.toFixed(6).replace(/\.0+$/,'')}x${coord.y.toFixed(6).replace(/\.0+$/,'')}`;
}

export class TerrainCache {
    private readonly interop: InteropService;
    private readonly cache = new Map<string, TerrainPoint>();
    private readonly maxCount: number;

    constructor(interop: InteropService, maxCount: number = 10000) {
        this.interop = interop;
        this.maxCount = maxCount;
    }

    getAt(coordinates: Coord[]): TerrainPoint[] {
        const keyed = coordinates.map(coord => {
            const key = toKey(coord);
            const cached = this.cache.get(key);
            return ({ coord, key, cached });
        }).reduce((prev, next) => {
            prev[next.key] = next;
            return prev;
        }, {} as Record<string, { cached?: TerrainPoint, coord: Coord, key: string}>);
        const uncached = Object.values(keyed).filter(k => !k.cached).map(k => k.coord);
        if (uncached.length) {
            const newSpots = this.interop.getTerrain(uncached);
            for (const spot of newSpots) {
                const key = toKey(spot.coordinates);
                keyed[key].cached = spot;
                this.cache.set(key, spot);
            }
            this.cleanCache();
        }
        return Object.values(keyed).map(c => c.cached!);
    }

    getCaveSeedAt(point: GameCoordinates) {
        return 0;
        //return this.terrain.getCaveSeedAt(point);
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
