import { ISpecification } from "./ISpecification";
export class OrSpecification<TSituation> implements ISpecification<TSituation, boolean> {
  private readonly original: Array<ISpecification<TSituation, boolean>>;
  constructor(...original: Array<ISpecification<TSituation, boolean>>) {
    this.original = original;
  }
  execute(situation: TSituation): boolean {
    return this.original.some(spec => spec.execute(situation));
  }
}
