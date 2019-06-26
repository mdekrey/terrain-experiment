namespace Game.Domain.Terrain
{
    public interface ITerrainSituation
    {
        float Altitude { get; }
        float Heat { get; }
        float Humidity { get; }
        float Feature { get; }
        TemperatureCategory TemperatureCategory { get; } 
        HumidityCategory HumidityCategory { get; } 
        BiomeCategory BiomeCategory { get; } 
        AltitudeCategory AltitudeCategory { get; } 
    }
}