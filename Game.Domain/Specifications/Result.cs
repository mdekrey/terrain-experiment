namespace Game.Domain.Specifications
{
    public class Result<TValue> : ISpecification<object, TValue>
    {
        private readonly TValue value;

        public Result(TValue value)
        {
            this.value = value;
        }

        public TValue Execute(object situation)
        {
            return value;
        }
    }

}
