using System;
using System.Collections.Immutable;
using System.Linq;

namespace Game.Domain
{
    public readonly struct TerrainPoint
    {
        private static readonly ImmutableList<float> tempsStep = new[] { -0.748f, -0.53f, -0.188f, 0.122f, 0.268f, 0.752f, float.MaxValue }.ToImmutableList();
        private static readonly ImmutableList<float> altitudeStep = new[] { 0.4f, 0.5f, 0.7f, 0.76f, float.MaxValue }.ToImmutableList();

        public readonly GameCoordinate coordinates;
        public readonly float humidity;
        public readonly float heat;
        public readonly float altitude;
        public readonly float feature;
        public readonly TemperatureCategory temperatureCategory;
        public readonly HumidityCategory humidityCategory;
        public readonly AltitudeCategory altitudeCategory;


        public TerrainPoint(GameCoordinate coordinates, float humidity, float heat, float altitude, float feature)
        {
            this.coordinates = coordinates;
            this.humidity = humidity;
            this.heat = heat;
            this.altitude = altitude;
            this.feature = feature;


            temperatureCategory = (TemperatureCategory)tempsStep.FindIndex(t => t > heat);
            humidityCategory = (HumidityCategory)Math.Min(
                  BiomeDetails.biomeLabels[temperatureCategory].Count - 1,
                  Math.Floor((int)HumidityCategory.Superhumid * (this.humidity / 2 + 0.5f))
                );
            altitudeCategory = (AltitudeCategory)altitudeStep.FindIndex(t => t > altitude);
            //System.Diagnostics.Debug.Assert(temperatureCategory >= TemperatureCategory.Polar && temperatureCategory <= TemperatureCategory.Tropical);
            //System.Diagnostics.Debug.Assert(humidityCategory >= HumidityCategory.Superarid && humidityCategory <= HumidityCategory.Superhumid);
            //System.Diagnostics.Debug.Assert(altitudeCategory >= AltitudeCategory.DeepWater && altitudeCategory <= AltitudeCategory.Mountain);
        }

        public BiomeLabel BiomeLabel => BiomeDetails.biomeLabels[temperatureCategory][humidityCategory];
        public BiomeCategory BiomeCategory => BiomeDetails.CategoryLookup[BiomeLabel];


        public bool HasCave
        {
            get
            {
                // TODO - make this only work in the world rounded coordinates
                return
                  (this.altitudeCategory == AltitudeCategory.Hills ||
                    this.altitudeCategory == AltitudeCategory.None) &&
                  this.feature > 0.95
                ;
            }
        }

        public VisualTerrainType VisualCategory
        {
            get
            {
                if (
                     altitudeCategory == AltitudeCategory.DeepWater ||
                     altitudeCategory == AltitudeCategory.ShallowWater
                   )
                {
                    if (IsIce())
                    {
                        return VisualTerrainType.Ice;
                    }
                    return altitudeCategory == AltitudeCategory.DeepWater ? VisualTerrainType.DeepWater : VisualTerrainType.ShallowWater;
                }
                if (altitudeCategory == AltitudeCategory.None || altitude < feature - 0.05)
                {
                    return BiomeCategory.ToVisual();
                }

                if (
                  temperatureCategory == TemperatureCategory.Boreal ||
                  temperatureCategory == TemperatureCategory.Subpolar ||
                  temperatureCategory == TemperatureCategory.Polar
                )
                {
                    return altitudeCategory == AltitudeCategory.Hills
                      ? VisualTerrainType.SnowyHill
                      : VisualTerrainType.SnowyMountain;
                }
                return altitudeCategory switch
                {
                    AltitudeCategory.Hills => VisualTerrainType.Hills,
                    _ => VisualTerrainType.Mountain
                };
            }
        }

        private bool IsIce()
        {
            return temperatureCategory == TemperatureCategory.Polar && feature > (heat + 1) / (tempsStep[0] + 1);
        }

        public VisualTerrainType DetailVisualCategory
        {
            get
            {
                if (
                  altitudeCategory == AltitudeCategory.DeepWater ||
                  altitudeCategory == AltitudeCategory.ShallowWater
                )
                {
                    if (IsIce())
                    {
                        return VisualTerrainType.Ice;
                    }
                    return altitudeCategory == AltitudeCategory.DeepWater ? VisualTerrainType.DeepWater : VisualTerrainType.ShallowWater;
                }
                if (altitudeCategory != AltitudeCategory.None && 0.2 > feature)
                {
                    if (
                      temperatureCategory == TemperatureCategory.Boreal ||
                      temperatureCategory == TemperatureCategory.Subpolar ||
                      temperatureCategory == TemperatureCategory.Polar
                    )
                        return altitudeCategory == AltitudeCategory.Hills ||
                          feature > 0.05
                          ? VisualTerrainType.SnowyHill
                          : VisualTerrainType.SnowyMountain;
                    else
                        return altitudeCategory == AltitudeCategory.Hills || feature > 0.05 ? VisualTerrainType.Hills : VisualTerrainType.Mountain;
                }
                var category = BiomeCategory;
                switch (category)
                {
                    case BiomeCategory.Permafrost:
                        if (feature > 0.8)
                        {
                            return VisualTerrainType.Tundra;
                        }
                        break;
                    case BiomeCategory.Tundra:
                        if (feature > 0.85)
                        {
                            return VisualTerrainType.ColdParklands;
                        }
                        break;
                    case BiomeCategory.ColdParklands:
                        if (feature < 0.5)
                        {
                            return VisualTerrainType.Tundra;
                        }
                        if (feature > 0.85)
                        {
                            return VisualTerrainType.ConiferousForests;
                        }
                        break;
                    case BiomeCategory.ConiferousForests:
                        if (feature > 0.65)
                        {
                            return VisualTerrainType.Tundra;
                        }
                        break;
                    case BiomeCategory.CoolDeserts:
                        if (feature > 0.85)
                        {
                            return VisualTerrainType.Steppes;
                        }
                        break;
                    case BiomeCategory.Steppes:
                        if (feature < 0.3)
                        {
                            return VisualTerrainType.CoolDeserts;
                        }
                        break;
                    case BiomeCategory.MixedForests:
                        if (feature > 0.9)
                        {
                            return VisualTerrainType.CoolDeserts;
                        }
                        if (feature > 0.5)
                        {
                            return VisualTerrainType.DeciduousForests;
                        }
                        break;
                    case BiomeCategory.HotDeserts:
                        // TODO: Hot deserts have no variety in the spritemap
                        break;
                    case BiomeCategory.Chaparral:
                        if (feature > 0.5 && feature < 0.6)
                        {
                            return VisualTerrainType.DeciduousForests;
                        }
                        if (feature > 0.8)
                        {
                            return VisualTerrainType.CoolDeserts;
                        }
                        break;
                    case BiomeCategory.DeciduousForests:
                        if (feature > 0.5 && feature < 0.55)
                        {
                            return VisualTerrainType.TropicalRainForests;
                        }
                        if (feature > 0.9)
                        {
                            return VisualTerrainType.CoolDeserts;
                        }
                        if (feature > 0.8)
                        {
                            return VisualTerrainType.Chaparral;
                        }
                        break;
                    case BiomeCategory.Savanna:
                        if (feature > 0.5 && feature < 0.6)
                        {
                            return VisualTerrainType.HotDeserts;
                        }
                        if (feature > 0.9)
                        {
                            return VisualTerrainType.DeciduousForests;
                        }
                        break;
                    case BiomeCategory.TropicalSeasonalForests:
                        if (feature > 0.5 && feature < 0.6)
                        {
                            return VisualTerrainType.Chaparral;
                        }
                        if (feature > 0.7)
                        {
                            return VisualTerrainType.DeciduousForests;
                        }
                        break;
                    case BiomeCategory.TropicalRainForests:
                        if (feature > 0.7)
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