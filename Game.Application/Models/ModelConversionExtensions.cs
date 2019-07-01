using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Game.Application.Models
{
    public static class ModelConversionExtensions
    {
        public static VisualTerrainType ToApi(this Game.Domain.Terrain.VisualTerrainType visualTerrainType)
        {
            return visualTerrainType switch
            {
                Domain.Terrain.VisualTerrainType.Snow=> VisualTerrainType.Snow,
                Domain.Terrain.VisualTerrainType.SnowWithGrass=> VisualTerrainType.SnowWithGrass,
                Domain.Terrain.VisualTerrainType.SnowWithBushes=> VisualTerrainType.SnowWithBushes,
                Domain.Terrain.VisualTerrainType.SnowWithConiferousForests=> VisualTerrainType.SnowWithConiferousForests,
                Domain.Terrain.VisualTerrainType.Grassland=> VisualTerrainType.Grassland,
                Domain.Terrain.VisualTerrainType.Bushes=> VisualTerrainType.Bushes,
                Domain.Terrain.VisualTerrainType.ConiferousForests=> VisualTerrainType.ConiferousForests,
                Domain.Terrain.VisualTerrainType.HotDeserts=> VisualTerrainType.HotDeserts,
                Domain.Terrain.VisualTerrainType.DeciduousForests=> VisualTerrainType.DeciduousForests,
                Domain.Terrain.VisualTerrainType.TropicalRainForests=> VisualTerrainType.TropicalRainForests,
                Domain.Terrain.VisualTerrainType.ShallowWater=> VisualTerrainType.ShallowWater,
                Domain.Terrain.VisualTerrainType.DeepWater=> VisualTerrainType.DeepWater,
                Domain.Terrain.VisualTerrainType.SnowyMountains=> VisualTerrainType.SnowyMountains,
                Domain.Terrain.VisualTerrainType.Mountains=> VisualTerrainType.Mountains,
                Domain.Terrain.VisualTerrainType.SnowyHills=> VisualTerrainType.SnowyHills,
                Domain.Terrain.VisualTerrainType.Hills=> VisualTerrainType.Hills,
                Domain.Terrain.VisualTerrainType.Ice=> VisualTerrainType.Ice,
                Domain.Terrain.VisualTerrainType.Cave=> VisualTerrainType.Cave,
                Domain.Terrain.VisualTerrainType.Shrine=> VisualTerrainType.Shrine,
                Domain.Terrain.VisualTerrainType.Teleportal=> VisualTerrainType.Teleportal,
                Domain.Terrain.VisualTerrainType.ShrineFancyTile=> VisualTerrainType.ShrineFancyTile,
                Domain.Terrain.VisualTerrainType.DarkRedTile=> VisualTerrainType.DarkRedTile,
                Domain.Terrain.VisualTerrainType.Flowers=> VisualTerrainType.Flowers,
                Domain.Terrain.VisualTerrainType.DogStatue => VisualTerrainType. DogStatue,

                _ => VisualTerrainType.Grassland
            };
        }
    }
}
