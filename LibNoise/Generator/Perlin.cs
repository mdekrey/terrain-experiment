using System;
using System.Collections.Generic;
using System.Text;

namespace LibNoise.Generator
{
    public class Perlin : ModuleBase
    {


        public readonly double frequency;
        public readonly double lacunarity;
        public readonly double persistence;
        public readonly int octaves;
        public readonly int seed;
        public readonly QualityMode quality;


        public Perlin(double frequency = 1, double lacunarity = 2, double persistence = 0.5, int octaves = 8, int seed = 0, QualityMode quality = QualityMode.Medium)
        {
            this.frequency = frequency;

            this.lacunarity = lacunarity;

            this.persistence = persistence;

            this.octaves = octaves;

            this.seed = seed;

            this.quality = quality;
        }

        public override double GetValue(double x, double y, double z)
        {

            var value = 0.0;
            var cp = 1.0;
            x *= frequency;
            y *= frequency;
            z *= frequency;

            for (var i = 0; i < octaves; i++)
            {
                var nx = Utils.MakeInt32Range(x);
                var ny = Utils.MakeInt32Range(y);
                var nz = Utils.MakeInt32Range(z);
                var _seed = (seed + i) & 0xffffffff;
                var signal = Utils.GradientCoherentNoise3D(nx, ny, nz, _seed, quality);
                value += signal * cp;
                x *= lacunarity;
                y *= lacunarity;
                z *= lacunarity;
                cp *= persistence;
            }
            return value;
        }

    }

}
