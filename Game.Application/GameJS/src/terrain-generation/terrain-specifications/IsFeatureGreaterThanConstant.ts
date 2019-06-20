import { IsFeatureGreaterThanValue } from "./IsFeatureGreaterThanValue";
export class IsFeatureGreaterThanConstant extends IsFeatureGreaterThanValue {
  private readonly value: number;
  constructor(value: number) {
    super(1, 0);
    this.value = value;
  }
  getActualValue() {
    return this.value;
  }
}
