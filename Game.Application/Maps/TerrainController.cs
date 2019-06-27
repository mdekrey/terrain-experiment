using Game.Domain.Caves;
using Game.Domain.Terrain;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Game.Application.Maps
{
    [Route("api/[controller]")]
    [ApiController]
    public class TerrainController : ControllerBase
    {
        private static readonly float overworldZoom = 4e-2f;
        private static readonly float localZoom = 4e-4f;
        private static readonly TerrainSettings settings = new TerrainSettingsGenerator().Generate();

        public class GameCoordinate
        {
            public int X { get; set; }
            public int Y { get; set; }
        }

        public class GetTerrainSettingsRequest
        {
            public GameCoordinate Coordinates { get; set; }
            public int Width { get; set; } = 100;
            public int Height { get; set; } = 100;
            public bool IsDetail { get; set; } = false;
        }

        [HttpPost]
        public VisualTerrainType[][][] GetTerrainSettings([FromBody] GetTerrainSettingsRequest body)
        {
            var stepSize = body.IsDetail ? localZoom : overworldZoom;
            var startX = body.Coordinates.X * stepSize;
            var startY = body.Coordinates.Y * stepSize;
            return Enumerable.Range(0, body.Height)
                            .Select(iy => iy * stepSize + startY)
                            .Select(y => Enumerable.Range(0, body.Width)
                                                    .Select(ix => ix * stepSize + startX)
                                                    .Select(x => settings.GenerateSituation(x, y))
                                                    .Select(point => new[] { body.IsDetail ? settings.DetailVisualizationSpec.Execute(point) : settings.VisualizationSpec.Execute(point) })
                                                    .ToArray()
                                )
                            .ToArray();
        }

        public class CaveResponse
        {
            public bool[][] Map { get; set; }
            public GameCoordinate[] Treasure { get; set; }
            public GameCoordinate Entrance { get; set; }
        }

        public class CaveRequest
        {
            public GameCoordinate Coordinates { get; set; }
        }

        [HttpPost("cave")]
        public async Task<CaveResponse> GetCave([FromBody] CaveRequest body)
        {
            var startX = body.Coordinates.X * overworldZoom;
            var startY = body.Coordinates.Y * overworldZoom;
            var result = await new CaveGenerator(100, 100, 2, (int)(settings.CaveSeeds.GetValue(startX, startY, 0) * 100000)).Generate();
            return new CaveResponse
            {
                Map = result.Map,
                Treasure = result.Treasure.Select(c => new GameCoordinate { X = c.x, Y = c.y }).ToArray(),
                Entrance = new GameCoordinate { X = result.Entrance.x, Y = result.Entrance.y },
            };
        }
    }
}
