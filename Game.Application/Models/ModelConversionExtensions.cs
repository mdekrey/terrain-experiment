using Game.Domain.Terrain;
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
                Domain.Terrain.VisualTerrainType.Snow => VisualTerrainType.Snow,
                Domain.Terrain.VisualTerrainType.SnowWithGrass => VisualTerrainType.SnowWithGrass,
                Domain.Terrain.VisualTerrainType.SnowWithBushes => VisualTerrainType.SnowWithBushes,
                Domain.Terrain.VisualTerrainType.SnowWithConiferousForests => VisualTerrainType.SnowWithConiferousForests,
                Domain.Terrain.VisualTerrainType.Grassland => VisualTerrainType.Grassland,
                Domain.Terrain.VisualTerrainType.Bushes => VisualTerrainType.Bushes,
                Domain.Terrain.VisualTerrainType.ConiferousForests => VisualTerrainType.ConiferousForests,
                Domain.Terrain.VisualTerrainType.HotDeserts => VisualTerrainType.HotDeserts,
                Domain.Terrain.VisualTerrainType.DeciduousForests => VisualTerrainType.DeciduousForests,
                Domain.Terrain.VisualTerrainType.TropicalRainForests => VisualTerrainType.TropicalRainForests,
                Domain.Terrain.VisualTerrainType.ShallowWater => VisualTerrainType.ShallowWater,
                Domain.Terrain.VisualTerrainType.DeepWater => VisualTerrainType.DeepWater,
                Domain.Terrain.VisualTerrainType.SnowyMountains => VisualTerrainType.SnowyMountains,
                Domain.Terrain.VisualTerrainType.Mountains => VisualTerrainType.Mountains,
                Domain.Terrain.VisualTerrainType.SnowyHills => VisualTerrainType.SnowyHills,
                Domain.Terrain.VisualTerrainType.Hills => VisualTerrainType.Hills,
                Domain.Terrain.VisualTerrainType.Ice => VisualTerrainType.Ice,
                Domain.Terrain.VisualTerrainType.Cave => VisualTerrainType.Cave,
                Domain.Terrain.VisualTerrainType.Shrine => VisualTerrainType.Shrine,
                Domain.Terrain.VisualTerrainType.Teleportal => VisualTerrainType.Teleportal,
                Domain.Terrain.VisualTerrainType.ShrineFancyTile => VisualTerrainType.ShrineFancyTile,
                Domain.Terrain.VisualTerrainType.DarkRedTile => VisualTerrainType.DarkRedTile,
                Domain.Terrain.VisualTerrainType.Flowers => VisualTerrainType.Flowers,
                Domain.Terrain.VisualTerrainType.DogStatue => VisualTerrainType.DogStatue,

                _ => VisualTerrainType.Grassland
            };
        }

        public static PawnType ToApi(this Game.Domain.Characters.PawnType pawnType)
        {
            return pawnType switch
            {
                Game.Domain.Characters.PawnType.Hero => PawnType.Hero,
                Game.Domain.Characters.PawnType.MaleSoldier => PawnType.MaleSoldier,
                Game.Domain.Characters.PawnType.FemaleSoldier => PawnType.FemaleSoldier,
                Game.Domain.Characters.PawnType.MaleSage => PawnType.MaleSage,
                Game.Domain.Characters.PawnType.FemaleSage => PawnType.FemaleSage,
                Game.Domain.Characters.PawnType.MaleGoofoff => PawnType.MaleGoofoff,
                Game.Domain.Characters.PawnType.FemaleGoofoff => PawnType.FemaleGoofoff,
                Game.Domain.Characters.PawnType.MaleWizard => PawnType.MaleWizard,
                Game.Domain.Characters.PawnType.FemaleWizard => PawnType.FemaleWizard,
                Game.Domain.Characters.PawnType.MaleMerchant => PawnType.MaleMerchant,
                Game.Domain.Characters.PawnType.FemaleMerchant => PawnType.FemaleMerchant,
                Game.Domain.Characters.PawnType.MalePilgrim => PawnType.MalePilgrim,
                Game.Domain.Characters.PawnType.FemalePilgrim => PawnType.FemalePilgrim,
                Game.Domain.Characters.PawnType.MaleFighter => PawnType.MaleFighter,
                Game.Domain.Characters.PawnType.FemaleFighter => PawnType.FemaleFighter,
                Game.Domain.Characters.PawnType.Woman => PawnType.Woman,
                Game.Domain.Characters.PawnType.Guard => PawnType.Guard,
                Game.Domain.Characters.PawnType.OldMan => PawnType.OldMan,
                Game.Domain.Characters.PawnType.Priest1 => PawnType.Priest1,
                Game.Domain.Characters.PawnType.Priest2 => PawnType.Priest2,
                Game.Domain.Characters.PawnType.Princess => PawnType.Princess,
                Game.Domain.Characters.PawnType.King => PawnType.King,
                Game.Domain.Characters.PawnType.Ship => PawnType.Ship,
                Game.Domain.Characters.PawnType.Demon => PawnType.Demon,
                Game.Domain.Characters.PawnType.HornedMan => PawnType.HornedMan,
                Game.Domain.Characters.PawnType.Boy => PawnType.Boy,
                Game.Domain.Characters.PawnType.Bard => PawnType.Bard,
                Game.Domain.Characters.PawnType.Seneschal => PawnType.Seneschal,
                Game.Domain.Characters.PawnType.Man => PawnType.Man,
                Game.Domain.Characters.PawnType.Warrior => PawnType.Warrior,
                Game.Domain.Characters.PawnType.Bellydancer => PawnType.Bellydancer,
                Game.Domain.Characters.PawnType.Ghost => PawnType.Ghost,
                Game.Domain.Characters.PawnType.Shopkeeper => PawnType.Shopkeeper,
                Game.Domain.Characters.PawnType.Horse => PawnType.Horse,
                Game.Domain.Characters.PawnType.Cat => PawnType.Cat,
                Game.Domain.Characters.PawnType.Girl1 => PawnType.Girl1,
                Game.Domain.Characters.PawnType.Girl2 => PawnType.Girl2,
                Game.Domain.Characters.PawnType.Dragon => PawnType.Dragon,
                Game.Domain.Characters.PawnType.Girl3 => PawnType.Girl3,
                Game.Domain.Characters.PawnType.Elf => PawnType.Elf,
                Game.Domain.Characters.PawnType.Slime => PawnType.Slime,
                Game.Domain.Characters.PawnType.Dwarf => PawnType.Dwarf,
                Game.Domain.Characters.PawnType.Prisoner => PawnType.Prisoner,
                Game.Domain.Characters.PawnType.Dancer => PawnType.Dancer,
                Game.Domain.Characters.PawnType.Skeleton => PawnType.Skeleton,

                _ => PawnType.Hero
            };
        }

        public static Character ToApi(this Game.Domain.Characters.Character character, bool isDetail)
        {
            return new Character
            {
                Id = character.Id,
                PawnType = character.PawnType.ToApi().ToString("g"),
                Coordinate = character.Coordinate.ToApi(isDetail)
            };
        }

        public static IntCoordinate ToApi(this Game.Domain.GameCoordinate gameCoordinate, bool isDetail)
        {
            return new IntCoordinate
            {
                X = (int)Math.Round(gameCoordinate.x / (isDetail ? TerrainSettings.localGridSizeDiff : 1)),
                Y = (int)Math.Round(gameCoordinate.y / (isDetail ? TerrainSettings.localGridSizeDiff : 1)),
            };
        }

        public static Game.Domain.GameCoordinate FromApi(this IntCoordinate coordinate, bool isDetail)
        {
            return new Game.Domain.GameCoordinate(
                coordinate.X.Value * (isDetail ? TerrainSettings.localGridSizeDiff : 1),
                coordinate.Y.Value * (isDetail ? TerrainSettings.localGridSizeDiff : 1));
        }

        public static Game.Domain.Direction FromApi(this Direction direction)
        {
            return direction switch
            {
                Direction.Down => Game.Domain.Direction.Down,
                Direction.Up => Game.Domain.Direction.Up,
                Direction.Right => Game.Domain.Direction.Right,
                Direction.Left => Game.Domain.Direction.Left,

                _ => Game.Domain.Direction.Down
            };
        }

    }
}
