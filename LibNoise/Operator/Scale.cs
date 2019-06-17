using System;
using System.Collections.Generic;
using System.Text;

namespace LibNoise.Operator
{
    public class Scale : ModuleBase
    {
        private readonly float sx;
        private readonly float sy;
        private readonly float sz;
        private readonly ModuleBase original;

        public Scale(float sx, float sy, float sz, ModuleBase original)
        {
            this.sx = sx;
            this.sy = sy;
            this.sz = sz;
            this.original = original;
        }

        public override float GetValue(float x, float y, float z)
        {
            return original.GetValue(sx * x, sy * y, sz * z);
        }
    }
}
