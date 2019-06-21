import { TemperatureCategory } from "./TemperatureCategory";
import { BiomeCategory } from "./BiomeCategory";
import { VisualTerrainType } from "./VisualTerrainType";
import { AltitudeCategory } from "./WaterCategory";
import { DataDrivenInput } from "../utils/DataDrivenComposition";
import { TerrainSpec } from "./terrain-specifications";

const biomeMap: Record<BiomeCategory, VisualTerrainType> = {
  [BiomeCategory.Permafrost]: "Permafrost",
  [BiomeCategory.Tundra]: "Tundra",
  [BiomeCategory.ColdParklands]: "ColdParklands",
  [BiomeCategory.ConiferousForests]: "ConiferousForests",
  [BiomeCategory.CoolDeserts]: "CoolDeserts",
  [BiomeCategory.Steppes]: "Steppes",
  [BiomeCategory.MixedForests]: "MixedForests",
  [BiomeCategory.HotDeserts]: "HotDeserts",
  [BiomeCategory.Chaparral]: "Chaparral",
  [BiomeCategory.DeciduousForests]: "DeciduousForests",
  [BiomeCategory.Savanna]: "Savanna",
  [BiomeCategory.TropicalSeasonalForests]: "TropicalSeasonalForests",
  [BiomeCategory.TropicalRainForests]: "TropicalRainForests"
};

const biomeResult = {
  target: "Switch",
  arguments: [
    Object.keys(biomeMap)
      .map(k => Number(k) as BiomeCategory)
      .map(key => [
        { target: "IsBiome", arguments: [key] },
        { target: "Result", arguments: [biomeMap[key]] }
      ]),
    { target: "Result", arguments: "CoolDeserts" }
  ]
};

const biomeDetailMap: Record<BiomeCategory, [number, VisualTerrainType][]> = {
  [BiomeCategory.Permafrost]: [[0, "Permafrost"], [0.8, "Tundra"]],
  [BiomeCategory.Tundra]: [[0, "Tundra"], [0.85, "ColdParklands"]],
  [BiomeCategory.ColdParklands]: [
    [0, "Tundra"],
    [0.05, "ColdParklands"],
    [0.85, "ConiferousForests"]
  ],
  [BiomeCategory.ConiferousForests]: [
    [0, "ConiferousForests"],
    [0.65, "Tundra"]
  ],
  [BiomeCategory.CoolDeserts]: [[0, "CoolDeserts"], [0.85, "Steppes"]],
  [BiomeCategory.Steppes]: [[0, "CoolDeserts"], [0.3, "Steppes"]],
  [BiomeCategory.MixedForests]: [
    [0, "MixedForests"],
    [0.5, "DeciduousForests"],
    [0.9, "CoolDeserts"]
  ],
  [BiomeCategory.HotDeserts]: [[0, "HotDeserts"]],
  [BiomeCategory.Chaparral]: [
    [0, "Chaparral"],
    [0.5, "DeciduousForests"],
    [0.6, "Chaparral"],
    [0.8, "CoolDeserts"]
  ],
  [BiomeCategory.DeciduousForests]: [
    [0, "DeciduousForests"],
    [0.5, "TropicalRainForests"],
    [0.55, "DeciduousForests"],
    [0.8, "Chaparral"],
    [0.9, "CoolDeserts"]
  ],
  [BiomeCategory.Savanna]: [
    [0, "Savanna"],
    [0.5, "HotDeserts"],
    [0.625, "DeciduousForests"],
    [0.65, "Savanna"]
  ],
  [BiomeCategory.TropicalSeasonalForests]: [
    [0, "TropicalRainForests"],
    [0.5, "Chaparral"],
    [0.6, "TropicalRainForests"],
    [0.7, "DeciduousForests"]
  ],
  [BiomeCategory.TropicalRainForests]: [
    [0, "TropicalRainForests"],
    [0.7, "DeciduousForests"]
  ]
};

const biomeDetailResult = {
  target: "Switch",
  arguments: [
    Object.keys(biomeDetailMap)
      .map(k => Number(k) as BiomeCategory)
      .map(key =>
        biomeDetailMap[key]
          .sort((a, b) => b[0] - a[0])
          .map(([value, result]) => [
            {
              target: "And",
              arguments: [
                { target: "IsBiome", arguments: [key] },
                { target: "IsFeatureGreaterThanConstant", arguments: [value] }
              ]
            },
            { target: "Result", arguments: [result] }
          ])
      )
      .reduce((p, n) => [...p, ...n], []),
    biomeResult
  ]
};

const isSnowy = {
  target: "Or",
  arguments: [
    { target: "IsTemperature", arguments: [TemperatureCategory.Polar] },
    { target: "IsTemperature", arguments: [TemperatureCategory.Subpolar] },
    { target: "IsTemperature", arguments: [TemperatureCategory.Boreal] }
  ]
};

const hillsOnly = {
  target: "If",
  arguments: [
    isSnowy,
    { target: "Result", arguments: ["SnowyHills"] },
    { target: "Result", arguments: ["Hills"] }
  ]
};

const mountains = {
  target: "Switch",
  arguments: [
    [
      [
        {
          target: "And",
          arguments: [
            { target: "IsAltitude", arguments: [AltitudeCategory.Mountains] },
            isSnowy
          ]
        },
        { target: "Result", arguments: ["SnowyMountains"] }
      ],
      [
        {
          target: "And",
          arguments: [
            { target: "IsAltitude", arguments: [AltitudeCategory.Hills] },
            isSnowy
          ]
        },
        { target: "Result", arguments: ["SnowyHills"] }
      ],
      [
        { target: "IsAltitude", arguments: [AltitudeCategory.Mountains] },
        { target: "Result", arguments: ["Mountains"] }
      ]
    ],
    { target: "Result", arguments: ["Hills"] }
  ]
};

const waterOrIceSwitchFragment = [
  [
    {
      target: "And",
      arguments: [
        {
          target: "Or",
          arguments: [
            { target: "IsAltitude", arguments: [AltitudeCategory.DeepWater] },
            { target: "IsAltitude", arguments: [AltitudeCategory.ShallowWater] }
          ]
        },
        { target: "IsTemperature", arguments: [TemperatureCategory.Polar] },
        { target: "IsFeatureGreaterThanHeat", arguments: [0.235, 0] }
      ]
    },
    { target: "Result", arguments: ["Ice"] }
  ],
  [
    { target: "IsAltitude", arguments: [AltitudeCategory.DeepWater] },
    { target: "Result", arguments: ["DeepWater"] }
  ],
  [
    { target: "IsAltitude", arguments: [AltitudeCategory.ShallowWater] },
    { target: "Result", arguments: ["ShallowWater"] }
  ]
];

export const VisualizationSpec: DataDrivenInput<any, TerrainSpec<boolean | VisualTerrainType>> = {
  target: "Switch",
  arguments: [
    [
      ...waterOrIceSwitchFragment,
      [
        {
          target: "Not",
          arguments: [
            { target: "IsAltitude", arguments: [AltitudeCategory.None] }
          ]
        },
        {
          target: "If",
          arguments: [
            {
              target: "IsFeatureGreaterThanAltitude",
              arguments: [1, -0.05]
            },
            hillsOnly,
            mountains
          ]
        }
      ]
    ],
    biomeResult
  ]
};

const isHill = {
  target: "Or",
  arguments: [
    { target: "IsAltitude", arguments: [AltitudeCategory.Hills] },
    { target: "IsFeatureGreaterThanConstant", arguments: [0.05] }
  ]
};

export const DetailVisualizationSpec: DataDrivenInput<any, TerrainSpec<boolean | VisualTerrainType>> = {
  target: "Switch",
  arguments: [
    [
      ...waterOrIceSwitchFragment,
      [
        {
          target: "Not",
          arguments: [
            {
              target: "Or",
              arguments: [
                { target: "IsFeatureGreaterThanConstant", arguments: [0.3] },
                { target: "IsAltitude", arguments: [AltitudeCategory.None] }
              ]
            }
          ]
        },
        { target: "If", arguments: [isHill, hillsOnly, mountains] }
      ]
    ],
    biomeDetailResult
  ]
};
