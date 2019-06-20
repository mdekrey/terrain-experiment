import { IsFeatureGreaterThanValue } from "./IsFeatureGreaterThanValue";
import { TerrainSituation } from "./TerrainSituation";
export class IsFeatureGreaterThanHeat extends IsFeatureGreaterThanValue {
  getActualValue(situation: TerrainSituation) {
    return situation.heat;
  }
}
