import { libnoise } from "libnoise";
import { AnyDirectionModule } from "./AnyDIrectionModule";

export const DEFAULT_PERLIN_LACUNARITY = 2;
export const DEFAULT_PERLIN_SEED = 0;
export const DEFAULT_PERLIN_OCTAVE_COUNT = 6;
export const DEFAULT_PERLIN_FREQUENCY = 1;
export const DEFAULT_PERLIN_PERSISTENCE = 0.5;

export function initializePerlin({
  lacunarity = DEFAULT_PERLIN_LACUNARITY,
  seed = DEFAULT_PERLIN_SEED,
  octaves = DEFAULT_PERLIN_OCTAVE_COUNT,
  frequency = DEFAULT_PERLIN_FREQUENCY
}) {
  const result = new libnoise.generator.Perlin(
    frequency,
    lacunarity,
    DEFAULT_PERLIN_PERSISTENCE,
    octaves,
    seed,
    libnoise.QualityMode.MEDIUM
  );
  return new libnoise.operator.Clamp(
    0,
    1,
    new libnoise.operator.Add(
      new libnoise.operator.Multiply(
        result,
        new libnoise.generator.Const(1 / 1.77)
      ),
      new libnoise.generator.Const(0.5)
    )
  );
}

export function initializeRidgedMulti({
  lacunarity = DEFAULT_PERLIN_LACUNARITY,
  seed = DEFAULT_PERLIN_SEED,
  octaves = DEFAULT_PERLIN_OCTAVE_COUNT,
  frequency = DEFAULT_PERLIN_FREQUENCY,
  overlap = 1
}) {
  const result = new libnoise.generator.Perlin(
    frequency,
    lacunarity,
    DEFAULT_PERLIN_PERSISTENCE,
    octaves,
    seed,
    libnoise.QualityMode.MEDIUM
  );
  // return result
  return new libnoise.operator.Clamp(
    0,
    1,
    // new libnoise.operator.Exponent(
    //   0.75,
    new NormalRidge(
        new libnoise.operator.Abs(
          new libnoise.operator.Multiply(
          result,
          new libnoise.generator.Const(1 / 1.6)
        )
        )
      )
    // )
  );
}

class NormalRidge extends libnoise.ModuleBase {
  private base: libnoise.ModuleBase
  constructor(base: libnoise.ModuleBase) {
    super();
    this.base = base;
  }
  getValue(x: number, y: number, z: number) {
    const val = libnoise.Utils.Clamp(this.base.getValue(x, y, z), 0, 1);
    return 1 - (val * (1 - val)) * 4;
  }
}
