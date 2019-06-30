using Game.Application.Controllers;
using Game.Application.Models;
using Game.Domain.Caves;
using Game.Domain.Terrain;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Game.Application.Controllers
{
    public partial class TerrainApiController : ITerrainApiController
    {
        private static readonly TerrainSettings settings = new TerrainSettingsGenerator().Generate();

        public Task<IActionResult> GetTerrainAsync([FromBody] Models.GetTerrainRequest body)
        {
            var stepSize = body.IsDetail.Value ? TerrainSettings.localGridSize : TerrainSettings.overworldGridSize;
            var startX = body.Coordinate.X.Value * stepSize;
            var startY = body.Coordinate.Y.Value * stepSize;
            var response = new GetTerrainResponse
            {
                Terrain = Enumerable.Range(0, body.Size.Height.Value)
                            .Select(iy => iy * stepSize + startY)
                            .Select(y => Enumerable.Range(0, body.Size.Width.Value)
                                                    .Select(ix => ix * stepSize + startX)
                                                    .Select(x => settings.GenerateSituation(x, y))
                                                    .Select(point => GetTerrainType(point, body.IsDetail.Value).Cast<int>().Cast<int?>().ToList())
                                                    .ToList()
                                )
                            .ToList()
            };
            return Task.FromResult<IActionResult>(Ok(response));
        }

        private IEnumerable<VisualTerrainType> GetTerrainType(TerrainPoint point, bool isDetail)
        {
            if (isDetail)
            {
                yield return settings.DetailVisualizationSpec.Execute(point);
            }
            else
            {
                yield return settings.VisualizationSpec.Execute(point);
            }
            if (point.IsCave)
            {
                yield return VisualTerrainType.Cave;
            }
        }

        public async Task<IActionResult> GetCaveAsync([FromBody] GetCaveRequest body)
        {
            var startX = body.Coordinate.X.Value * TerrainSettings.overworldGridSize;
            var startY = body.Coordinate.Y.Value * TerrainSettings.overworldGridSize;
            var result = await new CaveGenerator(100, 100, 2, (int)(settings.CaveSeeds.GetValue(startX, startY, 0) * 100000)).Generate();
            return Ok(new GetCaveResponse
            {
                IsSolid = result.Map.Select(row => row.Cast<bool?>().ToList()).ToList(),
                Treasure = result.Treasure.Select(c => new GameCoordinate { X = c.x, Y = c.y }).ToList(),
                Entrance = new GameCoordinate { X = result.Entrance.x, Y = result.Entrance.y },
            });
        }

    }
}
