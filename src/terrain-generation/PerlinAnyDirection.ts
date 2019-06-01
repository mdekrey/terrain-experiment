import GeneratorModule, { Perlin, RidgedMulti } from "libnoise-ts/module/generator";
import { clamp } from "../utils/clamp";

export function initializePerlin({
  lacunarity = Perlin.DEFAULT_PERLIN_LACUNARITY,
  seed = Perlin.DEFAULT_PERLIN_SEED,
  octaves = Perlin.DEFAULT_PERLIN_OCTAVE_COUNT,
  frequency = Perlin.DEFAULT_PERLIN_FREQUENCY
}) {
  const result = new Perlin();
  result.frequency = frequency;
  result.lacunarity = lacunarity;
  result.seed = seed;
  result.octaves = octaves;
  return result;
}

export function initializeRidgedMulti({
  lacunarity = Perlin.DEFAULT_PERLIN_LACUNARITY,
  seed = Perlin.DEFAULT_PERLIN_SEED,
  octaves = Perlin.DEFAULT_PERLIN_OCTAVE_COUNT,
  frequency = Perlin.DEFAULT_PERLIN_FREQUENCY
}) {
  const result = new RidgedMulti();
  result.frequency = frequency;
  result.lacunarity = lacunarity;
  result.seed = seed;
  result.octaves = octaves;
  return result;
}

export class AnyDirectionGenerator {
  private static clamp = clamp(0, 1);
  private readonly generator: GeneratorModule;
  private readonly overlap: number;
  constructor({
    generator,
    overlap = 1
  }: {
    generator: GeneratorModule;
    overlap?: number;
  }) {
    this.generator = generator;
    this.overlap = overlap;
  }
  private weight(x: number, y: number) {
    return (
      AnyDirectionGenerator.clamp(x / this.overlap) *
      AnyDirectionGenerator.clamp(y / this.overlap)
    );
  }
  getValue(x: number, y: number) {
    const altx = this.overlap - x,
      alty = this.overlap - y;
    const sets: [number, number, number][] = [
      [x, y, 0],
      [altx, y, 1],
      [x, alty, 2],
      [altx, alty, 3]
    ];
    const values = sets
      .filter(([x, y]) => x >= 0 && y >= 0)
      .map(([x, y, z]) => this.generator.getValue(x, y, z) * this.weight(x, y));
    return values.reduce((p, n) => p + n);
  }
}
