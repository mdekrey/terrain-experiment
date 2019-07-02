using System;
using System.Collections.Generic;
using System.Text;

namespace LibNoise.Operator
{
    public class Add : ModuleBase
    {
        private readonly ModuleBase lhs;
        private readonly ModuleBase rhs;

        public Add(ModuleBase lhs, ModuleBase rhs)
        {
            this.lhs = lhs;
            this.rhs = rhs;
        }

        public override double GetValue(double x, double y, double z)
        {
            return lhs.GetValue(x, y, z) + rhs.GetValue(x, y, z);
        }
    }
}
