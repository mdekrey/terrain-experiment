using System;
using System.Collections.Generic;
using System.Text;

namespace LibNoise.Operator
{
    public class Clamp : ModuleBase
    {
        private readonly float min;
        private readonly float max;
        private readonly ModuleBase original;

        public Clamp(float min, float max, ModuleBase original)
        {
            this.min = min;
            this.max = max;
            this.original = original;
        }

        public override float GetValue(float x, float y, float z)
        {
            return Math.Min(max, Math.Max(min, original.GetValue(x, y, z)));
        }
    }
}
