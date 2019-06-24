using System.Linq;

namespace Game.Domain.Specifications
{
    public class OrSpecification<TSituation> : ISpecification<TSituation, bool>
    {
        private readonly ISpecification<TSituation, bool>[] original;

        public OrSpecification(params ISpecification<TSituation, bool>[] original)
        {
            this.original = original;
        }

        public bool Execute(TSituation situation)
        {
            return original.Any(s => s.Execute(situation));
        }
    }

}
