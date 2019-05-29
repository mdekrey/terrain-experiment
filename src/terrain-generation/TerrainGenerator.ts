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

const tempsStep = [.126,.235,.406,.561,.634,.876, Number.MAX_VALUE];
const humidityCurve = (originalHumidity: number, heat: number) => (0.2 + heat * 0.8) * originalHumidity;
const normalizeHeat = 6;
const normalizeAltitude = 5;

export class TerrainGenerator {
  private readonly humidity = new Perlin();
  private readonly heat: Perlin[];
  private readonly altitude: Perlin[];

  constructor() {
    this.humidity.lacunarity = 3.2;
    this.humidity.seed = 0;
    this.heat = Array.from(Array(normalizeHeat).keys()).map(n => {
      const perlin = new Perlin();
      perlin.lacunarity = 3.2 - n * 0.1;
      perlin.seed = 1750 + n * 222;
      return perlin;
    })
    this.altitude = Array.from(Array(normalizeAltitude).keys()).map(n => {
      const perlin = new Perlin();
      perlin.lacunarity = 3.2 - n * 0.1;
      perlin.seed = 3200 + n * 222;
      return perlin;
    })
  }

  private getHeat(x: number, y: number) {
    return this.heat.map(h => h.getValue(x, y, 0)).reduce((total, next) => total + next) / this.heat.length;
  }

  private getAltitude(x: number, y: number) {
    return this.altitude.map(h => h.getValue(x, y, 0)).reduce((total, next) => total + next) / this.altitude.length;
  }

  public getTerrain(x: number, y: number): TerrainResult {
    const clamper = clamp(0, 1 - Number.EPSILON);
    const toValidRange = (v: number) => clamper(0.5 + v);
    const altitude = toValidRange(this.getAltitude(x, y));
    const heat = toValidRange(this.getHeat(x, y) - Math.max(0, altitude * 2 - 1.5));
    const humidity = humidityCurve(toValidRange(this.humidity.getValue(x, y, 0)), heat);
    const temperatureCategory = tempsStep.findIndex(v => v > heat) as TemperatureCategory;
    const humidityCategory = Math.min(
      BiomeDetails.biomeLabels[temperatureCategory].length,
      Math.floor(8 * humidity)
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
