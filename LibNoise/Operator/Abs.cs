using System;
using System.Collections.Generic;
using System.Text;

namespace LibNoise.Operator
{
    public class Abs : ModuleBase
    {
        private readonly ModuleBase original;

        public Abs(ModuleBase original)
        {
            this.original = original;
        }

        public override double GetValue(double x, double y, double z)
        {
            return Math.Abs(original.GetValue(x, y, z));
        }
    }
}
