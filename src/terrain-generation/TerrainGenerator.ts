import { TemperatureCategory } from "./TemperatureCategory";
import { HumidityCategory } from "./HumidityCategory";
import { BiomeCategory } from "./BiomeCategory";
import { BiomeLabel } from "./BiomeLabel";
import { WaterCategory } from "./WaterCategory";
import { TerrainSettings } from "./TerrainSettings";
import { PerlinAnyDirection } from "./PerlinAnyDirection";
import { clamp } from "./clamp";
import { TerrainPoint } from "./TerrainPoint";

export interface TerrainResult {
  readonly humidity: number;
  readonly heat: number;
  readonly altitude: number;
  readonly temperatureCategory: TemperatureCategory;
  readonly humidityCategory: HumidityCategory;
  readonly biomeLabel: BiomeLabel;
  readonly biomeCategory: BiomeCategory;
  readonly waterCategory: WaterCategory;
}

const clamper = clamp(0, 1 - Number.EPSILON);
const toValidRange = (v: number) => {
  return clamper((1.5 + v) / 3);
};

export const tempsStep = [0.126, 0.235, 0.406, 0.561, 0.634, 0.876, Number.MAX_VALUE];
const humidityCurve = (originalHumidity: number, heat: number) =>
  (0.2 + heat * 0.8) * originalHumidity;

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
  private readonly terrainProps = new TerrainSettings();

  public getTerrain(x: number, y: number): TerrainResult {
    const altitude = toValidRange(this.altitude.getValue(x, y));
    const heat = toValidRange(
      this.heat.getValue(x, y) - Math.max(0, altitude * 2 - 1.7)
    );
    const humidity = humidityCurve(
      toValidRange(this.humidity.getValue(x, y)),
      heat
    );

    return new TerrainPoint(this.terrainProps, x, y, altitude, heat, humidity);
  }
}
