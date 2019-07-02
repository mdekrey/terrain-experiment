using Game.Domain.Specifications;
using static Game.Domain.Specifications.SpecificationFactories;
using static Game.Domain.Terrain.Specifications.SpecificationFactories;
using LibNoise;
using LibNoise.Generator;
using LibNoise.Operator;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace Game.Domain.Terrain
{
    public class TerrainSettingsGenerator
    {
        private readonly double yOffset = 9.0 / 400;

        public TerrainSettings Generate()
        {
            return new TerrainSettings
            {
                TemperatureStep = new Dictionary<TemperatureCategory, double>
                {
                    {TemperatureCategory.Polar , 0.126},
                    {TemperatureCategory.Subpolar, 0.235},
                    {TemperatureCategory.Boreal, 0.406},
                    {TemperatureCategory.CoolTemperate, 0.561},
                    {TemperatureCategory.WarmTemperate, 0.634},
                    {TemperatureCategory.Subtropical, 0.876},
                    {TemperatureCategory.Tropical, double.MaxValue}
                },
                HumidityStep = new Dictionary<HumidityCategory, double>
                {
                    {HumidityCategory.Superarid , 1/8.0},
                    {HumidityCategory.Perarid, 2/8.0},
                    {HumidityCategory.Arid, 3/8.0},
                    {HumidityCategory.Semiarid, 4/8.0},
                    {HumidityCategory.Subhumid, 5/8.0},
                    {HumidityCategory.Humid, 6/8.0},
                    {HumidityCategory.Perhumid, 7/8.0},
                    {HumidityCategory.Superhumid, double.MaxValue}
                },
                AltitudeStep = new Dictionary<AltitudeCategory, double>
                {
                    {AltitudeCategory.DeepWater , 0.2},
                    {AltitudeCategory.ShallowWater, 0.4},
                    {AltitudeCategory.None, 0.8},
                    {AltitudeCategory.Hills, 0.9},
                    {AltitudeCategory.Mountain, double.MaxValue},
                },
                HumidityCurve = new LinearFormula { Slope = 0.8, Offset = 0.2 },
                TemperaturePenalty = new LinearFormula { Slope = 2, Offset = -1.7 },
                Humidity = GeneratePerlin(seed: 0, lacunarity: 3.2),
                Heat = GeneratePerlin(seed: 1750, lacunarity: 3.2),
                Altitude = GenerateRidged(scale: 3, seed: 500, slope: 1/1.95, offset: 0.75),
                Feature = GenerateRidged(scale: 6000, seed: 670, lacunarity: 3.45, offset: 0.5),
                CaveIndicator = GenerateNoncohesive(1000),
                CaveSeeds = GeneratePerlin(seed: 900, lacunarity: 3.2),
                VisualizationSpec = GenerateVisualizationSpec(),
                DetailVisualizationSpec = GenerateDetailVisualizationSpec(),
            };
        }

        private ModuleBase GenerateNoncohesive(int seed)
        {
            return new NonCohesiveNoiseGenerator(seed);
        }

        private ModuleBase GenerateRidged(double scale, int seed, double lacunarity = 2.0, double slope = 1.0, double offset = 0.0)
        {
            return new Translate(0, yOffset, 0,
                new Scale(scale, scale, 1, new Clamp(0, 1,
                    new Multiply(
                        new Add(
                            new RidgedMultifractal(lacunarity: lacunarity, seed: seed),
                            new Const(offset)
                        ),
                        new Const(slope)
                    ))
                )
            );
        }

        private ModuleBase GeneratePerlin(int seed, double lacunarity)
        {
            return new Translate(0, yOffset, 0,
                new Clamp(0, 1, new Add(
                    new Multiply(
                        new Perlin(lacunarity: lacunarity, seed: seed),
                        new Const(1 / 1.77)
                    ),
                    new Const(0.5f)
                ))
            );
        }


        private ISpecification<ITerrainSituation, VisualTerrainType> GenerateVisualizationSpec()
        {
            return Switch(
                WaterOrIceFragment().Concat(
                new[]
                {
                    SwitchCase(Not(IsAltitude(AltitudeCategory.None)), If(IsFeatureGreaterThanAltitude(1, -0.05f), HillsOnly(), MountainOrHills()))
                }),
                BiomeBase()
            );
        }

        private ISpecification<ITerrainSituation, VisualTerrainType> GenerateDetailVisualizationSpec()
        {
            return Switch(
                WaterOrIceFragment().Concat(
                new[]
                {
                    SwitchCase(Not(Or(IsAltitude(AltitudeCategory.None), IsFeatureGreaterThan(0.05f))), MountainOrHills()),
                    SwitchCase(Not(Or(IsAltitude(AltitudeCategory.None), IsFeatureGreaterThan(0.3f))), HillsOnly())
                }),
                BiomeDetailResult()
            );
        }


        private readonly Dictionary<BiomeCategory, (double, VisualTerrainType)[]> biomeDetailMap = new Dictionary<BiomeCategory, (double, VisualTerrainType)[]>() {
          { BiomeCategory.Permafrost, new[] { (0.0, VisualTerrainType.Snow), (0.8, VisualTerrainType.SnowWithGrass) } },
          { BiomeCategory.Tundra, new[] { (0.0, VisualTerrainType.SnowWithGrass), (0.85, VisualTerrainType.SnowWithBushes) } },
          { BiomeCategory.ColdParklands, new[] {
            (0.0, VisualTerrainType.SnowWithGrass),
            (0.05, VisualTerrainType.SnowWithBushes),
            (0.85, VisualTerrainType.SnowWithConiferousForests)
          } },
          { BiomeCategory.ConiferousForests, new[] {
            (0.0, VisualTerrainType.SnowWithConiferousForests),
            (0.65, VisualTerrainType.SnowWithGrass)
          } },
          { BiomeCategory.CoolDeserts, new[] { (0.0, VisualTerrainType.Grassland), (0.85, VisualTerrainType.Bushes) } },
          { BiomeCategory.Steppes, new[] { (0.0, VisualTerrainType.Grassland), (0.3, VisualTerrainType.Bushes) } },
          { BiomeCategory.MixedForests, new[] {
            (0.0, VisualTerrainType.ConiferousForests),
            (0.5, VisualTerrainType.DeciduousForests),
            (0.9, VisualTerrainType.Grassland)
          } },
          { BiomeCategory.HotDeserts, new[] { (0.0, VisualTerrainType.HotDeserts) } },
          { BiomeCategory.Chaparral, new[] {
            (0.0, VisualTerrainType.Bushes),
            (0.5, VisualTerrainType.DeciduousForests),
            (0.6, VisualTerrainType.Bushes),
            (0.8, VisualTerrainType.Grassland)
          } },
          { BiomeCategory.DeciduousForests, new[] {
            (0.0, VisualTerrainType.DeciduousForests),
            (0.5, VisualTerrainType.TropicalRainForests),
            (0.55, VisualTerrainType.DeciduousForests),
            (0.8, VisualTerrainType.Bushes),
            (0.9, VisualTerrainType.Grassland)
          } },
          { BiomeCategory.Savanna, new[] {
            (0.0, VisualTerrainType.Grassland),
            (0.5, VisualTerrainType.HotDeserts),
            (0.625, VisualTerrainType.DeciduousForests),
            (0.65, VisualTerrainType.Grassland)
          } },
          { BiomeCategory.TropicalSeasonalForests, new[] {
            (0.0, VisualTerrainType.TropicalRainForests),
            (0.5, VisualTerrainType.Bushes),
            (0.6, VisualTerrainType.TropicalRainForests),
            (0.7, VisualTerrainType.DeciduousForests)
          } },
          { BiomeCategory.TropicalRainForests, new[] {
            (0.0, VisualTerrainType.TropicalRainForests),
            (0.7, VisualTerrainType.DeciduousForests)
          } }
        };

        private ISpecification<ITerrainSituation, VisualTerrainType> BiomeDetailResult()
        {
            return Switch(
                from kvp in biomeDetailMap
                from value in kvp.Value
                orderby kvp.Key, value.Item1 descending
                select SwitchCase(And(IsBiome(kvp.Key), IsFeatureGreaterThan(value.Item1)), Result(value.Item2)),
                BiomeBase()
            );
        }

        private ISpecification<ITerrainSituation, VisualTerrainType> HillsOnly()
        {
            return If(IsSnowy(), Result(VisualTerrainType.SnowyHills), Result(VisualTerrainType.Hills));
        }

        private ISpecification<ITerrainSituation, VisualTerrainType> MountainOrHills()
        {
            return Switch(new[] {
                SwitchCase(And(IsAltitude(AltitudeCategory.Mountain), IsSnowy()), Result(VisualTerrainType.SnowyMountains)),
                SwitchCase(IsAltitude(AltitudeCategory.Mountain), Result(VisualTerrainType.Mountains)),
                SwitchCase(And(IsAltitude(AltitudeCategory.Hills), IsSnowy()), Result(VisualTerrainType.SnowyHills)),
            }, Result(VisualTerrainType.Hills));
        }

        private ISpecification<ITerrainSituation, bool> IsSnowy()
        {
            return Or(IsTemperature(TemperatureCategory.Polar), IsTemperature(TemperatureCategory.Subpolar), IsTemperature(TemperatureCategory.Boreal));
        }

        private IEnumerable<SwitchSpecification<ITerrainSituation, VisualTerrainType>.Case> WaterOrIceFragment()
        {
            return new[]
            {
                SwitchCase(And(Or(IsAltitude(AltitudeCategory.DeepWater), IsAltitude(AltitudeCategory.ShallowWater)), IsTemperature(TemperatureCategory.Polar), IsFeatureGreaterThanHeat(0.235, 0)), Result(VisualTerrainType.Ice)),
                SwitchCase(IsAltitude(AltitudeCategory.DeepWater), Result(VisualTerrainType.DeepWater)),
                SwitchCase(IsAltitude(AltitudeCategory.ShallowWater), Result(VisualTerrainType.ShallowWater)),
            };
        }

        private readonly Dictionary<BiomeCategory, VisualTerrainType> biomeMap = new Dictionary<BiomeCategory, VisualTerrainType>()
        {
            { BiomeCategory.Permafrost, VisualTerrainType.Snow },
            { BiomeCategory.Tundra, VisualTerrainType.SnowWithGrass },
            { BiomeCategory.ColdParklands, VisualTerrainType.SnowWithBushes },
            { BiomeCategory.ConiferousForests, VisualTerrainType.SnowWithConiferousForests },
            { BiomeCategory.CoolDeserts, VisualTerrainType.Grassland },
            { BiomeCategory.Steppes, VisualTerrainType.Bushes },
            { BiomeCategory.MixedForests, VisualTerrainType.ConiferousForests },
            { BiomeCategory.HotDeserts, VisualTerrainType.HotDeserts },
            { BiomeCategory.Chaparral, VisualTerrainType.Bushes },
            { BiomeCategory.DeciduousForests, VisualTerrainType.DeciduousForests },
            { BiomeCategory.Savanna, VisualTerrainType.Grassland },
            { BiomeCategory.TropicalSeasonalForests, VisualTerrainType.DeciduousForests },
            { BiomeCategory.TropicalRainForests, VisualTerrainType.TropicalRainForests }
        };
        private ISpecification<ITerrainSituation, VisualTerrainType> BiomeBase()
        {
            return Switch(
                biomeMap.Select(kvp => SwitchCase(IsBiome(kvp.Key), Result(kvp.Value))),
                Result(VisualTerrainType.Grassland)
            );
        }
    }
}
