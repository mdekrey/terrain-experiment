using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Game.Domain.Specifications
{
    public interface ISpecification<TSituation, TOutput>
    {
        TOutput Execute(TSituation situation);
    }
}
