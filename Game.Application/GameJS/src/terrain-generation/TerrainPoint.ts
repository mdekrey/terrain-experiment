import { TemperatureCategory } from "./TemperatureCategory";
import { HumidityCategory } from "./HumidityCategory";
import { BiomeDetails } from "./BiomeDetails";
import { AltitudeCategory } from "./WaterCategory";
import { TerrainSettings } from "./TerrainSettings";
import { VisualTerrainType } from "./VisualTerrainType";
import { VisualizationSpec, DetailVisualizationSpec } from "./VisualizationSpec";

function indexOrLength<T extends number>(steps: number[], value: number): T {
  const result = steps.findIndex(
    v => v > value
  );
  return (result === -1 ? steps.length : result) as T;
}

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
    return indexOrLength<TemperatureCategory>(this.terrainSettings.tempsStep, this.heat);
  }
  get humidityCategory() {
    return Math.min(
      BiomeDetails.biomeLabels[this.temperatureCategory].length,
      indexOrLength<HumidityCategory>(this.terrainSettings.humidityStep, this.humidity)
    );
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
    return indexOrLength<AltitudeCategory>(this.terrainSettings.altitudeStep, this.altitude);
  }
  get visualCategory(): VisualTerrainType {
    return VisualizationSpec.execute({
      altitude: this.altitude,
      heat: this.heat,
      humidity: this.humidity,
      feature: this.feature,
      temperatureCategory: this.temperatureCategory,
      humidityCategory: this.humidityCategory,
      biomeCategory: this.biomeCategory,
      altitudeCategory: this.altitudeCategory,
    });
  }
  get detailVisualCategory(): VisualTerrainType {
    return DetailVisualizationSpec.execute({
      altitude: this.altitude,
      heat: this.heat,
      humidity: this.humidity,
      feature: this.feature,
      temperatureCategory: this.temperatureCategory,
      humidityCategory: this.humidityCategory,
      biomeCategory: this.biomeCategory,
      altitudeCategory: this.altitudeCategory,
    });
  }
  get hasCave() {
    return (
      (this.altitudeCategory === AltitudeCategory.Hills ||
        this.altitudeCategory === AltitudeCategory.None) &&
      this.feature > 0.995
    );
  }
}
