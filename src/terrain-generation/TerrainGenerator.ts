import { TerrainSettings } from "./TerrainSettings";
import { AnyDirectionGenerator, initializePerlin, initializeRidgedMulti } from "./PerlinAnyDirection";
import { clamp } from "../utils/clamp";
import { TerrainPoint } from "./TerrainPoint";

const perlinRange = Math.sqrt(3 / 4) * 2;
const clamper = clamp(0, 1 - Number.EPSILON);
const toValidRange = (v: number) => {
  return clamper(v / perlinRange + 0.5);
};

export class TerrainGenerator {
  private readonly humidity = new AnyDirectionGenerator({
    generator: initializePerlin({
      lacunarity: 3.2,
      seed: 0
    })
  });
  private readonly heat = new AnyDirectionGenerator({
    generator: initializePerlin({
      lacunarity: 3.2,
      seed: 1750
    })
  });
  private readonly altitude = new AnyDirectionGenerator({
    generator: initializeRidgedMulti({
      lacunarity: 3.2,
      seed: 3201
    })
  });
  private readonly feature = new AnyDirectionGenerator({
    generator: initializeRidgedMulti({
      lacunarity: 3.2,
      seed: 670
    }),
    overlap: 50000
  });
  private readonly terrainSettings: TerrainSettings;

  constructor(terrainSettings: TerrainSettings) {
    this.terrainSettings = terrainSettings;
  }

  public getTerrain(x: number, y: number): TerrainPoint {
    const altitude = toValidRange(this.altitude.getValue(x, y));
    const heat = toValidRange(
      this.heat.getValue(x, y) - Math.max(0, altitude * 2 - 1.7)
    );
    const humidity = this.terrainSettings.humidityCurve(
      toValidRange(this.humidity.getValue(x, y)),
      heat
    );
    const feature = toValidRange(this.feature.getValue(x * 2000, y * 2000));

    return new TerrainPoint(
      this.terrainSettings,
      x,
      y,
      altitude,
      heat,
      humidity,
      feature
    );
  }
}
