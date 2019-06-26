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
        public static readonly TerrainSettings settings = new TerrainSettingsGenerator().Generate();

        [JSInvokable]
        public static VisualTerrainType[] GetTerrain(Coord[] coordinates)
        {
            return coordinates.Select(c => c.ToCoordinate()).Select(t => VisualTerrainType.CoolDeserts).ToArray();
        }
        [JSInvokable]
        public static VisualTerrainType[][] GetTerrainBlock(float startX, float startY, float stepSize, int stepCount, bool isDetail)
        {
            return Enumerable.Range(0, stepCount)
                            .Select(iy => iy * stepSize + startY)
                            .Select(y => Enumerable.Range(0, stepCount)
                                                    .Select(ix => ix * stepSize + startX)
                                                    .Select(x => settings.GenerateSituation(x, y))
                                                    .Select(point => isDetail ? settings.DetailVisualizationSpec.Execute(point) : settings.VisualizationSpec.Execute(point))
                                                    .ToArray()
                                )
                            .ToArray();
        }
    }
}
