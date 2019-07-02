using Game.Application.Controllers;
using Game.Domain.Caves;
using Game.Domain.Terrain;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Game.Application.Controllers
{
    using Game.Application.Models;

    public partial class TerrainApiController : ITerrainApiController
    {
        private static readonly TerrainSettings settings = new TerrainSettingsGenerator().Generate();
        private static readonly VisualTerrainType[][] shrine = new[]
        {
            new[] { VisualTerrainType.Flowers, VisualTerrainType.Flowers, VisualTerrainType.Flowers, VisualTerrainType.Flowers, VisualTerrainType.Flowers, },
            new[] { VisualTerrainType.Flowers, VisualTerrainType.ShrineFancyTile, VisualTerrainType.ShrineFancyTile, VisualTerrainType.ShrineFancyTile, VisualTerrainType.Flowers, },
            new[] { VisualTerrainType.Flowers, VisualTerrainType.ShrineFancyTile, VisualTerrainType.Teleportal, VisualTerrainType.ShrineFancyTile, VisualTerrainType.Flowers, },
            new[] { VisualTerrainType.Flowers, VisualTerrainType.ShrineFancyTile, VisualTerrainType.ShrineFancyTile, VisualTerrainType.ShrineFancyTile, VisualTerrainType.Flowers, },
            new[] { VisualTerrainType.Flowers, VisualTerrainType.Flowers, VisualTerrainType.Flowers, VisualTerrainType.Flowers, VisualTerrainType.Flowers, },
        };

        private static readonly SpecialLocation[] specialLocations = new[]
        {
            new SpecialLocation { Initial = new IntCoordinate { X = 0, Y = 0 }, Target = new IntCoordinate { X = 3, Y = 11 } }
        };

        public Task<IActionResult> GetTerrainAsync([System.ComponentModel.DataAnnotations.Required] [FromBody] Models.GetTerrainRequest body)
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
                                                    .Select(point => GetTerrainType(point, body.IsDetail.Value).Select(v => v.ToString("g")).ToList())
                                                    .ToList()
                                )
                            .ToList(),
                SpecialLocations = body.IsDetail.Value 
                    ? new List<SpecialLocation>()
                    : specialLocations.Where(l => l.Initial.X >= body.Coordinate.X.Value && l.Initial.X < body.Coordinate.X.Value + body.Size.Width.Value
                                               && l.Initial.Y >= body.Coordinate.Y.Value && l.Initial.Y < body.Coordinate.Y.Value + body.Size.Height.Value)
                                      .ToList()
            };
            return Task.FromResult<IActionResult>(Ok(response));
        }

        private IEnumerable<VisualTerrainType> GetTerrainType(TerrainPoint point, bool isDetail)
        {
            if (isDetail)
            {
                yield return settings.DetailVisualizationSpec.Execute(point).ToApi();
            }
            else
            {
                yield return settings.VisualizationSpec.Execute(point).ToApi();
            }
            if (point.IsCave)
            {
                yield return VisualTerrainType.Cave;
            }
            
            {

                if (isDetail)
                {
                    var x = (int)Math.Round(point.coordinates.x / TerrainSettings.localGridSize) + 2;
                    var y = (int)Math.Round(point.coordinates.y / TerrainSettings.localGridSize) + 2;
                    if (x >= 0 && x < shrine.Length && y >= 0 && y < shrine[x].Length)
                    {
                        yield return shrine[x][y];
                    }
                }
                else if (point.coordinates.x == 0 && point.coordinates.y == 0)
                {
                    yield return VisualTerrainType.Shrine;
                }
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
                Treasure = result.Treasure.Select(c => new IntCoordinate { X = c.x, Y = c.y }).ToList(),
                Entrance = new IntCoordinate { X = result.Entrance.x, Y = result.Entrance.y },
            });
        }

    }
}
