import { libnoise } from "libnoise";

export class NonCohesiveNoiseGenerator extends libnoise.ModuleBase {
    private readonly seed: number;
    constructor(seed: number) {
        super();
        this.seed = seed;
    }

    getValue(x: number, y: number, z: number): number {
        return ValueNoise3DInt(x%10, y%10, z%10, this.seed);
    }

}

function ValueNoise3DInt(x : number, y : number, z : number, seed : number) : number {
    var n = (libnoise.Utils.GeneratorNoiseX * x + libnoise.Utils.GeneratorNoiseY * y + libnoise.Utils.GeneratorNoiseZ * z + libnoise.Utils.GeneratorSeed * seed ) % 100000;
    n = (n >> 13 ) ^ n;
    return (n * (n * n * 60493 + 19990303) + 1376312589) & 0x7fffffff;
}