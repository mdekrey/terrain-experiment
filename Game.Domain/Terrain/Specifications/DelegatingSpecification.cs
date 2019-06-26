using Game.Domain.Specifications;
using System;
using System.Collections.Generic;
using System.Text;

namespace Game.Domain.Terrain.Specifications
{
    class DelegatingSpecification<TSituation, TOutput> : ISpecification<TSituation, TOutput>
    {
        private readonly Func<TSituation, TOutput> selector;

        public DelegatingSpecification(Func<TSituation, TOutput> selector)
        {
            this.selector = selector;
        }

        public TOutput Execute(TSituation situation)
        {
            return selector(situation);
        }
    }
}
