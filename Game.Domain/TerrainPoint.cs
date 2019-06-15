using System;
using System.Collections.Immutable;
using System.Linq;

namespace Game.Domain
{
    public readonly struct TerrainPoint
    {
        private static readonly ImmutableList<float> tempsStep = new[] { -0.748f, -0.53f, -0.188f, 0.122f, 0.268f, 0.752f, float.MaxValue }.ToImmutableList();
        private static readonly ImmutableList<float> altitudeStep = new[] { 0.4f, 0.5f, 0.7f, 0.76f, float.MaxValue }.ToImmutableList();

        public GameCoordinate Coordinates { get; }
        public float Humidity { get; }
        public float Heat { get; }
        public float Altitude { get; }
        public float Feature { get; }
        public TemperatureCategory TemperatureCategory { get; }
        public HumidityCategory HumidityCategory { get; }
        public AltitudeCategory AltitudeCategory { get; }


        public TerrainPoint(GameCoordinate coordinates, float humidity, float heat, float altitude, float feature)
        {
            this.Coordinates = coordinates;
            this.Humidity = humidity;
            this.Heat = heat;
            this.Altitude = altitude;
            this.Feature = feature;


            TemperatureCategory = (TemperatureCategory)tempsStep.FindIndex(t => t > heat);
            HumidityCategory = (HumidityCategory)Math.Min(
                  BiomeDetails.biomeLabels[TemperatureCategory].Count - 1,
                  Math.Floor((int)HumidityCategory.Superhumid * (this.Humidity / 2 + 0.5f))
                );
            AltitudeCategory = (AltitudeCategory)altitudeStep.FindIndex(t => t > altitude);
            //System.Diagnostics.Debug.Assert(temperatureCategory >= TemperatureCategory.Polar && temperatureCategory <= TemperatureCategory.Tropical);
            //System.Diagnostics.Debug.Assert(humidityCategory >= HumidityCategory.Superarid && humidityCategory <= HumidityCategory.Superhumid);
            //System.Diagnostics.Debug.Assert(altitudeCategory >= AltitudeCategory.DeepWater && altitudeCategory <= AltitudeCategory.Mountain);
        }

        public BiomeLabel BiomeLabel => BiomeDetails.biomeLabels[TemperatureCategory][HumidityCategory];
        public BiomeCategory BiomeCategory => BiomeDetails.CategoryLookup[BiomeLabel];


        public bool HasCave
        {
            get
            {
                // TODO - make this only work in the world rounded coordinates
                return
                  (this.AltitudeCategory == AltitudeCategory.Hills ||
                    this.AltitudeCategory == AltitudeCategory.None) &&
                  this.Feature > 0.95
                ;
            }
        }

        public VisualTerrainType VisualCategory
        {
            get
            {
                if (
                     AltitudeCategory == AltitudeCategory.DeepWater ||
                     AltitudeCategory == AltitudeCategory.ShallowWater
                   )
                {
                    if (IsIce())
                    {
                        return VisualTerrainType.Ice;
                    }
                    return AltitudeCategory == AltitudeCategory.DeepWater ? VisualTerrainType.DeepWater : VisualTerrainType.ShallowWater;
                }
                if (AltitudeCategory == AltitudeCategory.None || Altitude < Feature - 0.05)
                {
                    return BiomeCategory.ToVisual();
                }

                if (
                  TemperatureCategory == TemperatureCategory.Boreal ||
                  TemperatureCategory == TemperatureCategory.Subpolar ||
                  TemperatureCategory == TemperatureCategory.Polar
                )
                {
                    return AltitudeCategory == AltitudeCategory.Hills
                      ? VisualTerrainType.SnowyHill
                      : VisualTerrainType.SnowyMountain;
                }
                return AltitudeCategory switch
                {
                    AltitudeCategory.Hills => VisualTerrainType.Hills,
                    _ => VisualTerrainType.Mountain
                };
            }
        }

        private bool IsIce()
        {
            return TemperatureCategory == TemperatureCategory.Polar && Feature > (Heat + 1) / (tempsStep[0] + 1);
        }

        public VisualTerrainType DetailVisualCategory
        {
            get
            {
                if (
                  AltitudeCategory == AltitudeCategory.DeepWater ||
                  AltitudeCategory == AltitudeCategory.ShallowWater
                )
                {
                    if (IsIce())
                    {
                        return VisualTerrainType.Ice;
                    }
                    return AltitudeCategory == AltitudeCategory.DeepWater ? VisualTerrainType.DeepWater : VisualTerrainType.ShallowWater;
                }
                if (AltitudeCategory != AltitudeCategory.None && 0.2 > Feature)
                {
                    if (
                      TemperatureCategory == TemperatureCategory.Boreal ||
                      TemperatureCategory == TemperatureCategory.Subpolar ||
                      TemperatureCategory == TemperatureCategory.Polar
                    )
                        return AltitudeCategory == AltitudeCategory.Hills ||
                          Feature > 0.05
                          ? VisualTerrainType.SnowyHill
                          : VisualTerrainType.SnowyMountain;
                    else
                        return AltitudeCategory == AltitudeCategory.Hills || Feature > 0.05 ? VisualTerrainType.Hills : VisualTerrainType.Mountain;
                }
                var category = BiomeCategory;
                switch (category)
                {
                    case BiomeCategory.Permafrost:
                        if (Feature > 0.8)
                        {
                            return VisualTerrainType.Tundra;
                        }
                        break;
                    case BiomeCategory.Tundra:
                        if (Feature > 0.85)
                        {
                            return VisualTerrainType.ColdParklands;
                        }
                        break;
                    case BiomeCategory.ColdParklands:
                        if (Feature < 0.5)
                        {
                            return VisualTerrainType.Tundra;
                        }
                        if (Feature > 0.85)
                        {
                            return VisualTerrainType.ConiferousForests;
                        }
                        break;
                    case BiomeCategory.ConiferousForests:
                        if (Feature > 0.65)
                        {
                            return VisualTerrainType.Tundra;
                        }
                        break;
                    case BiomeCategory.CoolDeserts:
                        if (Feature > 0.85)
                        {
                            return VisualTerrainType.Steppes;
                        }
                        break;
                    case BiomeCategory.Steppes:
                        if (Feature < 0.3)
                        {
                            return VisualTerrainType.CoolDeserts;
                        }
                        break;
                    case BiomeCategory.MixedForests:
                        if (Feature > 0.9)
                        {
                            return VisualTerrainType.CoolDeserts;
                        }
                        if (Feature > 0.5)
                        {
                            return VisualTerrainType.DeciduousForests;
                        }
                        break;
                    case BiomeCategory.HotDeserts:
                        // TODO: Hot deserts have no variety in the spritemap
                        break;
                    case BiomeCategory.Chaparral:
                        if (Feature > 0.5 && Feature < 0.6)
                        {
                            return VisualTerrainType.DeciduousForests;
                        }
                        if (Feature > 0.8)
                        {
                            return VisualTerrainType.CoolDeserts;
                        }
                        break;
                    case BiomeCategory.DeciduousForests:
                        if (Feature > 0.5 && Feature < 0.55)
                        {
                            return VisualTerrainType.TropicalRainForests;
                        }
                        if (Feature > 0.9)
                        {
                            return VisualTerrainType.CoolDeserts;
                        }
                        if (Feature > 0.8)
                        {
                            return VisualTerrainType.Chaparral;
                        }
                        break;
                    case BiomeCategory.Savanna:
                        if (Feature > 0.5 && Feature < 0.6)
                        {
                            return VisualTerrainType.HotDeserts;
                        }
                        if (Feature > 0.9)
                        {
                            return VisualTerrainType.DeciduousForests;
                        }
                        break;
                    case BiomeCategory.TropicalSeasonalForests:
                        if (Feature > 0.5 && Feature < 0.6)
                        {
                            return VisualTerrainType.Chaparral;
                        }
                        if (Feature > 0.7)
                        {
                            return VisualTerrainType.DeciduousForests;
                        }
                        break;
                    case BiomeCategory.TropicalRainForests:
                        if (Feature > 0.7)
                        {
                            return VisualTerrainType.DeciduousForests;
                        }
                        break;
                }
                return category.ToVisual();
            }
        }

    }
}