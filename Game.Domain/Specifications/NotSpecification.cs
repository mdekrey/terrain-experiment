namespace Game.Domain.Specifications
{
    public class NotSpecification<TSituation> : ISpecification<TSituation, bool>
    {
        private readonly ISpecification<TSituation, bool> original;

        public NotSpecification(ISpecification<TSituation, bool> original)
        {
            this.original = original;
        }

        public bool Execute(TSituation situation)
        {
            return !original.Execute(situation);
        }
    }

}
