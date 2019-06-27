using LibNoise;
using LibNoise.Generator;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Game.Domain.Caves
{
    public class CaveGenerator
    {
        const int deathLimit = 3;
        const int birthLimit = 4;
        const int treasureLimit = 5;

        private readonly int width;
        private readonly int height;
        private readonly int normalizationRounds;
        private readonly ModuleBase perlin;
        private bool[][] map;
        private readonly Task<Cave> building;



        bool Random(int x, int y) => perlin.GetValue(x / 3f, y / 3f, 0) < 0;

        public CaveGenerator(int width, int height, int normalizationRounds, int seed)
        {
            this.width = width;
            this.height = height;
            this.normalizationRounds = normalizationRounds;

            this.perlin = new Perlin(lacunarity: 3.4f, seed: seed);
            this.map = (from y in Enumerable.Range(0, height)
                        select (from x in Enumerable.Range(0, width)
                                select Random(x, y)).ToArray()).ToArray();
            building = BuildMap();
        }

        private int CountAliveNeighbours(CaveCoordinate position)
        {
            var count = 0;
            foreach (var dir in CaveCoordinate.EightDirections)
            {
                var nb = dir + position;
                //If it's at the edges, consider it to be REALLY solid
                if (
                  nb.x < 0 ||
                  nb.y < 0 ||
                  nb.x >= width ||
                  nb.y >= height
                )
                {
                    count = count + 2;
                }
                else if (this.map[nb.y][nb.x])
                {
                    count = count + 1;
                }
            }
            return count;
        }

        private async Task<Cave> BuildMap()
        {
            await Task.Yield();
            for (var count = 0; count < this.normalizationRounds; count++)
            {
                this.DoSimulationStep();
            }

            this.FillSmallerAreas();
            this.RemoveSingleY();

            var treasure = FindTreasure();
            return new Cave
            {
                Map = map,
                Entrance = treasure[0],
                Treasure = treasure.Skip(1).ToArray(),
            };
        }

        private CaveCoordinate[] FindTreasure()
        {
            return (from y in this.map.Select((_, y) => y)
                    from v in this.map[y].Select((currentCell, x) => (currentCell, x))
                    let currentCell = v.currentCell
                    where !currentCell
                    let x = v.x
                    let r = new CaveCoordinate(x, y)
                    let nbs = this.CountAliveNeighbours(r)
                    where nbs >= treasureLimit
                    select r).ToArray();
        }

        private void FillSmallerAreas()
        {
            var areas = new Dictionary<string, int>();
            string[][] currentAreas = this.map.Select(_ => new string[_.Length]).ToArray();

            var threshold = (this.width * this.height) / 4;
            string shortcutSymbol = null;
            for (var y = 0; y < this.map.Length && shortcutSymbol == null; y++)
            {
                for (var x = 0; x < this.map[y].Length && shortcutSymbol == null; x++)
                {
                    if (!this.map[y][x] && currentAreas[y][x] == null)
                    {
                        var (symbol, count) = this.FloodFill(
                          new CaveCoordinate(x, y),
                          currentAreas,
                          areas
                        );
                        if (count > threshold)
                        {
                            shortcutSymbol = symbol;
                        }
                    }
                }
            }
            var topSymbol =
              shortcutSymbol ?? areas.OrderByDescending(v => v.Value).First().Key;

            for (var y = 0; y < this.map.Length; y++)
            {
                for (var x = 0; x < this.map[y].Length; x++)
                {
                    if (currentAreas[y][x] != topSymbol)
                    {
                        this.map[y][x] = true;
                    }
                }
            }
        }

        private (string symbol, int count) FloodFill(CaveCoordinate start, string[][] currentAreas, Dictionary<string, int> areas)
        {
            var symbol = $"{start.x}x{start.y}";
            var count = 0;
            var queue = new Queue<CaveCoordinate>();
            queue.Enqueue(start);
            while (queue.Count > 0)
            {
                var n = queue.Dequeue();
                foreach (var dir in CaveCoordinate.FourDirections)
                {
                    var r = (n + dir);
                    if (!this.map[r.y][r.x] && currentAreas[r.y][r.x] == null)
                    {
                        count++;
                        currentAreas[r.y][r.x] = symbol;
                        queue.Enqueue(r);
                    }
                }
            }
            areas[symbol] = count;
            return (symbol, count);
        }

        void RemoveSingleY()
        {
            for (var y = 1; y < this.map.Length - 1; y++)
            {
                for (var x = 0; x < this.map[y].Length; x++)
                {
                    if (
                      this.map[y][x] &&
                      !this.map[y + 1][x] &&
                      !this.map[y - 1][x]
                    )
                    {
                        this.map[y][x] = false;
                    }
                }
            }
        }

        private void DoSimulationStep()
        {
            this.map = this.map.Select((_, y) => _.Select((currentCell, x) =>
            {
                var nbs = CountAliveNeighbours(new CaveCoordinate(x, y));
                if (currentCell)
                {
                    return nbs >= deathLimit;
                }
                else
                {
                    return nbs > birthLimit;
                }
            }).ToArray()).ToArray();
        }

        public Task<Cave> Generate()
        {
            return building;
        }
    }
}
