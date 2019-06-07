using System;
using System.Collections.Generic;
using System.Text;

namespace Game.Domain
{
    public static class TerrainExtensions
    {
        public static VisualTerrainType ToVisual(this BiomeCategory biome) => biome switch
        {
            BiomeCategory.Permafrost => VisualTerrainType.Permafrost,
            BiomeCategory.Tundra => VisualTerrainType.Tundra,
            BiomeCategory.ColdParklands => VisualTerrainType.ColdParklands,
            BiomeCategory.ConiferousForests => VisualTerrainType.ConiferousForests,
            BiomeCategory.CoolDeserts => VisualTerrainType.CoolDeserts,
            BiomeCategory.Steppes => VisualTerrainType.Steppes,
            BiomeCategory.MixedForests => VisualTerrainType.MixedForests,
            BiomeCategory.HotDeserts => VisualTerrainType.HotDeserts,
            BiomeCategory.Chaparral => VisualTerrainType.Chaparral,
            BiomeCategory.DeciduousForests => VisualTerrainType.DeciduousForests,
            BiomeCategory.Savanna => VisualTerrainType.Savanna,
            BiomeCategory.TropicalSeasonalForests => VisualTerrainType.TropicalSeasonalForests,
            BiomeCategory.TropicalRainForests => VisualTerrainType.TropicalRainForests,
            _ => VisualTerrainType.CoolDeserts
        };
    }
}
