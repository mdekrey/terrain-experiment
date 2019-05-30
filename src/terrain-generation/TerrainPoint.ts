import { TemperatureCategory } from "./TemperatureCategory";
import { HumidityCategory } from "./HumidityCategory";
import { BiomeDetails } from "./BiomeDetails";
import { WaterCategory } from "./WaterCategory";
import { TerrainSettings } from "./TerrainSettings";
import { tempsStep } from "./TerrainGenerator";
export class TerrainPoint {
  public readonly terrainPoint: TerrainSettings;
  public readonly x: number;
  public readonly y: number;
  public readonly altitude: number;
  public readonly heat: number;
  public readonly humidity: number;
  constructor(terrainPoint: TerrainSettings, x: number, y: number, altitude: number, heat: number, humidity: number) {
    this.terrainPoint = terrainPoint;
    this.x = x;
    this.y = y;
    this.altitude = altitude;
    this.heat = heat;
    this.humidity = humidity;
  }
  get temperatureCategory() {
    return tempsStep.findIndex(v => v > this.heat) as TemperatureCategory;
  }
  get humidityCategory() {
    return Math.min(BiomeDetails.biomeLabels[this.temperatureCategory].length, Math.floor(8 * this.humidity)) as HumidityCategory;
  }
  get biomeLabel() {
    return BiomeDetails.biomeLabels[this.temperatureCategory][this.humidityCategory];
  }
  get biomeCategory() {
    return BiomeDetails.categoryLookup[this.biomeLabel];
  }
  get waterCategory() {
    return this.altitude < 0.4
      ? WaterCategory.DeepWater
      : this.altitude < 0.5
        ? WaterCategory.ShallowWater
        : WaterCategory.None;
  }
}
