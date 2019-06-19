import { ISpecification } from "./ISpecification";

export class IfSpecification<TSituation, TOutput> implements ISpecification<TSituation, TOutput> {
  private readonly condition: ISpecification<TSituation, boolean>;
  private readonly whenTrue: ISpecification<TSituation, TOutput>;
  private readonly whenFalse: ISpecification<TSituation, TOutput>;
  constructor(condition: ISpecification<TSituation, boolean>, whenTrue: ISpecification<TSituation, TOutput>, whenFalse: ISpecification<TSituation, TOutput>) {
    this.condition = condition;
    this.whenTrue = whenTrue;
    this.whenFalse = whenFalse;
  }
  execute(situation: TSituation): TOutput {
    return this.condition.execute(situation)
      ? this.whenTrue.execute(situation)
      : this.whenFalse.execute(situation);
  }
}


