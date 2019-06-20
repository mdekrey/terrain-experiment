
import { HumidityCategory } from "../HumidityCategory";
import { TemperatureCategory } from "../TemperatureCategory";
import { BiomeCategory } from "../BiomeCategory";
import { AltitudeCategory } from "../WaterCategory";

export interface TerrainSituation {
    readonly altitude: number;
    readonly heat: number;
    readonly humidity: number;
    readonly feature: number;
    readonly temperatureCategory: TemperatureCategory;
    readonly humidityCategory: HumidityCategory;
    readonly biomeCategory: BiomeCategory;
    readonly altitudeCategory: AltitudeCategory;
  }


