using System.Linq;

namespace Game.Domain.Specifications
{
    public class SwitchSpecification<TSituation, TOutput> : ISpecification<TSituation, TOutput>
    {
        public class Case
        {
            public Case(ISpecification<TSituation, bool> condition, ISpecification<TSituation, TOutput> whenTrue)
            {
                Condition = condition;
                WhenTrue = whenTrue;
            }

            public ISpecification<TSituation, bool> Condition { get; }
            public ISpecification<TSituation, TOutput> WhenTrue { get; }
        }

        private readonly Case[] cases;
        private readonly ISpecification<TSituation, TOutput> otherwise;

        public SwitchSpecification(Case[] cases, ISpecification<TSituation, TOutput> otherwise)
        {
            this.cases = cases;
            this.otherwise = otherwise;
        }

        public TOutput Execute(TSituation situation)
        {
            return (HasMatchingCase(situation, out var trueCase) ? trueCase : otherwise).Execute(situation);
        }

        private bool HasMatchingCase(TSituation situation, out ISpecification<TSituation, TOutput> trueCase)
        {
            var match = cases.FirstOrDefault(c => c.Condition.Execute(situation));
            trueCase = match?.WhenTrue;
            return trueCase != null;
        }
    }

}
