import { ISpecification } from "../../utils/specifications";
import { TerrainSituation } from "./TerrainSituation";
export abstract class IsFeatureGreaterThanValue implements ISpecification<TerrainSituation, boolean> {
  private readonly slope: number;
  private readonly offset: number;
  constructor(slope: number, offset: number) {
    this.slope = slope;
    this.offset = offset;
  }
  abstract getActualValue(situation: TerrainSituation): number;
  execute(situation: TerrainSituation): boolean {
    return (situation.feature * this.slope + this.offset >
      this.getActualValue(situation));
  }
}
