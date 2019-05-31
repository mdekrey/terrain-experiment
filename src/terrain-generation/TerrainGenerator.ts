import { TerrainSettings } from "./TerrainSettings";
import { PerlinAnyDirection } from "./PerlinAnyDirection";
import { clamp } from "./clamp";
import { TerrainPoint } from "./TerrainPoint";

const clamper = clamp(0, 1 - Number.EPSILON);
const toValidRange = (v: number) => {
  return clamper((1.5 + v) / 3);
};

export class TerrainGenerator {
  private readonly humidity = new PerlinAnyDirection({
    lacunarity: 3.2,
    seed: 0
  });
  private readonly heat = new PerlinAnyDirection({
    lacunarity: 3.2,
    seed: 1750
  });
  private readonly altitude = new PerlinAnyDirection({
    lacunarity: 3.2,
    seed: 3200
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

    return new TerrainPoint(this.terrainSettings, x, y, altitude, heat, humidity);
  }
}
