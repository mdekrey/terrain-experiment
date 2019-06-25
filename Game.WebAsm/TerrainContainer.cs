using Game.Domain;
using Game.Domain.Terrain;
using Microsoft.JSInterop;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Game.WebAsm
{

    public class Coord
    {
        public float X { get; set; }
        public float Y { get; set; }

        public GameCoordinate ToCoordinate() => new GameCoordinate(X, Y);
    }

    public static class TerrainContainer
    {
        public static readonly TerrainGenerator generator = new TerrainGenerator();

        [JSInvokable]
        public static VisualTerrainType[] GetTerrain(Coord[] coordinates)
        {
            return coordinates.Select(c => c.ToCoordinate()).Select(t => VisualTerrainType.CoolDeserts).ToArray();
        }
        [JSInvokable]
        public static VisualTerrainType[][] GetTerrainBlock(float startX, float startY, float stepSize, int stepCount)
        {
            return Enumerable.Range(0, stepCount)
                            .Select(y => y * stepSize + startY)
                            .Select(y => Enumerable.Range(0, stepCount)
                                                    .Select(x => x * stepSize + startX)
                                                    .Select(x => VisualTerrainType.CoolDeserts)
                                                    .ToArray()
                                )
                            .ToArray();
        }
    }
}
