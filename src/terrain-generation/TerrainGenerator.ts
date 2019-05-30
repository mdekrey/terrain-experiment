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

const clamper = clamp(0, 1 - Number.EPSILON);
const toValidRange = (v: number) => {
  if (v < -1.5 || v > 1.5) {
    console.log(v);
  }
  return clamper((1.5 + v) / 3);
}

const tempsStep = [.126,.235,.406,.561,.634,.876, Number.MAX_VALUE];
const humidityCurve = (originalHumidity: number, heat: number) => (0.2 + heat * 0.8) * originalHumidity;

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

  private getHeat(x: number, y: number) {
    return this.heat.getValue(x, y, 0);
  }

  private getAltitude(x: number, y: number) {
    return this.altitude.getValue(x, y, 0);
  }

  public getTerrain(x: number, y: number): TerrainResult {
    const altitude = toValidRange(this.getAltitude(x, y));
    const heat = toValidRange(this.getHeat(x, y) - Math.max(0, altitude * 2 - 1.7));
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
