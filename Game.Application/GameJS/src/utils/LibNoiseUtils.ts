import { libnoise } from "libnoise";
import { construct, DataDrivenConstructor, DataDrivenInput, DataDrivenConstructorRecords } from "./DataDrivenComposition";
import { NonCohesiveNoiseGenerator } from "../terrain-generation/NonCohesiveNoiseGenerator";

export const DEFAULT_PERLIN_LACUNARITY = 2;
export const DEFAULT_PERLIN_SEED = 0;
export const DEFAULT_PERLIN_OCTAVE_COUNT = 8;
export const DEFAULT_PERLIN_FREQUENCY = 1;
export const DEFAULT_PERLIN_PERSISTENCE = 0.5;

const yOffset = 9 / 400;

export function initializePerlin({
  lacunarity = DEFAULT_PERLIN_LACUNARITY,
  seed = DEFAULT_PERLIN_SEED,
}) {
  return dataDrivenNoise(perlinDataDrivenConstructor(seed, lacunarity));
}

export function perlinDataDrivenConstructor(seed: number, lacunarity: number): DataDrivenConstructor<number, libnoise.ModuleBase> {
  return {
    target: "operator.Translate",
    arguments: [0, yOffset, 0, {
      target: "operator.Clamp",
      arguments: [0, 1, {
        target: "operator.Add",
        arguments: [{
          target: "operator.Multiply",
          arguments: [{
            target: "generator.Perlin",
            arguments: [
              DEFAULT_PERLIN_FREQUENCY,
              lacunarity,
              DEFAULT_PERLIN_PERSISTENCE,
              DEFAULT_PERLIN_OCTAVE_COUNT,
              seed
            ]
          }, {
            target: "generator.Const",
            arguments: [1 / 1.77]
          }]
        }, {
          target: "generator.Const",
          arguments: [0.5]
        }]
      }]
    }]
  };
}

export function initializeRidgedMulti({
  seed = DEFAULT_PERLIN_SEED,
  scale = 1,
  lacunarity = DEFAULT_PERLIN_LACUNARITY,
  slope = 1 / 1.65,
  offset = 0.75
}) {
  return dataDrivenNoise(ridgedMultiDataDrivenConstructor(scale,  seed, lacunarity, slope, offset));
}

export function ridgedMultiDataDrivenConstructor(scale: number, seed: number, lacunarity: number, slope: number, offset: number): DataDrivenConstructor<number, libnoise.ModuleBase> {
  return {
    target: "operator.Translate",
    arguments: [0, yOffset, 0, {
      target: "operator.Scale",
      arguments: [scale, scale, 1, {
        target: "operator.Clamp",
        arguments: [0, 1, {
          target: "operator.Multiply",
          arguments: [{
            target: "operator.Add",
            arguments: [{
              target: "generator.RidgedMultifractal",
              arguments: [
                DEFAULT_PERLIN_FREQUENCY,
                lacunarity,
                DEFAULT_PERLIN_OCTAVE_COUNT,
                seed
              ]
            }, {
              target: "generator.Const",
              arguments: [offset]
            }]
          }, {
            target: "generator.Const",
            arguments: [slope]
          }]
        }]
      }]
    }]
  };
}

export function nonCohesiveDataDrivenConstructor(seed: number) {
  return {
    target: "generator.NonCohesiveNoiseGenerator",
    arguments: [seed]
  };
}

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
