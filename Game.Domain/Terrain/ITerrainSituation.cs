namespace Game.Domain.Terrain
{
    public interface ITerrainSituation
    {
        double Altitude { get; }
        double Heat { get; }
        double Humidity { get; }
        double Feature { get; }
        TemperatureCategory TemperatureCategory { get; } 
        HumidityCategory HumidityCategory { get; } 
        BiomeCategory BiomeCategory { get; } 
        AltitudeCategory AltitudeCategory { get; } 
    }
}