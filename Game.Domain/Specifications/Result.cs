namespace Game.Domain.Specifications
{
    public abstract class Result<TSituation, TValue> : ISpecification<TSituation, TValue>
    {
        private readonly TValue value;

        public Result(TValue value)
        {
            this.value = value;
        }

        public TValue Execute(TSituation situation)
        {
            return value;
        }
    }

}
