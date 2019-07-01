using Game.Application.Models;
using Game.Domain.Specifications;
using LibNoise;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Game.Domain.Terrain
{
    public class TerrainSettings
    {
        public const float overworldGridSize = 0.25e-2f;
        public const float localGridSizeDiff = 1e-2f;
        public const float localGridSize = 0.25e-4f;

        public Dictionary<TemperatureCategory, float> TemperatureStep { get; set; }
        public Dictionary<HumidityCategory, float> HumidityStep { get; set; }
        public Dictionary<AltitudeCategory, float> AltitudeStep { get; set; }
        public LinearFormula HumidityCurve { get; set; }
        public LinearFormula TemperaturePenalty { get; set; }
        public ModuleBase Humidity { get; set; }
        public ModuleBase Heat { get; set; }
        public ModuleBase Altitude { get; set; }
        public ModuleBase Feature { get; set; }
        public ModuleBase CaveIndicator { get; set; }
        public ModuleBase CaveSeeds { get; set; }
        public ISpecification<ITerrainSituation, VisualTerrainType> VisualizationSpec { get; set; }
        public ISpecification<ITerrainSituation, VisualTerrainType> DetailVisualizationSpec { get; set; }

        public float CalculateTemperaturePenalty(float altitude)
        {
            return Math.Max(
              0,
              altitude * TemperaturePenalty.Slope + TemperaturePenalty.Offset
            );
        }

        public float CalculateHumidity(float originalHumidity, float heat)
        {
            return (HumidityCurve.Offset + heat * HumidityCurve.Slope) * originalHumidity;
        }

        public TerrainPoint GenerateSituation(float x, float y)
        {
            var altitude = Altitude.GetValue(x, y, 0);
            var heat = Heat.GetValue(x, y, 0) - CalculateTemperaturePenalty(altitude);
            var humidity = CalculateHumidity(Humidity.GetValue(x, y, 0), heat);
            var feature = Feature.GetValue(x, y, 0);
            var caveIndicator = CaveIndicator.GetValue(x, y, 0);
            var isCave = false;

            if (IsOnGrid(x, y))
            {
                var altitudeCategory = GetBestKey(AltitudeStep, altitude);
                if ((altitudeCategory == AltitudeCategory.None || altitudeCategory == AltitudeCategory.Hills) &&
                    caveIndicator >= 3e6 && caveIndicator <= 6e6)
                {
                    isCave = true;
                }
            }

            return new TerrainPoint(new GameCoordinate(x, y), humidity, heat, altitude, feature, isCave, this);
        }

        public static bool IsOnGrid(float x, float y)
        {

            bool IsCoordinateOnGrid(float coord) => Math.Abs(Math.Round(coord / overworldGridSize) - Math.Round(coord / localGridSize) * localGridSizeDiff) <= localGridSize;

            var onGrid = IsCoordinateOnGrid(x) && IsCoordinateOnGrid(y);

            return onGrid;
        }

        public static T GetBestKey<T>(Dictionary<T, float> steps, float target)
        {
            return (from kvp in steps
                    orderby kvp.Value
                    where kvp.Value > target
                    select kvp.Key
                    ).FirstOrDefault();
        }

    }
}
