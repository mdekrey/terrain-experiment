import { TemperatureCategory } from "./TemperatureCategory";
import { HumidityCategory } from "./HumidityCategory";
import { BiomeDetails } from "./BiomeDetails";
import { AltitudeCategory } from "./WaterCategory";
import { TerrainSettings } from "./TerrainSettings";
import { VisualTerrainType } from "./VisualTerrainType";

export class TerrainPoint {
  public readonly terrainSettings: TerrainSettings;
  public readonly x: number;
  public readonly y: number;
  public readonly altitude: number;
  public readonly heat: number;
  public readonly humidity: number;
  public readonly feature: number;
  constructor(
    terrainSettings: TerrainSettings,
    x: number,
    y: number,
    altitude: number,
    heat: number,
    humidity: number,
    feature: number
  ) {
    this.terrainSettings = terrainSettings;
    this.x = x;
    this.y = y;
    this.altitude = altitude;
    this.heat = heat;
    this.humidity = humidity;
    this.feature = feature;
  }
  get temperatureCategory() {
    return this.terrainSettings.tempsStep.findIndex(
      v => v > this.heat
    ) as TemperatureCategory;
  }
  get humidityCategory() {
    return Math.min(
      BiomeDetails.biomeLabels[this.temperatureCategory].length,
      Math.floor(8 * this.humidity)
    ) as HumidityCategory;
  }
  get biomeLabel() {
    return BiomeDetails.biomeLabels[this.temperatureCategory][
      this.humidityCategory
    ];
  }
  get biomeCategory() {
    return BiomeDetails.categoryLookup[this.biomeLabel];
  }
  get altitudeCategory() {
    return this.altitude < 0.4
      ? AltitudeCategory.DeepWater
      : this.altitude < 0.5
      ? AltitudeCategory.ShallowWater
      : this.altitude < 0.7
      ? AltitudeCategory.None
      : this.altitude < 0.760
      ? AltitudeCategory.Hills
      : AltitudeCategory.Mountain;
  }
  get visualCategory(): VisualTerrainType {
    const altitudeCategory = this.altitudeCategory;
    if (altitudeCategory === AltitudeCategory.None) {
      return this.biomeCategory;
    }
    const temp = this.temperatureCategory;
    const isHills = altitudeCategory === AltitudeCategory.Hills;
    const isMountain = altitudeCategory === AltitudeCategory.Mountain;
    const isSnowy =
      temp === TemperatureCategory.Boreal ||
      temp === TemperatureCategory.Subpolar ||
      temp === TemperatureCategory.Polar;
    return isSnowy && isHills ? "SnowyHill"
      : isSnowy && isMountain ? "SnowyMountain"
      : temp === TemperatureCategory.Polar ? "Ice"
      : isHills ? "Hills"
      : isMountain ? "Mountain"
      : altitudeCategory;
  }
}
