using System;
using System.Collections.Generic;
using System.Text;

namespace LibNoise.Generator
{
    public class Const : ModuleBase
    {
        private readonly float value;

        public Const(float value)
        {
            this.value = value;
        }

        public override float GetValue(float x, float y, float z)
        {
            return value;
        }
    }
}
