import { Perlin } from "libnoise-ts/module/generator";
import { clamp } from "./clamp";

export class PerlinAnyDirection {
  private static clamp = clamp(0, 1);
  private readonly perlin = new Perlin();
  private readonly overlap: number;
  constructor({ lacunarity = Perlin.DEFAULT_PERLIN_LACUNARITY, seed = Perlin.DEFAULT_PERLIN_SEED, overlap = 1, octaves = Perlin.DEFAULT_PERLIN_OCTAVE_COUNT,
        frequency = Perlin.DEFAULT_PERLIN_FREQUENCY }) {
    this.perlin.frequency = frequency;
    this.perlin.lacunarity = lacunarity;
    this.perlin.seed = seed;
    this.perlin.octaves = octaves;
    this.overlap = overlap;
  }
  private weight(x: number, y: number) {
    return PerlinAnyDirection.clamp(x / this.overlap) * PerlinAnyDirection.clamp(y / this.overlap);
  }
  getValue(x: number, y: number) {
    const altx = this.overlap - x, alty = this.overlap - y;
    const sets: [number, number, number][] = [
      [x, y, 0],
      [altx, y, 1],
      [x, alty, 2],
      [altx, alty, 3]
    ];
    const values = sets.filter(([x, y]) => x >= 0 && y >= 0).map(([x, y, z]) => this.perlin.getValue(x, y, z) * this.weight(x, y));
    return values.reduce((p, n) => p + n);
  }
}
