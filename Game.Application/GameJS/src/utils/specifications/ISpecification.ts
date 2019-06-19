export interface ISpecification<TSituation, TOutput> {
  execute(situation: TSituation): TOutput;
}


