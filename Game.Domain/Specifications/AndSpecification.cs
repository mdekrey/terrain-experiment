using System.Linq;

namespace Game.Domain.Specifications
{
    public class AndSpecification<TSituation> : ISpecification<TSituation, bool>
    {
        private readonly ISpecification<TSituation, bool>[] original;

        public AndSpecification(params ISpecification<TSituation, bool>[] original)
        {
            this.original = original;
        }

        public bool Execute(TSituation situation)
        {
            return original.All(s => s.Execute(situation));
        }
    }

}
