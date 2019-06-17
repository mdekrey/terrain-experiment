using System;
using System.Collections.Immutable;
using System.Linq;

namespace Game.Domain.Terrain
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
    }
}