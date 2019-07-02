using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;

namespace Game.Domain.Terrain
{
    public readonly struct TerrainPoint : ITerrainSituation
    {
        public readonly GameCoordinate coordinates;
        public readonly double humidity;
        public readonly double heat;
        public readonly double altitude;
        public readonly double feature;
        private readonly bool isCave;
        public readonly TemperatureCategory temperatureCategory;
        public readonly HumidityCategory humidityCategory;
        public readonly AltitudeCategory altitudeCategory;

        public TerrainPoint(GameCoordinate coordinates, double humidity, double heat, double altitude, double feature, bool isCave, TerrainSettings settings)
        {
            this.coordinates = coordinates;
            this.humidity = humidity;
            this.heat = heat;
            this.altitude = altitude;
            this.feature = feature;
            this.isCave = isCave;
            temperatureCategory = TerrainSettings.GetBestKey(settings.TemperatureStep, heat);
            humidityCategory = (HumidityCategory)Math.Min(
                  BiomeDetails.biomeLabels[temperatureCategory].Count - 1, 
                  (int)TerrainSettings.GetBestKey(settings.HumidityStep, humidity)
                );
            altitudeCategory = TerrainSettings.GetBestKey(settings.AltitudeStep, altitude);

            //System.Diagnostics.Debug.Assert(temperatureCategory >= TemperatureCategory.Polar && temperatureCategory <= TemperatureCategory.Tropical);
            //System.Diagnostics.Debug.Assert(humidityCategory >= HumidityCategory.Superarid && humidityCategory <= HumidityCategory.Superhumid);
            //System.Diagnostics.Debug.Assert(altitudeCategory >= AltitudeCategory.DeepWater && altitudeCategory <= AltitudeCategory.Mountain);

        }

        public BiomeLabel BiomeLabel => BiomeDetails.biomeLabels[temperatureCategory][humidityCategory];
        public BiomeCategory BiomeCategory => BiomeDetails.CategoryLookup[BiomeLabel];

        public double Altitude => altitude;

        public double Heat => heat;

        public double Humidity => humidity;

        public double Feature => feature;

        public TemperatureCategory TemperatureCategory => temperatureCategory;

        public HumidityCategory HumidityCategory => humidityCategory;

        public AltitudeCategory AltitudeCategory => altitudeCategory;

        public bool IsCave => isCave;
    }
}