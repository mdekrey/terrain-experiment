namespace Game.Domain.Terrain
{
    public class TerrainSituation
    {
        public float Altitude { get; set; }
        public float Heat { get; set; }
        public float Humidity { get; set; }
        public float Feature { get; set; }
        public TemperatureCategory TemperatureCategory { get; set; } 
        public HumidityCategory HumidityCategory { get; set; } 
        public BiomeCategory BiomeCategory { get; set; } 
        public AltitudeCategory AltitudeCategory { get; set; } 
    }
}