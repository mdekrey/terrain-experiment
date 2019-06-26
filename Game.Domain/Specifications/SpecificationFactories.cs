using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Game.Domain.Specifications
{
    public static class SpecificationFactories
    {
        public static ISpecification<TSituation, TOutput> Switch<TSituation, TOutput>(IEnumerable<SwitchSpecification<TSituation, TOutput>.Case> cases, ISpecification<TSituation, TOutput> otherwise)
        {
            return new SwitchSpecification<TSituation, TOutput>(cases.ToArray(), otherwise);
        }

        public static SwitchSpecification<TSituation, TOutput>.Case SwitchCase<TSituation, TOutput>(ISpecification<TSituation, bool> condition, ISpecification<TSituation, TOutput> whenTrue)
        {
            return new SwitchSpecification<TSituation, TOutput>.Case(condition, whenTrue);
        }

        public static ISpecification<object, TOutput> Result<TOutput>(TOutput result)
        {
            return new Result<TOutput>(result);
        }

        public static ISpecification<TSituation, bool> And<TSituation>(params ISpecification<TSituation, bool>[] conditions)
        {
            return new AndSpecification<TSituation>(conditions);
        }

        public static ISpecification<TSituation, bool> Or<TSituation>(params ISpecification<TSituation, bool>[] conditions)
        {
            return new OrSpecification<TSituation>(conditions);
        }

        public static ISpecification<TSituation, bool> Not<TSituation>(ISpecification<TSituation, bool> condition)
        {
            return new NotSpecification<TSituation>(condition);
        }

        public static ISpecification<TSituation, TOutput> If<TSituation, TOutput>(ISpecification<TSituation, bool> condition, ISpecification<TSituation, TOutput> whenTrue, ISpecification<TSituation, TOutput> whenFalse)
        {
            return new IfSpecification<TSituation, TOutput>(condition, whenTrue, whenFalse);
        }

    }
}
