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
        private readonly float yOffset = 9f / 400;

        public TerrainSettings Generate()
        {
            return new TerrainSettings
            {
                TemperatureStep = new Dictionary<TemperatureCategory, float>
                {
                    {TemperatureCategory.Polar , 0.126f},
                    {TemperatureCategory.Subpolar, 0.235f},
                    {TemperatureCategory.Boreal, 0.406f},
                    {TemperatureCategory.CoolTemperate, 0.561f},
                    {TemperatureCategory.WarmTemperate, 0.634f},
                    {TemperatureCategory.Subtropical, 0.876f},
                    {TemperatureCategory.Tropical, float.MaxValue}
                },
                HumidityStep = new Dictionary<HumidityCategory, float>
                {
                    {HumidityCategory.Superarid , 1/8f},
                    {HumidityCategory.Perarid, 2/8f},
                    {HumidityCategory.Arid, 3/8f},
                    {HumidityCategory.Semiarid, 4/8f},
                    {HumidityCategory.Subhumid, 5/8f},
                    {HumidityCategory.Humid, 6/8f},
                    {HumidityCategory.Perhumid, 7/8f},
                    {HumidityCategory.Superhumid, float.MaxValue}
                },
                AltitudeStep = new Dictionary<AltitudeCategory, float>
                {
                    {AltitudeCategory.DeepWater , 0.2f},
                    {AltitudeCategory.ShallowWater, 0.4f},
                    {AltitudeCategory.None, 0.8f},
                    {AltitudeCategory.Hills, 0.9f},
                    {AltitudeCategory.Mountain, float.MaxValue},
                },
                HumidityCurve = new LinearFormula { Slope = 0.8f, Offset = 0.2f },
                TemperaturePenalty = new LinearFormula { Slope = 2, Offset = -1.7f },
                Humidity = GeneratePerlin(seed: 0, lacunarity: 3.2f),
                Heat = GeneratePerlin(seed: 1750, lacunarity: 3.2f),
                Altitude = GenerateRidged(scale: 3f, seed: 500, slope: 1/1.95f, offset: 0.75f),
                Feature = GenerateRidged(scale: 6000f, seed: 670, lacunarity: 3.45f, offset: 0.5f),
                CaveIndicator = GenerateNoncohesive(1000),
                CaveSeeds = GeneratePerlin(seed: 900, lacunarity: 3.2f),
                VisualizationSpec = GenerateVisualizationSpec(),
                DetailVisualizationSpec = GenerateDetailVisualizationSpec(),
            };
        }

        private ModuleBase GenerateNoncohesive(int seed)
        {
            return new NonCohesiveNoiseGenerator(seed);
        }

        private ModuleBase GenerateRidged(float scale, int seed, float lacunarity = 2f, float slope = 1f, float offset = 0f)
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

        private ModuleBase GeneratePerlin(int seed, float lacunarity)
        {
            return new Translate(0, yOffset, 0,
                new Clamp(0, 1, new Add(
                    new Multiply(
                        new Perlin(lacunarity: lacunarity, seed: seed),
                        new Const(1 / 1.77f)
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


        private readonly Dictionary<BiomeCategory, (float, VisualTerrainType)[]> biomeDetailMap = new Dictionary<BiomeCategory, (float, VisualTerrainType)[]>() {
          { BiomeCategory.Permafrost, new[] { (0f, VisualTerrainType.Permafrost), (0.8f, VisualTerrainType.Tundra) } },
          { BiomeCategory.Tundra, new[] { (0f, VisualTerrainType.Tundra), (0.85f, VisualTerrainType.ColdParklands) } },
          { BiomeCategory.ColdParklands, new[] {
            (0f, VisualTerrainType.Tundra),
            (0.05f, VisualTerrainType.ColdParklands),
            (0.85f, VisualTerrainType.ConiferousForests)
          } },
          { BiomeCategory.ConiferousForests, new[] {
            (0f, VisualTerrainType.ConiferousForests),
            (0.65f, VisualTerrainType.Tundra)
          } },
          { BiomeCategory.CoolDeserts, new[] { (0f, VisualTerrainType.CoolDeserts), (0.85f, VisualTerrainType.Steppes) } },
          { BiomeCategory.Steppes, new[] { (0f, VisualTerrainType.CoolDeserts), (0.3f, VisualTerrainType.Steppes) } },
          { BiomeCategory.MixedForests, new[] {
            (0f, VisualTerrainType.MixedForests),
            (0.5f, VisualTerrainType.DeciduousForests),
            (0.9f, VisualTerrainType.CoolDeserts)
          } },
          { BiomeCategory.HotDeserts, new[] { (0f, VisualTerrainType.HotDeserts) } },
          { BiomeCategory.Chaparral, new[] {
            (0f, VisualTerrainType.Chaparral),
            (0.5f, VisualTerrainType.DeciduousForests),
            (0.6f, VisualTerrainType.Chaparral),
            (0.8f, VisualTerrainType.CoolDeserts)
          } },
          { BiomeCategory.DeciduousForests, new[] {
            (0f, VisualTerrainType.DeciduousForests),
            (0.5f, VisualTerrainType.TropicalRainForests),
            (0.55f, VisualTerrainType.DeciduousForests),
            (0.8f, VisualTerrainType.Chaparral),
            (0.9f, VisualTerrainType.CoolDeserts)
          } },
          { BiomeCategory.Savanna, new[] {
            (0f, VisualTerrainType.Savanna),
            (0.5f, VisualTerrainType.HotDeserts),
            (0.625f, VisualTerrainType.DeciduousForests),
            (0.65f, VisualTerrainType.Savanna)
          } },
          { BiomeCategory.TropicalSeasonalForests, new[] {
            (0f, VisualTerrainType.TropicalRainForests),
            (0.5f, VisualTerrainType.Chaparral),
            (0.6f, VisualTerrainType.TropicalRainForests),
            (0.7f, VisualTerrainType.DeciduousForests)
          } },
          { BiomeCategory.TropicalRainForests, new[] {
            (0f, VisualTerrainType.TropicalRainForests),
            (0.7f, VisualTerrainType.DeciduousForests)
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
                SwitchCase(And(Or(IsAltitude(AltitudeCategory.DeepWater), IsAltitude(AltitudeCategory.ShallowWater)), IsTemperature(TemperatureCategory.Polar), IsFeatureGreaterThanHeat(0.235f, 0)), Result(VisualTerrainType.Ice)),
                SwitchCase(IsAltitude(AltitudeCategory.DeepWater), Result(VisualTerrainType.DeepWater)),
                SwitchCase(IsAltitude(AltitudeCategory.ShallowWater), Result(VisualTerrainType.ShallowWater)),
            };
        }

        private readonly Dictionary<BiomeCategory, VisualTerrainType> biomeMap = new Dictionary<BiomeCategory, VisualTerrainType>()
        {
            { BiomeCategory.Permafrost, VisualTerrainType.Permafrost },
            { BiomeCategory.Tundra, VisualTerrainType.Tundra },
            { BiomeCategory.ColdParklands, VisualTerrainType.ColdParklands },
            { BiomeCategory.ConiferousForests, VisualTerrainType.ConiferousForests },
            { BiomeCategory.CoolDeserts, VisualTerrainType.CoolDeserts },
            { BiomeCategory.Steppes, VisualTerrainType.Steppes },
            { BiomeCategory.MixedForests, VisualTerrainType.MixedForests },
            { BiomeCategory.HotDeserts, VisualTerrainType.HotDeserts },
            { BiomeCategory.Chaparral, VisualTerrainType.Chaparral },
            { BiomeCategory.DeciduousForests, VisualTerrainType.DeciduousForests },
            { BiomeCategory.Savanna, VisualTerrainType.Savanna },
            { BiomeCategory.TropicalSeasonalForests, VisualTerrainType.TropicalSeasonalForests },
            { BiomeCategory.TropicalRainForests, VisualTerrainType.TropicalRainForests }
        };
        private ISpecification<ITerrainSituation, VisualTerrainType> BiomeBase()
        {
            return Switch(
                biomeMap.Select(kvp => SwitchCase(IsBiome(kvp.Key), Result(kvp.Value))),
                Result(VisualTerrainType.CoolDeserts)
            );
        }
    }
}
