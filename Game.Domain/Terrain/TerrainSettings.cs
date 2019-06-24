using Game.Domain.Specifications;
using LibNoise;
using System;
using System.Collections.Generic;
using System.Text;

namespace Game.Domain.Terrain
{
    public class TerrainSettings
    {
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
        public ISpecification<TerrainSituation, VisualTerrainType> VisualizationSpec { get; set; }
        public ISpecification<TerrainSituation, VisualTerrainType> DetailVisualizationSpec { get; set; }

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
    }
}
