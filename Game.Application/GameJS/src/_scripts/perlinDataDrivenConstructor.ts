import { libnoise } from "libnoise";
import { DataDrivenConstructor } from "../utils/DataDrivenComposition";
import { dataDrivenNoise, DEFAULT_PERLIN_LACUNARITY, DEFAULT_PERLIN_SEED, DEFAULT_PERLIN_FREQUENCY, DEFAULT_PERLIN_PERSISTENCE, DEFAULT_PERLIN_OCTAVE_COUNT } from "../utils/LibNoiseUtils";

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
