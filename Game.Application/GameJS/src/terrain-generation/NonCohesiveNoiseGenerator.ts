import GeneratorModule from "libnoise-ts/module/generator";
import { create } from "random-seed";

export class NonCohesiveNoiseGenerator extends GeneratorModule {
    private readonly seed: number;
    constructor(seed: number) {
        super();
        this.seed = seed;
    }

    getValue(x: number, y: number, z: number): number {
        return create(`${this.seed}:${x}x${y}x${z}`).random() * 2 - 1;
    }

}