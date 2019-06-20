import { libnoise } from "libnoise";
import { construct, DataDrivenConstructor, DataDrivenInput, DataDrivenConstructorRecords } from "./DataDrivenComposition";

export const DEFAULT_PERLIN_LACUNARITY = 2;
export const DEFAULT_PERLIN_SEED = 0;
export const DEFAULT_PERLIN_OCTAVE_COUNT = 6;
export const DEFAULT_PERLIN_FREQUENCY = 1;
export const DEFAULT_PERLIN_PERSISTENCE = 0.5;

const yOffset = 1/400;

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
  lacunarity = DEFAULT_PERLIN_LACUNARITY
}) {
  return dataDrivenNoise(ridgedMultiDataDrivenConstructor(scale,  seed, lacunarity));
}

export function ridgedMultiDataDrivenConstructor(scale: number, seed: number, lacunarity: number): DataDrivenConstructor<number, libnoise.ModuleBase> {
  return {
    target: "operator.Translate",
    arguments: [0, yOffset, 0, {
      target: "operator.Scale",
      arguments: [scale, scale, 1, {
        target: "operator.Clamp",
        arguments: [0, 1, {
          target: "NormalRidge",
          arguments: [{
            target: "operator.Abs",
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
                arguments: [1 / 1.6]
              }]
            }]
          }]
        }]
      }]
    }]
  };
}

class Perlin extends libnoise.generator.Perlin {
  constructor(frequency: number, lacunarity: number, persistence: number, octaves: number, seed: number) {
    super(frequency, lacunarity, persistence, octaves, seed, libnoise.QualityMode.MEDIUM);
  }
}

class NormalRidge extends libnoise.ModuleBase {
  private base: libnoise.ModuleBase;
  constructor(base: libnoise.ModuleBase) {
    super();
    this.base = base;
  }
  getValue(x: number, y: number, z: number) {
    const val = libnoise.Utils.Clamp(this.base.getValue(x, y, z), 0, 1);
    return 1 - val * (1 - val) * 4;
  }
}

const dataDrivenConstructors: DataDrivenConstructorRecords<any, libnoise.ModuleBase> = {
  "NormalRidge": NormalRidge,
  "generator.Perlin": Perlin,
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
