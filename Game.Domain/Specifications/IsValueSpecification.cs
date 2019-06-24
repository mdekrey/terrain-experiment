using System;

namespace Game.Domain.Specifications
{
    public abstract class IsValueSpecification<TSituation, TValue> : ISpecification<TSituation, bool>
        where TValue : IEquatable<TValue>
    {
        private readonly TValue value;

        public IsValueSpecification(TValue value)
        {
            this.value = value;
        }

        public bool Execute(TSituation situation)
        {
            return value.Equals(GetValue(situation));
        }

        protected abstract TValue GetValue(TSituation situation);
    }

}
