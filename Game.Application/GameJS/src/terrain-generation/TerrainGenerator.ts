import { TerrainSettings } from "./TerrainSettings";
import { initializePerlin, initializeRidgedMulti } from "../utils/LibNoiseUtils";
import { clamp } from "../utils/clamp";
import { TerrainPoint } from "./TerrainPoint";
import { GameCoordinates } from "../game/GameCoordinates";

const perlinRange = 1.77;
const clamper = clamp(0, 1 - Number.EPSILON);
const toValidRange = (v: number) => {
  if (process.env.NODE_ENV === "development" && Math.abs(v) > perlinRange / 2) {
    console.log(v, "not in expected perlinRange", perlinRange);
  }
  return clamper(v / perlinRange + 0.5);
};

export class TerrainGenerator {
  private readonly humidity = initializePerlin({
      lacunarity: 3.2,
      seed: 0
    });
  private readonly heat = initializePerlin({
      lacunarity: 3.2,
      seed: 1750
    });
  private readonly altitude = initializeRidgedMulti({
      lacunarity: 3.2,
      seed: 3201
    });
  private readonly feature = initializeRidgedMulti({
      lacunarity: 3.2,
      seed: 670
    });
  private readonly caveSeeds = initializeRidgedMulti({
      lacunarity: 3.2,
      seed: 900
    });
  private readonly terrainSettings: TerrainSettings;

  constructor(terrainSettings: TerrainSettings) {
    this.terrainSettings = terrainSettings;
  }

  public getTerrain(x: number, y: number): TerrainPoint {
    const altitude = toValidRange(this.altitude.getValue(x, y, 0));
    const heat = toValidRange(
      this.heat.getValue(x, y, 0) - Math.max(0, altitude * 2 - 1.7)
    );
    const humidity = this.terrainSettings.humidityCurve(
      toValidRange(this.humidity.getValue(x, y, 0)),
      heat
    );
    const feature = toValidRange(this.feature.getValue(x * 6000, y * 6000, 0));

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

  getCaveSeedAt(point: GameCoordinates) {
    return this.caveSeeds.getValue(point.x, point.y, 0) * 100000;
  }
}
