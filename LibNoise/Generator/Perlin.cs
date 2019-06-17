using System;
using System.Collections.Generic;
using System.Text;

namespace LibNoise.Generator
{
    public class Perlin : ModuleBase
    {


        public readonly float frequency;
        public readonly float lacunarity;
        public readonly float persistence;
        public readonly int octaves;
        public readonly int seed;
        public readonly QualityMode quality;


        public Perlin(float frequency = 1f, float lacunarity = 2f, float persistence = 0.5f, int octaves = 6, int seed = 0, QualityMode quality = QualityMode.Medium)
        {
            this.frequency = frequency;

            this.lacunarity = lacunarity;

            this.persistence = persistence;

            this.octaves = octaves;

            this.seed = seed;

            this.quality = quality;
        }

        public override float GetValue(float x, float y, float z)
        {

            var value = 0.0f;
            var cp = 1.0f;
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
