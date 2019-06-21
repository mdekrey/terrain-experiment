import { TerrainSettings, humidityCurve, temperaturePenalty } from "./TerrainSettings";
import { TerrainPoint } from "./TerrainPoint";
import { GameCoordinates } from "../game/GameCoordinates";
import { libnoise } from "libnoise";
import { dataDrivenNoise } from "../utils/LibNoiseUtils";

export class TerrainGenerator {
  private readonly humidity: libnoise.ModuleBase;
  private readonly heat: libnoise.ModuleBase;
  private readonly altitude: libnoise.ModuleBase;
  private readonly feature: libnoise.ModuleBase;
  private readonly caveIndicator: libnoise.ModuleBase;
  private readonly caveSeeds: libnoise.ModuleBase;
  private readonly terrainSettings: TerrainSettings;

  constructor(terrainSettings: TerrainSettings) {
    this.terrainSettings = terrainSettings;
    this.humidity = dataDrivenNoise(terrainSettings.humidity);
    this.heat = dataDrivenNoise(terrainSettings.heat);
    this.altitude = dataDrivenNoise(terrainSettings.altitude);
    this.feature = dataDrivenNoise(terrainSettings.feature);
    this.caveIndicator = dataDrivenNoise(terrainSettings.caveIndicator);
    this.caveSeeds = dataDrivenNoise(terrainSettings.caveSeeds);
  }

  public getTerrain(x: number, y: number): TerrainPoint {
    const altitude = this.altitude.getValue(x, y, 0);
    const heat = this.heat.getValue(x, y, 0) - temperaturePenalty(this.terrainSettings.temperaturePenalty, altitude);
    const humidity = humidityCurve(
      this.terrainSettings.humidityCurve,
      this.humidity.getValue(x, y, 0),
      heat
    );
    const feature = this.feature.getValue(x, y, 0);
    const caveIndicator = this.caveIndicator.getValue(x, y, 0);

    return new TerrainPoint(
      this.terrainSettings,
      x,
      y,
      altitude,
      heat,
      humidity,
      feature,
      caveIndicator
    );
  }

  getCaveSeedAt(point: GameCoordinates) {
    return this.caveSeeds.getValue(point.x, point.y, 0) * 100000;
  }
}
