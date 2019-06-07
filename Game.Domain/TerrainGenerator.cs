using System;
using System.Collections.Generic;
using System.Text;
using LibNoise;
using LibNoise.Filter;
using LibNoise.Primitive;

namespace Game.Domain
{
    public class TerrainGenerator
    {
        private static float SumFractalRange(int octaveCount)
        {
            var pow = Math.Pow(2, octaveCount);
            return (float)((pow - 1) / pow * 2);
        }
        private static readonly int OctaveCount = 6;
        private readonly float sumFractalRange = SumFractalRange(OctaveCount);
        private readonly float ridgedRange = 2.15f;
        private readonly IModule2D humidity = new SumFractal { Primitive2D = new SimplexPerlin { Seed = 0 }, OctaveCount = OctaveCount };
        private readonly IModule2D heat = new SumFractal { Primitive2D = new SimplexPerlin { Seed = 1750 }, OctaveCount = OctaveCount };
        private readonly IModule2D altitude = new RidgedMultiFractal { Primitive2D = new SimplexPerlin { Seed = 3201 }, OctaveCount = OctaveCount };
        private readonly IModule2D feature = new SumFractal { Primitive2D = new SimplexPerlin { Seed = 670 }, OctaveCount = OctaveCount, Lacunarity = 3.2f };
        private readonly IModule2D caveSeeds = new SumFractal { Primitive2D = new SimplexPerlin { Seed = 900 }, OctaveCount = OctaveCount };

        public TerrainPoint GetTerrainAt(GameCoordinate coordinates) {
            var altitude = GetAltitude(this.altitude.GetValue(coordinates));
            var heat = GetHeat(this.heat.GetValue(coordinates), altitude);
            var humidity = GetHumidity(this.humidity.GetValue(coordinates), heat);
            return new TerrainPoint(
                coordinates,
                humidity,
                heat,
                altitude,
                (FeatureBlend(feature, coordinates) / sumFractalRange).Clamp(-1, 1)
            );
        }

        private float FeatureBlend(IModule2D feature, GameCoordinate coordinates)
        {
            const float multFactor = 6000;
            const float stepSize = 100;
            // guarantees coords as 0 <= coord < stepSize
            var onex = ((coordinates.x % stepSize) + stepSize) % stepSize;
            var oney = ((coordinates.y % stepSize) + stepSize) % stepSize;
            var altx = onex + stepSize;
            var alty = oney + stepSize;
            var xWeight = onex / stepSize;
            var yWeight = oney / stepSize;
            var invXWeight = 1 - xWeight;
            var invYWeight = 1 - yWeight;

            return feature.GetValue(onex * multFactor, oney * multFactor) * xWeight * yWeight
                + feature.GetValue(altx * multFactor, oney * multFactor) * invXWeight * yWeight
                + feature.GetValue(onex * multFactor, alty * multFactor) * xWeight * invYWeight
                + feature.GetValue(altx * multFactor, alty * multFactor) * invXWeight * invYWeight;
        }

        private float GetAltitude(float inValue) => (inValue / ridgedRange).Clamp(0, 1);

        private float GetHeat(float inValue, float altitude)
        {
            var altitudeCooling = Math.Max(0, altitude * 2 - 1.7f) * 2;
            return (inValue / sumFractalRange - altitudeCooling).Clamp(-1, 1);
        }
        private float GetHumidity(float inValue, float heat)
        {
            var dehumidifyingFactor = (0.7f + heat * 0.4f);
            return (dehumidifyingFactor  * inValue / sumFractalRange).Clamp(-1, 1);
        }
    }

    static class LibNoiseExtensions
    {
        public static float GetValue(this IModule2D module, GameCoordinate coordinates) => module.GetValue(coordinates.x, coordinates.y);

        public static float Clamp(this float target, float min, float max) => Math.Min(Math.Max(target, min), max);
    }
}
