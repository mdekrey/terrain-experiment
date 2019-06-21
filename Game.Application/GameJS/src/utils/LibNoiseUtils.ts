import { libnoise } from "libnoise";
import { construct, DataDrivenInput, DataDrivenConstructorRecords } from "./DataDrivenComposition";
import { NonCohesiveNoiseGenerator } from "../terrain-generation/NonCohesiveNoiseGenerator";

export const DEFAULT_PERLIN_LACUNARITY = 2;
export const DEFAULT_PERLIN_SEED = 0;
export const DEFAULT_PERLIN_OCTAVE_COUNT = 8;
export const DEFAULT_PERLIN_FREQUENCY = 1;
export const DEFAULT_PERLIN_PERSISTENCE = 0.5;

class Perlin extends libnoise.generator.Perlin {
  constructor(frequency: number, lacunarity: number, persistence: number, octaves: number, seed: number) {
    super(frequency, lacunarity, persistence, octaves, seed, libnoise.QualityMode.MEDIUM);
  }
}

class RidgedMultifractal extends libnoise.generator.RidgedMultifractal {
  constructor(frequency: number, lacunarity: number, octaves: number, seed: number) {
    super(frequency, lacunarity, octaves, seed, libnoise.QualityMode.MEDIUM);
  }
}

const dataDrivenConstructors: DataDrivenConstructorRecords<any, libnoise.ModuleBase> = {
  "generator.Perlin": Perlin,
  "generator.RidgedMultifractal": RidgedMultifractal,
  "generator.NonCohesiveNoiseGenerator": NonCohesiveNoiseGenerator,
  "operator.Abs": libnoise.operator.Abs,
  "operator.Add": libnoise.operator.Add,
  "operator.Clamp": libnoise.operator.Clamp,
  "generator.Const": libnoise.generator.Const,
  "operator.Multiply": libnoise.operator.Multiply,
  "operator.Translate": libnoise.operator.Translate,
  "operator.Scale": libnoise.operator.Scale,
};

export function dataDrivenNoise<T extends DataDrivenInput<number, libnoise.ModuleBase>>(target: T) {
  return construct(target, dataDrivenConstructors);
}
