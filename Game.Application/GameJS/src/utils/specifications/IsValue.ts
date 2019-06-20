import { ISpecification } from ".";
export abstract class IsValue<TSituation, T> implements ISpecification<TSituation, boolean> {
  private readonly expectedValue: T;
  constructor(expectedValue: T) {
    this.expectedValue = expectedValue;
  }
  abstract getActualValue(situation: TSituation): T;
  execute(situation: TSituation): boolean {
    return this.getActualValue(situation) === this.expectedValue;
  }
}
