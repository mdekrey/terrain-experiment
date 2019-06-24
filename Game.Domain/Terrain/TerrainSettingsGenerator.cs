using LibNoise;
using LibNoise.Generator;
using LibNoise.Operator;
using System;
using System.Collections.Generic;
using System.Text;

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
                VisualizationSpec = null,
                DetailVisualizationSpec = null,
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


    }
}
