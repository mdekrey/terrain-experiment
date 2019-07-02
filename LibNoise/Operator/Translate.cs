using System;
using System.Collections.Generic;
using System.Text;

namespace LibNoise.Operator
{
    public class Translate : ModuleBase
    {
        private readonly double tx;
        private readonly double ty;
        private readonly double tz;
        private readonly ModuleBase original;

        public Translate(double tx, double ty, double tz, ModuleBase original)
        {
            this.tx = tx;
            this.ty = ty;
            this.tz = tz;
            this.original = original;
        }

        public override double GetValue(double x, double y, double z)
        {
            return original.GetValue(tx + x, ty + y, tz + z);
        }
    }
}
