import { TemperatureCategory } from "./TemperatureCategory";
import { HumidityCategory } from "./HumidityCategory";
import { AltitudeCategory } from "./WaterCategory";
import { VisualTerrainType } from "./VisualTerrainType";
import { BiomeCategory } from "./BiomeCategory";
import { GameCoordinates } from "../game/GameCoordinates";
import { BiomeLabel } from "./BiomeLabel";

export interface TerrainPoint {
  coordinates: GameCoordinates;
  altitude: number;
  heat: number;
  humidity: number;
  feature: number;
  temperatureCategory: TemperatureCategory;
  humidityCategory: HumidityCategory;
  altitudeCategory: AltitudeCategory;
  biomeLabel: BiomeLabel;
  biomeCategory: BiomeCategory;
  hasCave: boolean;
  visualCategory: VisualTerrainType;
  detailVisualCategory: VisualTerrainType;
}
