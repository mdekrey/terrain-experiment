using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Game.Domain.Specifications
{
    public interface ISpecification<in TSituation, out TOutput>
    {
        TOutput Execute(TSituation situation);
    }
}
