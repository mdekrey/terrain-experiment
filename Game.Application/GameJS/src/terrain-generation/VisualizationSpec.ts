import {
  IfSpecification,
  ISpecification,
  AndSpecification,
  OrSpecification,
  SwitchSpecification,
  NotSpecification,
  SwitchPart
} from "../utils/specifications";

import { TemperatureCategory } from "./TemperatureCategory";
import { HumidityCategory } from "./HumidityCategory";
import { BiomeCategory } from "./BiomeCategory";
import { VisualTerrainType } from "./VisualTerrainType";
import { AltitudeCategory } from "./WaterCategory";

export interface TerrainSituation {
  readonly altitude: number;
  readonly heat: number;
  readonly humidity: number;
  readonly feature: number;
  readonly temperatureCategory: TemperatureCategory;
  readonly humidityCategory: HumidityCategory;
  readonly biomeCategory: BiomeCategory;
  readonly altitudeCategory: AltitudeCategory;
}

class Result<TOutput> implements ISpecification<any, TOutput> {
  private readonly result: TOutput;
  constructor(result: TOutput) {
    this.result = result;
  }
  execute() {
    return this.result;
  }
}

abstract class IsValue<TSituation, T>
  implements ISpecification<TSituation, boolean> {
  private readonly expectedValue: T;
  constructor(expectedValue: T) {
    this.expectedValue = expectedValue;
  }

  abstract getActualValue(situation: TSituation): T;

  execute(situation: TSituation): boolean {
    return this.getActualValue(situation) === this.expectedValue;
  }
}

class IsTemperature extends IsValue<TerrainSituation, TemperatureCategory> {
  getActualValue(situation: TerrainSituation): TemperatureCategory {
    return situation.temperatureCategory;
  }
}
class IsAltitude extends IsValue<TerrainSituation, AltitudeCategory> {
  getActualValue(situation: TerrainSituation): AltitudeCategory {
    return situation.altitudeCategory;
  }
}
class IsBiome extends IsValue<TerrainSituation, BiomeCategory> {
  getActualValue(situation: TerrainSituation): BiomeCategory {
    return situation.biomeCategory;
  }
}

abstract class IsFeatureGreaterThanValue
  implements ISpecification<TerrainSituation, boolean> {
  private readonly slope: number;
  private readonly offset: number;
  constructor(slope: number, offset: number) {
    this.slope = slope;
    this.offset = offset;
  }

  abstract getActualValue(situation: TerrainSituation): number;

  execute(situation: TerrainSituation): boolean {
    return (
      situation.feature * this.slope + this.offset >
      this.getActualValue(situation)
    );
  }
}

class IsFeatureGreaterThanHeat extends IsFeatureGreaterThanValue {
  getActualValue(situation: TerrainSituation) {
    return situation.heat;
  }
}

class IsFeatureGreaterThanAltitude extends IsFeatureGreaterThanValue {
  getActualValue(situation: TerrainSituation) {
    return situation.altitude;
  }
}

class IsFeatureGreaterThanConstant extends IsFeatureGreaterThanValue {
  private readonly value: number;
  constructor(value: number) {
    super(1, 0);
    this.value = value;
  }

  getActualValue() {
    return this.value;
  }
}

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
  [BiomeCategory.TropicalRainForests]: "TropicalRainForests",
};

const biomeResult = new SwitchSpecification(
  Object.keys(biomeMap)
    .map(k => Number(k) as BiomeCategory)
    .map((key): SwitchPart<
            TerrainSituation,
            VisualTerrainType
          > => [
            new IsBiome(key),
            new Result(biomeMap[key])
          ]
        ),
  new Result<VisualTerrainType>("CoolDeserts")
);

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
    [0.6, "Savanna"],
    [0.9, "DeciduousForests"]
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

const biomeDetailResult = new SwitchSpecification(
  Object.keys(biomeDetailMap)
    .map(k => Number(k) as BiomeCategory)
    .map(key =>
      biomeDetailMap[key]
        .sort((a, b) => b[0] - a[0])
        .map(
          ([value, result]): SwitchPart<
            TerrainSituation,
            VisualTerrainType
          > => [
            new AndSpecification(
              new IsBiome(key),
              new IsFeatureGreaterThanConstant(value)
            ),
            new Result(result)
          ]
        )
    )
    .reduce((p, n) => [...p, ...n], []),
  biomeResult
);

const isSnowy = new OrSpecification(
  new IsTemperature(TemperatureCategory.Polar),
  new IsTemperature(TemperatureCategory.Subpolar),
  new IsTemperature(TemperatureCategory.Boreal)
);

const hillsOnly = new IfSpecification(
  isSnowy,
  new Result<VisualTerrainType>("SnowyHills"),
  new Result<VisualTerrainType>("Hills")
);

const mountains = new SwitchSpecification(
  [
    [
      new AndSpecification(new IsAltitude(AltitudeCategory.Mountains), isSnowy),
      new Result<VisualTerrainType>("SnowyMountains")
    ],
    [
      new AndSpecification(new IsAltitude(AltitudeCategory.Hills), isSnowy),
      new Result<VisualTerrainType>("SnowyHills")
    ],
    [
      new AndSpecification(new IsAltitude(AltitudeCategory.Mountains)),
      new Result<VisualTerrainType>("Mountains")
    ]
  ],
  new Result<VisualTerrainType>("Hills")
);

const waterOrIceSwitchFragment: SwitchPart<
  TerrainSituation,
  VisualTerrainType
>[] = [
  [
    new AndSpecification(
      new OrSpecification(new IsAltitude(AltitudeCategory.DeepWater), new IsAltitude(AltitudeCategory.ShallowWater)),
      new IsTemperature(TemperatureCategory.Polar),
      new IsFeatureGreaterThanHeat(0.235, 0)
    ),
    new Result<VisualTerrainType>("Ice")
  ],
  [
    new IsAltitude(AltitudeCategory.DeepWater),
    new Result<VisualTerrainType>("DeepWater")
  ],
  [
    new IsAltitude(AltitudeCategory.ShallowWater),
    new Result<VisualTerrainType>("ShallowWater")]
];

export const VisualizationSpec = new SwitchSpecification(
  [
    ...waterOrIceSwitchFragment,
    [
      new NotSpecification(
        new OrSpecification(
          new IsFeatureGreaterThanAltitude(1, -0.05),
          new IsAltitude(AltitudeCategory.None)
        )
      ),
      mountains
    ]
  ],
  biomeResult
);

const isHill = new OrSpecification(
  new IsAltitude(AltitudeCategory.Hills),
  new IsFeatureGreaterThanConstant(0.05)
);

export const DetailVisualizationSpec = new SwitchSpecification(
  [
    ...waterOrIceSwitchFragment,
    [
      new NotSpecification(
        new OrSpecification(
          new IsFeatureGreaterThanConstant(0.2),
          new IsAltitude(AltitudeCategory.None)
        )
      ),
      new IfSpecification(isHill, hillsOnly, mountains)
    ]
  ],
  biomeDetailResult
);
