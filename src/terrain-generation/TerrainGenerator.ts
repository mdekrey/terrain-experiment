import { TerrainSettings } from "./TerrainSettings";
import { AnyDirectionGenerator, initializePerlin, initializeRidgedMulti } from "./PerlinAnyDirection";
import { clamp } from "../utils/clamp";
import { TerrainPoint } from "./TerrainPoint";
import { NonCohesiveNoiseGenerator } from "./NonCohesiveNoiseGenerator";

const clamper = clamp(0, 1 - Number.EPSILON);
const toValidRange = (v: number) => {
  return clamper(v / 2.5 + 0.5);
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
      seed: 3200
    })
  });
  private readonly feature = new NonCohesiveNoiseGenerator(670);
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
    const feature = this.feature.getValue(x, y, 0);

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
