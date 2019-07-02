using System;
using System.Collections.Generic;
using System.Text;

namespace LibNoise.Generator
{
    public class RidgedMultifractal : ModuleBase
    {
        public readonly double frequency;
        public readonly double lacunarity;
        public readonly int octaves;
        public readonly int seed;
        public readonly QualityMode quality;
        private readonly double[] weights;

        public RidgedMultifractal(double frequency = 1f, double lacunarity = 2f, int octaves = 8, int seed = 0, QualityMode quality = QualityMode.Medium)
        {
            this.frequency = frequency;

            this.lacunarity = lacunarity;

            this.octaves = octaves;

            this.seed = seed;

            this.quality = quality;

            weights = CalculateWeights(octaves, lacunarity);
        }

        public override double GetValue(double x, double y, double z)
        {
            x *= frequency;
            y *= frequency;
            z *= frequency;
            var value = 0.0;
            var weight = 1.0;
            var offset = 1.0;
            var gain = 2.0;
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
                weight = weight > 1.0 ? 1.0 : weight < 0 ? 0 : weight;
                value += (signal * weights[i]);
                x *= lacunarity;
                y *= lacunarity;
                z *= lacunarity;
            }
            return (value * 1.25f) - 1.0f;
        }

        private static double[] CalculateWeights(int octaves, double lacunarity)
        {
            var weights = new double[octaves];
            var f = 1.0;
            for (var i = 0; i < octaves; i++)
            {
                weights[i] = (double)Math.Pow(f, -1.0);
                f *= lacunarity;
            }
            return weights;
        }
    }
}
