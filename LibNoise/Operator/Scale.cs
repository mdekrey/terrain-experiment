using System;
using System.Collections.Generic;
using System.Text;

namespace LibNoise.Operator
{
    public class Scale : ModuleBase
    {
        private readonly double sx;
        private readonly double sy;
        private readonly double sz;
        private readonly ModuleBase original;

        public Scale(double sx, double sy, double sz, ModuleBase original)
        {
            this.sx = sx;
            this.sy = sy;
            this.sz = sz;
            this.original = original;
        }

        public override double GetValue(double x, double y, double z)
        {
            return original.GetValue(sx * x, sy * y, sz * z);
        }
    }
}
