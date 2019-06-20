import { IsValue } from "../../utils/specifications";
import { AltitudeCategory } from "../WaterCategory";
import { TerrainSituation } from "./TerrainSituation";
export class IsAltitude extends IsValue<TerrainSituation, AltitudeCategory> {
  getActualValue(situation: TerrainSituation): AltitudeCategory {
    return situation.altitudeCategory;
  }
}
