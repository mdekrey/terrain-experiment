using LibNoise;
using LibNoise.Generator;
using LibNoise.Operator;
using System;
using System.Collections.Generic;
using System.Text;

namespace Game.Domain
{
    public static class LibNoiseUtils
    {
        public const float DEFAULT_PERLIN_LACUNARITY = 2f;
        public const int DEFAULT_PERLIN_SEED = 0;
        public const int DEFAULT_PERLIN_OCTAVE_COUNT = 6;
        public const float DEFAULT_PERLIN_FREQUENCY = 1f;
        public const float DEFAULT_PERLIN_PERSISTENCE = 0.5f;

        public const float Y_OFFSET = 1 / 400f;

        public static ModuleBase InitializePerlin(float lacunarity = DEFAULT_PERLIN_LACUNARITY, int seed = 0, int octaveCount = DEFAULT_PERLIN_OCTAVE_COUNT, float frequency = DEFAULT_PERLIN_FREQUENCY)
        {
            return new Translate(0, Y_OFFSET, 0, 
                new Clamp(0, 1, 
                    new Add(
                        new Multiply(
                            new Perlin(frequency, lacunarity, DEFAULT_PERLIN_PERSISTENCE, octaveCount, seed, QualityMode.Medium), 
                            new Const(1 / 1.77f)
                        ), 
                        new Const(0.5f)
                    )
                )
            );
        }

        class NormalRidge : ModuleBase
        {
            private readonly ModuleBase original;

            public NormalRidge(ModuleBase original)
            {
                this.original = original;
            }

            public override double GetValue(double x, double y, double z)
            {
                var val = Utils.Clamp(original.GetValue(x, y, z), 0, 1);
                return 1 - val * (1 - val) * 4;
            }
        }
    }
}
