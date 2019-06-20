import { IsFeatureGreaterThanValue } from "./IsFeatureGreaterThanValue";
import { TerrainSituation } from "./TerrainSituation";
export class IsFeatureGreaterThanAltitude extends IsFeatureGreaterThanValue {
  getActualValue(situation: TerrainSituation) {
    return situation.altitude;
  }
}
