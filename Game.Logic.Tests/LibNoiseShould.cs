using LibNoise.Generator;
using System;
using System.Linq;
using Xunit;

namespace Game.Logic
{
    public class LibNoiseShould
    {
        [Fact]
        public void MatchJavaScript()
        {
            var perlin = new Perlin();


            const float step = 0.1f;
            const int microsteps = 30;

            var result = Enumerable.Range(0, microsteps).Select(v => v * step / microsteps).Select(v => perlin.GetValue(v, 0, 0)).ToArray();

        }
    }
}
