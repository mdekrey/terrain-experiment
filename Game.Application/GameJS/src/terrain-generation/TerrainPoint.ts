import { TemperatureCategory } from "./TemperatureCategory";
import { HumidityCategory } from "./HumidityCategory";
import { BiomeDetails } from "./BiomeDetails";
import { AltitudeCategory } from "./WaterCategory";
import { TerrainSettings } from "./TerrainSettings";
import { VisualTerrainType } from "./VisualTerrainType";
import { BiomeCategory } from "./BiomeCategory";

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
    const altitudeCategory = this.altitudeCategory;
    if (altitudeCategory === AltitudeCategory.None) {
      return BiomeCategory[this.biomeCategory] as VisualTerrainType;
    }
    const temp = this.temperatureCategory;
    if (
      altitudeCategory === AltitudeCategory.DeepWater ||
      altitudeCategory === AltitudeCategory.ShallowWater
    ) {
      return temp === TemperatureCategory.Polar && this.feature > this.heat / this.terrainSettings.tempsStep[1] ? "Ice" : AltitudeCategory[altitudeCategory] as VisualTerrainType;
    }
    if (this.altitude < this.feature - 0.05) {
      return BiomeCategory[this.biomeCategory] as VisualTerrainType;
    }
    if (
      temp === TemperatureCategory.Boreal ||
      temp === TemperatureCategory.Subpolar ||
      temp === TemperatureCategory.Polar
    ) {
      return altitudeCategory === AltitudeCategory.Hills
        ? "SnowyHills"
        : "SnowyMountains";
    }
    return AltitudeCategory[altitudeCategory] as VisualTerrainType;
  }
  get detailVisualCategory(): VisualTerrainType {
    const altitudeCategory = this.altitudeCategory;
    const temp = this.temperatureCategory;
    if (
      altitudeCategory === AltitudeCategory.DeepWater ||
      altitudeCategory === AltitudeCategory.ShallowWater
    ) {
      return temp === TemperatureCategory.Polar && this.feature > this.heat / this.terrainSettings.tempsStep[1] ? "Ice" : AltitudeCategory[altitudeCategory] as VisualTerrainType;
    }
    if (altitudeCategory !== AltitudeCategory.None && 0.2 > this.feature) {
      if (
        temp === TemperatureCategory.Boreal ||
        temp === TemperatureCategory.Subpolar ||
        temp === TemperatureCategory.Polar
      )
        return altitudeCategory === AltitudeCategory.Hills ||
          this.feature > 0.05
          ? "SnowyHills"
          : "SnowyMountains";
      else
        return this.feature > 0.05 ? "Hills" : AltitudeCategory[altitudeCategory] as VisualTerrainType;
    }
    const category = this.biomeCategory;
    switch (category) {
      case BiomeCategory.Permafrost:
        if (this.feature > 0.8) {
          return "Tundra";
        }
        break;
      case BiomeCategory.Tundra:
        if (this.feature > 0.85) {
          return "ColdParklands";
        }
        break;
      case BiomeCategory.ColdParklands:
        if (this.feature < 0.5) {
          return "Tundra";
        }
        if (this.feature > 0.85) {
          return "ConiferousForests";
        }
        break;
      case BiomeCategory.ConiferousForests:
        if (this.feature > 0.65) {
          return "Tundra";
        }
        break;
      case BiomeCategory.CoolDeserts:
        if (this.feature > 0.85) {
          return "Steppes";
        }
        break;
      case BiomeCategory.Steppes:
        if (this.feature < 0.3) {
          return "CoolDeserts";
        }
        break;
      case BiomeCategory.MixedForests:
          if (this.feature > 0.9) {
            return "CoolDeserts";
          }
        if (this.feature > 0.5) {
          return "DeciduousForests";
        }
        break;
      case BiomeCategory.HotDeserts:
        // TODO: Hot deserts have no variety in the spritemap
        break;
      case BiomeCategory.Chaparral:
        if (this.feature > 0.5 && this.feature < 0.6) {
          return "DeciduousForests";
        }
        if (this.feature > 0.8) {
          return "CoolDeserts";
        }
        break;
      case BiomeCategory.DeciduousForests:
        if (this.feature > 0.5 && this.feature < 0.55) {
          return "TropicalRainForests";
        }
        if (this.feature > 0.9) {
          return "CoolDeserts";
        }
        if (this.feature > 0.8) {
          return "Chaparral";
        }
        break;
      case BiomeCategory.Savanna:
        if (this.feature > 0.5 && this.feature < 0.6) {
          return "HotDeserts";
        }
        if (this.feature > 0.9) {
          return "DeciduousForests";
        }
        break;
      case BiomeCategory.TropicalSeasonalForests:
        if (this.feature > 0.5 && this.feature < 0.6) {
          return "Chaparral";
        }
        if (this.feature > 0.7) {
          return "DeciduousForests";
        }
        break;
      case BiomeCategory.TropicalRainForests:
        if (this.feature > 0.7) {
          return "DeciduousForests";
        }
        break;
    }
    return BiomeCategory[category] as VisualTerrainType;
  }
  get hasCave() {
    return (
      (this.altitudeCategory === AltitudeCategory.Hills ||
        this.altitudeCategory === AltitudeCategory.None) &&
      this.feature > 0.995
    );
  }
}
