import { TemperatureCategory } from "./TemperatureCategory";
import { HumidityCategory } from "./HumidityCategory";
import { BiomeDetails } from "./BiomeDetails";
import { AltitudeCategory } from "./WaterCategory";
import { TerrainSettings } from "./TerrainSettings";
import { VisualTerrainType } from "./VisualTerrainType";
import { BiomeCategory } from "./BiomeCategory";

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
      : this.altitude < 0.76
      ? AltitudeCategory.Hills
      : AltitudeCategory.Mountain;
  }
  get visualCategory(): VisualTerrainType {
    const altitudeCategory = this.altitudeCategory;
    if (altitudeCategory === AltitudeCategory.None) {
      return this.biomeCategory;
    }
    const temp = this.temperatureCategory;
    if (
      altitudeCategory === AltitudeCategory.DeepWater ||
      altitudeCategory === AltitudeCategory.ShallowWater
    ) {
      return temp === TemperatureCategory.Polar ? "Ice" : altitudeCategory;
    }
    if (this.altitude < this.feature) {
      return this.biomeCategory;
    }
    if (
      temp === TemperatureCategory.Boreal ||
      temp === TemperatureCategory.Subpolar ||
      temp === TemperatureCategory.Polar
    ) {
      return altitudeCategory === AltitudeCategory.Hills
        ? "SnowyHill"
        : "SnowyMountain";
    }
    return altitudeCategory;
  }
  get detailVisualCategory(): VisualTerrainType {
    const altitudeCategory = this.altitudeCategory;
    const temp = this.temperatureCategory;
    if (
      altitudeCategory === AltitudeCategory.DeepWater ||
      altitudeCategory === AltitudeCategory.ShallowWater
    ) {
      return temp === TemperatureCategory.Polar ? "Ice" : altitudeCategory;
    }
    if (altitudeCategory !== AltitudeCategory.None && 0.2 > this.feature) {
      if (
        temp === TemperatureCategory.Boreal ||
        temp === TemperatureCategory.Subpolar ||
        temp === TemperatureCategory.Polar
      )
        return altitudeCategory === AltitudeCategory.Hills ||
          this.feature > 0.05
          ? "SnowyHill"
          : "SnowyMountain";
      else
        return this.feature > 0.05 ? AltitudeCategory.Hills : altitudeCategory;
    }
    const category = this.biomeCategory;
    switch (category) {
      case BiomeCategory.Permafrost:
        if (this.feature > 0.8) {
          return BiomeCategory.Tundra;
        }
        break;
      case BiomeCategory.Tundra:
        if (this.feature > 0.8) {
          return BiomeCategory.ConiferousForests;
        }
        break;
      case BiomeCategory.ColdParklands:
        if (this.feature < 0.7) {
          return BiomeCategory.Tundra;
        }
        break;
      case BiomeCategory.ConiferousForests:
        if (this.feature > 0.65) {
          return BiomeCategory.Tundra;
        }
        break;
      case BiomeCategory.CoolDeserts:
        if (this.feature > 0.85) {
          return BiomeCategory.Steppes;
        }
        break;
      case BiomeCategory.Steppes:
        if (this.feature < 0.3) {
          return BiomeCategory.CoolDeserts;
        }
        break;
      case BiomeCategory.MixedForests:
          if (this.feature > 0.9) {
            return BiomeCategory.CoolDeserts;
          }
        if (this.feature > 0.5) {
          return BiomeCategory.DeciduousForests;
        }
        break;
      case BiomeCategory.HotDeserts:
        // TODO: Hot deserts have no variety in the spritemap
        break;
      case BiomeCategory.Chaparral:
        if (this.feature > 0.5 && this.feature < 0.6) {
          return BiomeCategory.DeciduousForests;
        }
        if (this.feature > 0.8) {
          return BiomeCategory.CoolDeserts;
        }
        break;
      case BiomeCategory.DeciduousForests:
        if (this.feature > 0.5 && this.feature < 0.55) {
          return BiomeCategory.TropicalRainForests;
        }
        if (this.feature > 0.9) {
          return BiomeCategory.CoolDeserts;
        }
        if (this.feature > 0.8) {
          return BiomeCategory.Chaparral;
        }
        break;
      case BiomeCategory.Savanna:
        if (this.feature > 0.5 && this.feature < 0.6) {
          return BiomeCategory.HotDeserts;
        }
        if (this.feature > 0.9) {
          return BiomeCategory.DeciduousForests;
        }
        break;
      case BiomeCategory.TropicalSeasonalForests:
        if (this.feature > 0.5 && this.feature < 0.6) {
          return BiomeCategory.Chaparral;
        }
        if (this.feature > 0.7) {
          return BiomeCategory.DeciduousForests;
        }
        break;
      case BiomeCategory.TropicalRainForests:
        if (this.feature > 0.7) {
          return BiomeCategory.DeciduousForests;
        }
        break;
    }
    return category;
  }
  get hasCave() {
    return (
      (this.altitudeCategory === AltitudeCategory.Hills ||
        this.altitudeCategory === AltitudeCategory.None) &&
      this.feature > 0.95
    );
  }
}
