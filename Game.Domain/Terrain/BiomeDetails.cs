using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Text;

namespace Game.Domain.Terrain
{
    public static class BiomeDetails
    {
        public static readonly ImmutableDictionary<TemperatureCategory, ImmutableDictionary<HumidityCategory, BiomeLabel>> biomeLabels = new Dictionary<TemperatureCategory, BiomeLabel[]> {
            {TemperatureCategory.Polar, new[] {
                BiomeLabel.PolarDesert,
                BiomeLabel.PolarIce,
                BiomeLabel.PolarIce
            }},
            {TemperatureCategory.Subpolar, new[] {
                BiomeLabel.SubpolarDryTundra,
                BiomeLabel.SubpolarMoistTundra,
                BiomeLabel.SubpolarWetTundra,
                BiomeLabel.SubpolarRainTundra
            }},
            {TemperatureCategory.Boreal, new[] {
                BiomeLabel.BorealDesert,
                BiomeLabel.BorealDryScrub,
                BiomeLabel.BorealMoistForest,
                BiomeLabel.BorealWetForest,
                BiomeLabel.BorealRainForest
            }},
            {TemperatureCategory.CoolTemperate, new[] {
                BiomeLabel.CoolTemperateDesert,
                BiomeLabel.CoolTemperateDesertScrub,
                BiomeLabel.CoolTemperateSteppe,
                BiomeLabel.CoolTemperateMoistForest,
                BiomeLabel.CoolTemperateWetForest,
                BiomeLabel.CoolTemperateRainForest
            }},
            {TemperatureCategory.WarmTemperate, new[] {
                BiomeLabel.WarmTemperateDesert,
                BiomeLabel.WarmTemperateDesertScrub,
                BiomeLabel.WarmTemperateThornScrub,
                BiomeLabel.WarmTemperateDryForest,
                BiomeLabel.WarmTemperateMoistForest,
                BiomeLabel.WarmTemperateWetForest,
                BiomeLabel.WarmTemperateRainForest
            }},
            {TemperatureCategory.Subtropical, new[] {
                BiomeLabel.SubtropicalDesert,
                BiomeLabel.SubtropicalDesertScrub,
                BiomeLabel.SubtropicalThornScrub,
                BiomeLabel.SubtropicalDryForest,
                BiomeLabel.SubtropicalMoistForest,
                BiomeLabel.SubtropicalWetForest,
                BiomeLabel.SubtropicalRainForest
            }},
            {TemperatureCategory.Tropical, new[] {
                BiomeLabel.TropicalDesert,
                BiomeLabel.TropicalDesertScrub,
                BiomeLabel.TropicalThornWoodland,
                BiomeLabel.TropicalVeryDryForest,
                BiomeLabel.TropicalDryForest,
                BiomeLabel.TropicalMoistForest,
                BiomeLabel.TropicalWetForest,
                BiomeLabel.TropicalRainForest
            } }
        }.ToImmutableDictionary(kvp => kvp.Key, kvp => kvp.Value.Select((label, index) => new KeyValuePair<HumidityCategory, BiomeLabel>((HumidityCategory)index, label)).ToImmutableDictionary());
        public static readonly ImmutableDictionary<BiomeLabel, BiomeCategory> CategoryLookup = new Dictionary<BiomeLabel, BiomeCategory>
        {
            { BiomeLabel.PolarDesert, BiomeCategory.Permafrost  },
            { BiomeLabel.PolarIce, BiomeCategory.Permafrost },
            { BiomeLabel.SubpolarDryTundra, BiomeCategory.Tundra },
            { BiomeLabel.SubpolarMoistTundra, BiomeCategory.Tundra },
            { BiomeLabel.SubpolarWetTundra, BiomeCategory.Tundra },
            { BiomeLabel.SubpolarRainTundra, BiomeCategory.Tundra },
            { BiomeLabel.BorealDesert, BiomeCategory.ColdParklands },
            { BiomeLabel.BorealDryScrub, BiomeCategory.ColdParklands },
            { BiomeLabel.BorealMoistForest, BiomeCategory.ConiferousForests },
            { BiomeLabel.BorealWetForest, BiomeCategory.ConiferousForests },
            { BiomeLabel.BorealRainForest, BiomeCategory.ConiferousForests },
            { BiomeLabel.CoolTemperateDesert, BiomeCategory.CoolDeserts },
            { BiomeLabel.CoolTemperateDesertScrub, BiomeCategory.CoolDeserts },
            { BiomeLabel.CoolTemperateSteppe, BiomeCategory.Steppes },
            { BiomeLabel.CoolTemperateMoistForest, BiomeCategory.MixedForests },
            { BiomeLabel.CoolTemperateWetForest, BiomeCategory.MixedForests },
            { BiomeLabel.CoolTemperateRainForest, BiomeCategory.MixedForests },
            { BiomeLabel.WarmTemperateDesert, BiomeCategory.HotDeserts },
            { BiomeLabel.WarmTemperateDesertScrub, BiomeCategory.HotDeserts },
            { BiomeLabel.WarmTemperateThornScrub, BiomeCategory.Chaparral },
            { BiomeLabel.WarmTemperateDryForest, BiomeCategory.Chaparral },
            { BiomeLabel.WarmTemperateMoistForest, BiomeCategory.DeciduousForests },
            { BiomeLabel.WarmTemperateWetForest, BiomeCategory.DeciduousForests },
            { BiomeLabel.WarmTemperateRainForest, BiomeCategory.DeciduousForests },
            { BiomeLabel.SubtropicalDesert, BiomeCategory.HotDeserts },
            { BiomeLabel.SubtropicalDesertScrub, BiomeCategory.HotDeserts },
            { BiomeLabel.SubtropicalThornScrub, BiomeCategory.Savanna },
            { BiomeLabel.SubtropicalDryForest, BiomeCategory.TropicalSeasonalForests },
            { BiomeLabel.SubtropicalMoistForest, BiomeCategory.TropicalSeasonalForests },
            { BiomeLabel.SubtropicalWetForest, BiomeCategory.TropicalRainForests },
            { BiomeLabel.SubtropicalRainForest, BiomeCategory.TropicalRainForests },
            { BiomeLabel.TropicalDesert, BiomeCategory.HotDeserts },
            { BiomeLabel.TropicalDesertScrub, BiomeCategory.HotDeserts },
            { BiomeLabel.TropicalThornWoodland, BiomeCategory.Savanna },
            { BiomeLabel.TropicalVeryDryForest, BiomeCategory.Savanna },
            { BiomeLabel.TropicalDryForest, BiomeCategory.TropicalSeasonalForests },
            { BiomeLabel.TropicalMoistForest, BiomeCategory.TropicalRainForests },
            { BiomeLabel.TropicalWetForest, BiomeCategory.TropicalRainForests },
            { BiomeLabel.TropicalRainForest, BiomeCategory.TropicalRainForests }
        }.ToImmutableDictionary();
    }
}
