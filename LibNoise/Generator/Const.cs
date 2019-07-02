using System;
using System.Collections.Generic;
using System.Text;

namespace LibNoise.Generator
{
    public class Const : ModuleBase
    {
        private readonly double value;

        public Const(double value)
        {
            this.value = value;
        }

        public override double GetValue(double x, double y, double z)
        {
            return value;
        }
    }
}
