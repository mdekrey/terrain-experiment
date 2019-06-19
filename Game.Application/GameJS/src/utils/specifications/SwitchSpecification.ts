import { ISpecification } from "./ISpecification";
export class SwitchSpecification<TSituation, TOutput> implements ISpecification<TSituation, TOutput> {
  private readonly cases: [ISpecification<TSituation, boolean>, ISpecification<TSituation, TOutput>][];
  private readonly otherwise: ISpecification<TSituation, TOutput>;
  constructor(cases: [ISpecification<TSituation, boolean>, ISpecification<TSituation, TOutput>][], otherwise: ISpecification<TSituation, TOutput>) {
    this.cases = cases;
    this.otherwise = otherwise;
  }
  execute(situation: TSituation): TOutput {
    const matchingCase = this.cases.find(c => c[0].execute(situation));
    return matchingCase
      ? matchingCase[1].execute(situation)
      : this.otherwise.execute(situation);
  }
}
