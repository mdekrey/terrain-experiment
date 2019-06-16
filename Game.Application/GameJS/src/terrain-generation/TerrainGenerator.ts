import { TerrainSettings } from "./TerrainSettings";
import { initializePerlin, initializeRidgedMulti } from "../utils/LibNoiseUtils";
import { TerrainPoint } from "./TerrainPoint";
import { GameCoordinates } from "../game/GameCoordinates";
import { AnyDirectionModule } from "../utils/AnyDIrectionModule";

export class TerrainGenerator {
  private readonly humidity = initializePerlin({
      lacunarity: 3.2,
      seed: 0
    });
  private readonly heat = initializePerlin({
      lacunarity: 3.2,
      seed: 1750
    });
  private readonly altitude = new AnyDirectionModule({ generator: initializeRidgedMulti({
      lacunarity: 3.2,
      seed: 3201
    }) });
  private readonly feature = new AnyDirectionModule({ generator: initializeRidgedMulti({
      lacunarity: 3.2,
      seed: 670
    }) });
  private readonly caveSeeds = initializePerlin({
      lacunarity: 3.2,
      seed: 900
    });
  private readonly terrainSettings: TerrainSettings;

  constructor(terrainSettings: TerrainSettings) {
    this.terrainSettings = terrainSettings;
  }

  public getTerrain(x: number, y: number): TerrainPoint {
    const altitude = this.altitude.getValue(x, y, 0);
    const heat = this.heat.getValue(x, y, 0) - Math.max(0, altitude * 2 - 1.7);
    const humidity = this.terrainSettings.humidityCurve(
      this.humidity.getValue(x, y, 0),
      heat
    );
    const feature = this.feature.getValue(x * 6000, y * 6000, 0);

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
