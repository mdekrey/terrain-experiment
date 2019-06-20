import { ISpecification } from "./ISpecification";

export type SwitchPart<TSituation, TOutput> = [ISpecification<TSituation, boolean>, ISpecification<TSituation, TOutput>];

export class SwitchSpecification<TSituation, TOutput> implements ISpecification<TSituation, TOutput> {
  private readonly cases: SwitchPart<TSituation, TOutput>[];
  private readonly otherwise: ISpecification<TSituation, TOutput>;
  constructor(cases: SwitchPart<TSituation, TOutput>[], otherwise: ISpecification<TSituation, TOutput>) {
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
