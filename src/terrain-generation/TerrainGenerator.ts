import { Perlin } from "libnoise-ts/module/generator";
import { TemperatureCategory } from "./TemperatureCategory";
import { HumidityCategory } from "./HumidityCategory";
import { BiomeCategory } from "./BiomeCategory";
import { BiomeLabel } from "./BiomeLabel";
import { BiomeDetails } from "./BiomeDetails";

export interface TerrainResult {
    humidity: number,
    heat: number,
    altitude: number,
    temperatureCategory : TemperatureCategory,
    humidityCategory: HumidityCategory,
    biomeLabel: BiomeLabel,
    biomeCategory: BiomeCategory
}

export class TerrainGenerator {
  private readonly humidity = new Perlin();
  private readonly heat = new Perlin();
  private readonly altitude = new Perlin();

  constructor() {
    this.humidity.lacunarity = 3.2;
    this.humidity.seed = 0;
    this.heat.lacunarity = 3.2;
    this.heat.seed = 1750;
    this.altitude.lacunarity = 3.2;
    this.altitude.seed = 3200;
  }

  public getTerrain(x: number, y: number): TerrainResult {

    const clamper = clamp(0, 1 - Number.EPSILON);
    const toValidRange = (v: number) => clamper(0.5 + v);
    const humidity = toValidRange(this.humidity.getValue(x, y, 0));
    const heat = toValidRange(this.heat.getValue(x, y, 0));
    const altitude = toValidRange(this.altitude.getValue(x, y, 0));
    const temperatureCategory = Math.floor(
      BiomeDetails.biomeLabels.length * heat
    ) as TemperatureCategory;
    const humidityCategory = Math.floor(
      BiomeDetails.biomeLabels[temperatureCategory].length * humidity
    ) as HumidityCategory;
    const biomeLabel =
      BiomeDetails.biomeLabels[temperatureCategory][humidityCategory];
    const biomeCategory = BiomeDetails.categoryLookup[biomeLabel];
    return {
      humidity,
      heat,
      altitude,
      // temperature: TemperatureCategory[temperatureCategory],
      // rainfall: HumidityCategory[humidityCategory],
      // biome: BiomeLabel[biomeLabel],
      // category: BiomeCategory[biomeCategory],
      temperatureCategory,
      humidityCategory,
      biomeLabel,
      biomeCategory
    };
  }
}

function clamp(min: number, max: number) {
  return (value: number) => Math.min(max, Math.max(value, min));
}
