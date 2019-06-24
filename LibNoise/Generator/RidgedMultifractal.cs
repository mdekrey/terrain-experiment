using System;
using System.Collections.Generic;
using System.Text;

namespace LibNoise.Generator
{
    public class RidgedMultifractal : ModuleBase
    {
        public readonly float frequency;
        public readonly float lacunarity;
        public readonly int octaves;
        public readonly int seed;
        public readonly QualityMode quality;
        private readonly float[] weights;

        public RidgedMultifractal(float frequency = 1f, float lacunarity = 2f, int octaves = 8, int seed = 0, QualityMode quality = QualityMode.Medium)
        {
            this.frequency = frequency;

            this.lacunarity = lacunarity;

            this.octaves = octaves;

            this.seed = seed;

            this.quality = quality;

            weights = CalculateWeights(octaves, lacunarity);
        }

        public override float GetValue(float x, float y, float z)
        {
            x *= frequency;
            y *= frequency;
            z *= frequency;
            var value = 0.0f;
            var weight = 1.0f;
            var offset = 1.0f;
            var gain = 2.0f;
            for (var i = 0; i < octaves; i++)
            {
                var nx = Utils.MakeInt32Range(x);
                var ny = Utils.MakeInt32Range(y);
                var nz = Utils.MakeInt32Range(z);
                var _seed = (seed + i) & 0x7fffffff;
                var signal = Utils.GradientCoherentNoise3D(nx, ny, nz, _seed, quality);
                signal = Math.Abs(signal);
                signal = offset - signal;
                signal *= signal;
                signal *= weight;
                weight = signal * gain;
                weight = weight > 1.0f ? 1.0f : weight < 0 ? 0 : weight;
                value += (signal * weights[i]);
                x *= lacunarity;
                y *= lacunarity;
                z *= lacunarity;
            }
            return (value * 1.25f) - 1.0f;
        }

        private static float[] CalculateWeights(int octaves, float lacunarity)
        {
            var weights = new float[octaves];
            var f = 1.0;
            for (var i = 0; i < octaves; i++)
            {
                weights[i] = (float)Math.Pow(f, -1.0);
                f *= lacunarity;
            }
            return weights;
        }
    }
}
