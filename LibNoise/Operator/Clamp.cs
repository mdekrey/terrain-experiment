using System;
using System.Collections.Generic;
using System.Text;

namespace LibNoise.Operator
{
    public class Clamp : ModuleBase
    {
        private readonly double min;
        private readonly double max;
        private readonly ModuleBase original;

        public Clamp(double min, double max, ModuleBase original)
        {
            this.min = min;
            this.max = max;
            this.original = original;
        }

        public override double GetValue(double x, double y, double z)
        {
            return Math.Min(max, Math.Max(min, original.GetValue(x, y, z)));
        }
    }
}
