using Game.Domain;
using Microsoft.JSInterop;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Game.WebAsm
{
    public class Coord
    {
        public float X { get; set; }
        public float Y { get; set; }

        public GameCoordinate ToCoordinate() => new GameCoordinate(X, Y);
    }

    public static class TerrainGeneratorContainer
    {
        public static readonly TerrainGenerator generator = new TerrainGenerator();

        [JSInvokable]
        public static TerrainPoint[] GetTerrain(Coord[] coordinates)
        {
            return coordinates.Select(c => c.ToCoordinate()).Select(generator.GetTerrainAt).ToArray();
        }
    }
}
