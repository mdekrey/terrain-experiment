using Game.Domain.Specifications;
using System;
using System.Collections.Generic;
using System.Text;

namespace Game.Domain.Terrain.Specifications
{
    public static class SpecificationFactories
    {
        public static ISpecification<ITerrainSituation, bool> IsBiome(BiomeCategory biome)
        {
            return new DelegatingSpecification<ITerrainSituation, bool>(s => s.BiomeCategory == biome);
        }

        public static ISpecification<ITerrainSituation, bool> IsAltitude(AltitudeCategory biome)
        {
            return new DelegatingSpecification<ITerrainSituation, bool>(s => s.AltitudeCategory == biome);
        }

        public static ISpecification<ITerrainSituation, bool> IsTemperature(TemperatureCategory biome)
        {
            return new DelegatingSpecification<ITerrainSituation, bool>(s => s.TemperatureCategory == biome);
        }

        public static ISpecification<ITerrainSituation, bool> IsFeatureGreaterThanHeat(float slope, float offset)
        {
            return new DelegatingSpecification<ITerrainSituation, bool>(s => s.Feature * slope + offset > s.Heat);
        }

        public static ISpecification<ITerrainSituation, bool> IsFeatureGreaterThanAltitude(float slope, float offset)
        {
            return new DelegatingSpecification<ITerrainSituation, bool>(s => s.Feature * slope + offset > s.Altitude);
        }

        public static ISpecification<ITerrainSituation, bool> IsFeatureGreaterThan(float constant)
        {
            return new DelegatingSpecification<ITerrainSituation, bool>(s => s.Feature >= constant);
        }

    }
}
