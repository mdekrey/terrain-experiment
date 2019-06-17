using System;
using System.Collections.Generic;
using System.Text;

namespace LibNoise.Operator
{
    public class Translate : ModuleBase
    {
        private readonly float tx;
        private readonly float ty;
        private readonly float tz;
        private readonly ModuleBase original;

        public Translate(float tx, float ty, float tz, ModuleBase original)
        {
            this.tx = tx;
            this.ty = ty;
            this.tz = tz;
            this.original = original;
        }

        public override float GetValue(float x, float y, float z)
        {
            return original.GetValue(tx + x, ty + y, tz + z);
        }
    }
}
