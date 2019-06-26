﻿using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;

namespace Game.Domain.Terrain
{
    public readonly struct TerrainPoint : ITerrainSituation
    {
        public readonly GameCoordinate coordinates;
        public readonly float humidity;
        public readonly float heat;
        public readonly float altitude;
        public readonly float feature;
        public readonly TemperatureCategory temperatureCategory;
        public readonly HumidityCategory humidityCategory;
        public readonly AltitudeCategory altitudeCategory;

        public TerrainPoint(GameCoordinate coordinates, float humidity, float heat, float altitude, float feature, TerrainSettings settings)
        {
            this.coordinates = coordinates;
            this.humidity = humidity;
            this.heat = heat;
            this.altitude = altitude;
            this.feature = feature;

            temperatureCategory = GetBestKey(settings.TemperatureStep, heat);
            humidityCategory = (HumidityCategory)Math.Min(
                  BiomeDetails.biomeLabels[temperatureCategory].Count - 1, 
                  (int)GetBestKey(settings.HumidityStep, humidity)
                );
            altitudeCategory = GetBestKey(settings.AltitudeStep, altitude);

            //System.Diagnostics.Debug.Assert(temperatureCategory >= TemperatureCategory.Polar && temperatureCategory <= TemperatureCategory.Tropical);
            //System.Diagnostics.Debug.Assert(humidityCategory >= HumidityCategory.Superarid && humidityCategory <= HumidityCategory.Superhumid);
            //System.Diagnostics.Debug.Assert(altitudeCategory >= AltitudeCategory.DeepWater && altitudeCategory <= AltitudeCategory.Mountain);

        }

        private static T GetBestKey<T>(Dictionary<T, float> steps, float target)
        {
            return (from kvp in steps
                    orderby kvp.Value
                    where kvp.Value > target
                    select kvp.Key
                    ).FirstOrDefault();
        }

        public BiomeLabel BiomeLabel => BiomeDetails.biomeLabels[temperatureCategory][humidityCategory];
        public BiomeCategory BiomeCategory => BiomeDetails.CategoryLookup[BiomeLabel];

        public float Altitude => altitude;

        public float Heat => heat;

        public float Humidity => humidity;

        public float Feature => feature;

        public TemperatureCategory TemperatureCategory => temperatureCategory;

        public HumidityCategory HumidityCategory => humidityCategory;

        public AltitudeCategory AltitudeCategory => altitudeCategory;
    }
}