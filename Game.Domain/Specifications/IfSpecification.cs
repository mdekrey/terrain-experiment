namespace Game.Domain.Specifications
{
    public class IfSpecification<TSituation, TOutput> : ISpecification<TSituation, TOutput>
    {
        private readonly ISpecification<TSituation, bool> condition;
        private readonly ISpecification<TSituation, TOutput> whenTrue;
        private readonly ISpecification<TSituation, TOutput> whenFalse;

        public IfSpecification(ISpecification<TSituation, bool> condition, ISpecification<TSituation, TOutput> whenTrue, ISpecification<TSituation, TOutput> whenFalse)
        {
            this.condition = condition;
            this.whenTrue = whenTrue;
            this.whenFalse = whenFalse;
        }

        public TOutput Execute(TSituation situation)
        {
            return condition.Execute(situation)
                ? whenTrue.Execute(situation)
                : whenFalse.Execute(situation);
        }
    }

}
