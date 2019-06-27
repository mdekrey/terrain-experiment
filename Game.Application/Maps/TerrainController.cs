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

        public class GetTerrainSettingsRequest
        {
            public int X { get; set; } = 0;
            public int Y { get; set; } = 0;
            public int Width { get; set; } = 100;
            public int Height { get; set; } = 100;
            public bool IsDetail { get; set; } = false;
        }

        [HttpPost]
        public VisualTerrainType[][][] GetTerrainSettings([FromBody] GetTerrainSettingsRequest body)
        {
            var stepSize = body.IsDetail ? localZoom : overworldZoom;
            var startX = body.X * stepSize;
            var startY = body.Y * stepSize;
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

    }
}
