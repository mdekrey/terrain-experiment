using System;
using System.Collections.Generic;
using System.Text;

namespace LibNoise.Generator
{
    public class NonCohesiveNoiseGenerator : ModuleBase
    {
        private readonly int seed;

        public NonCohesiveNoiseGenerator(int seed)
        {
            this.seed = seed;
        }

        public override double GetValue(double x, double y, double z)
        {
            return Utils.ValueNoise3DInt(x % 10, y % 10, z % 10, seed);
        }
    }
}
