import { ISpecification } from "./ISpecification";
export class NotSpecification<TSituation> implements ISpecification<TSituation, boolean> {
  private readonly original: ISpecification<TSituation, boolean>;
  constructor(original: ISpecification<TSituation, boolean>) {
    this.original = original;
  }
  execute(situation: TSituation): boolean {
    return !this.original.execute(situation);
  }
}
