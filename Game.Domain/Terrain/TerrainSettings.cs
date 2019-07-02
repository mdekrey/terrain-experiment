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
        public const double overworldGridSize = 0.25e-2;
        public const double localGridSizeDiff = 1e-2;
        public const double localGridSize = 0.25e-4;

        public Dictionary<TemperatureCategory, double> TemperatureStep { get; set; }
        public Dictionary<HumidityCategory, double> HumidityStep { get; set; }
        public Dictionary<AltitudeCategory, double> AltitudeStep { get; set; }
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

        public double CalculateTemperaturePenalty(double altitude)
        {
            return Math.Max(
              0,
              altitude * TemperaturePenalty.Slope + TemperaturePenalty.Offset
            );
        }

        public double CalculateHumidity(double originalHumidity, double heat)
        {
            return (HumidityCurve.Offset + heat * HumidityCurve.Slope) * originalHumidity;
        }

        public TerrainPoint GenerateSituation(double x, double y)
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

        public static bool IsOnGrid(double x, double y)
        {

            bool IsCoordinateOnGrid(double coord) => Math.Abs(Math.Round(coord / overworldGridSize) - Math.Round(coord / localGridSize) * localGridSizeDiff) <= localGridSize;

            var onGrid = IsCoordinateOnGrid(x) && IsCoordinateOnGrid(y);

            return onGrid;
        }

        public static T GetBestKey<T>(Dictionary<T, double> steps, double target)
        {
            return (from kvp in steps
                    orderby kvp.Value
                    where kvp.Value > target
                    select kvp.Key
                    ).FirstOrDefault();
        }

    }
}
