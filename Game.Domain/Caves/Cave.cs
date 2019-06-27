namespace Game.Domain.Caves
{
    public class Cave
    {
        public bool[][] Map { get; set; }
        public CaveCoordinate[] Treasure { get; set; }
        public CaveCoordinate Entrance { get; set; }
    }
}