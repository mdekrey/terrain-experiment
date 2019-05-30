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

class PerlinAnyDirection {
  private static clamp = clamp(0, 1);
  private readonly perlin = new Perlin();
  private readonly overlap: number;

  constructor({ lacunarity = Perlin.DEFAULT_PERLIN_LACUNARITY, seed = Perlin.DEFAULT_PERLIN_SEED, overlap = 1, octaves = Perlin.DEFAULT_PERLIN_OCTAVE_COUNT }) {
    this.perlin.lacunarity = lacunarity;
    this.perlin.seed = seed;
    this.perlin.octaves = octaves;
    this.overlap = overlap;
  }

  private weight(x: number, y: number) {
    return PerlinAnyDirection.clamp(x / this.overlap) * PerlinAnyDirection.clamp(y / this.overlap);
  }

  getValue(x: number, y: number) {
    const altx = this.overlap - x, alty = this.overlap - y;
    const sets: [number,number,number][] = [
      [x, y, 0],
      [altx, y, 1],
      [x, alty, 2],
      [altx, alty, 3]
    ];
    const values = sets.filter(([x, y]) => x >= 0 && y >= 0).map(([x,y,z]) => this.perlin.getValue(x,y,z) * this.weight(x,y));
    return values.reduce((p, n) => p + n);
  }
}

export class TerrainGenerator {
  private readonly humidity = new PerlinAnyDirection({ lacunarity: 3.2, seed: 0 });
  private readonly heat = new PerlinAnyDirection({ lacunarity: 3.2, seed: 1750 });
  private readonly altitude = new PerlinAnyDirection({ lacunarity: 3.2, seed: 3200 });

  public getTerrain(x: number, y: number): TerrainResult {

    const altitude = toValidRange(this.altitude.getValue(x, y));
    const heat = toValidRange(this.heat.getValue(x, y) - Math.max(0, altitude * 2 - 1.7));
    const humidity = humidityCurve(toValidRange(this.humidity.getValue(x, y)), heat);
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
