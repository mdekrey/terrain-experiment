import { ISpecification } from ".";
export class Result<TOutput> implements ISpecification<any, TOutput> {
  private readonly result: TOutput;
  constructor(result: TOutput) {
    this.result = result;
  }
  execute() {
    return this.result;
  }
}
