import { IsValue } from "../../utils/specifications";
import { BiomeCategory } from "../BiomeCategory";
import { TerrainSituation } from "./TerrainSituation";
export class IsBiome extends IsValue<TerrainSituation, BiomeCategory> {
  getActualValue(situation: TerrainSituation): BiomeCategory {
    return situation.biomeCategory;
  }
}
