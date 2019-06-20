import { IsValue } from "../../utils/specifications";
import { TemperatureCategory } from "../TemperatureCategory";
import { TerrainSituation } from "./TerrainSituation";
export class IsTemperature extends IsValue<TerrainSituation, TemperatureCategory> {
  getActualValue(situation: TerrainSituation): TemperatureCategory {
    return situation.temperatureCategory;
  }
}
