import {
  IfSpecification,
  ISpecification,
  AndSpecification,
  OrSpecification,
  SwitchSpecification,
  NotSpecification
} from "../utils/specifications";

import { TemperatureCategory } from "./TemperatureCategory";
import { HumidityCategory } from "./HumidityCategory";
import { BiomeCategory } from "./BiomeCategory";
import { VisualTerrainType } from "./VisualTerrainType";
import { AltitudeCategory } from "./WaterCategory";
import { neverEver } from "../utils/neverEver";

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

class Result<TOutput> {
  private readonly result: TOutput;
  constructor(result: TOutput) {
    this.result = result;
  }
  execute() {
    return this.result;
  }
}

class IsWaterSpecification
  implements ISpecification<TerrainSituation, boolean> {
  execute(situation: TerrainSituation): boolean {
    const { altitudeCategory } = situation;
    return (
      altitudeCategory === AltitudeCategory.DeepWater ||
      altitudeCategory === AltitudeCategory.ShallowWater
    );
  }
}

class WaterResult
  implements ISpecification<TerrainSituation, VisualTerrainType> {
  execute(situation: TerrainSituation): VisualTerrainType {
    const { altitudeCategory } = situation;
    return altitudeCategory === AltitudeCategory.DeepWater
      ? "DeepWater"
      : "ShallowWater";
  }
}

class MountainResult
  implements ISpecification<TerrainSituation, VisualTerrainType> {
  private readonly isSnowy: boolean;
  constructor(isSnowy: boolean) {
    this.isSnowy = isSnowy;
  }
  execute(situation: TerrainSituation): VisualTerrainType {
    const { altitudeCategory } = situation;
    if (this.isSnowy) {
      return altitudeCategory === AltitudeCategory.Mountains
        ? "SnowyMountains"
        : "SnowyHills";
    } else {
      return altitudeCategory === AltitudeCategory.Mountains
        ? "Mountains"
        : "Hills";
    }
  }
}

class HillResult
  implements ISpecification<TerrainSituation, VisualTerrainType> {
  private readonly isSnowy: boolean;
  constructor(isSnowy: boolean) {
    this.isSnowy = isSnowy;
  }
  execute(): VisualTerrainType {
    if (this.isSnowy) {
      return "SnowyHills";
    } else {
      return "Hills";
    }
  }
}

class BiomeResult
  implements ISpecification<TerrainSituation, VisualTerrainType> {
  constructor() {}

  execute(situation: TerrainSituation): VisualTerrainType {
    const { biomeCategory } = situation;
    switch (biomeCategory) {
      case BiomeCategory.Permafrost:
        return "Permafrost";
      case BiomeCategory.Tundra:
        return "Tundra";
      case BiomeCategory.ColdParklands:
        return "ColdParklands";
      case BiomeCategory.ConiferousForests:
        return "ConiferousForests";
      case BiomeCategory.CoolDeserts:
        return "CoolDeserts";
      case BiomeCategory.Steppes:
        return "Steppes";
      case BiomeCategory.MixedForests:
        return "MixedForests";
      case BiomeCategory.HotDeserts:
        return "HotDeserts";
      case BiomeCategory.Chaparral:
        return "Chaparral";
      case BiomeCategory.DeciduousForests:
        return "DeciduousForests";
      case BiomeCategory.Savanna:
        return "Savanna";
      case BiomeCategory.TropicalSeasonalForests:
        return "TropicalSeasonalForests";
      case BiomeCategory.TropicalRainForests:
        return "TropicalRainForests";
      default:
        return neverEver(biomeCategory);
    }
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

  getActualValue(situation: TerrainSituation) {
    return this.value;
  }
}

class ReturnValue implements ISpecification<any, VisualTerrainType> {
  private readonly returnValue: VisualTerrainType;
  constructor(returnValue: VisualTerrainType) {
    this.returnValue = returnValue;
  }
  execute() {
    return this.returnValue;
  }
}

const biomeDetailMap: Record<BiomeCategory, [number, VisualTerrainType][]> = {
  [BiomeCategory.Permafrost]: [[0, "Permafrost"], [0.8, "Tundra"]],
  [BiomeCategory.Tundra]: [[0, "Tundra"], [0.85, "ColdParklands"]],
  [BiomeCategory.ColdParklands]: [[0, "Tundra"], [0.05, "ColdParklands"], [0.85, "ConiferousForests"]],
  [BiomeCategory.ConiferousForests]: [[0, "ConiferousForests"], [0.65, "Tundra"]],
  [BiomeCategory.CoolDeserts]: [],
  // if (this.feature > 0.85) {
  //   return "Steppes";
  // }
  // break;
  [BiomeCategory.Steppes]: [],
  // if (this.feature < 0.3) {
  //   return "CoolDeserts";
  // }
  // break;
  [BiomeCategory.MixedForests]: [],
  //   if (this.feature > 0.9) {
  //     return "CoolDeserts";
  //   }
  // if (this.feature > 0.5) {
  //   return "DeciduousForests";
  // }
  // break;
  [BiomeCategory.HotDeserts]: [],
  //       // TODO: Hot deserts have no variety in the spritemap
  //       break;
  [BiomeCategory.Chaparral]: [],
  //       if (this.feature > 0.5 && this.feature < 0.6) {
  //         return "DeciduousForests";
  //       }
  //       if (this.feature > 0.8) {
  //   return "CoolDeserts";
  // }
  // break;
  [BiomeCategory.DeciduousForests]: [],
  // if (this.feature > 0.5 && this.feature < 0.55) {
  //   return "TropicalRainForests";
  // }
  // if (this.feature > 0.9) {
  //   return "CoolDeserts";
  // }
  // if (this.feature > 0.8) {
  //   return "Chaparral";
  // }
  // break;
  [BiomeCategory.Savanna]: [],
  // if (this.feature > 0.5 && this.feature < 0.6) {
  //   return "HotDeserts";
  // }
  // if (this.feature > 0.9) {
  //   return "DeciduousForests";
  // }
  // break;
  [BiomeCategory.TropicalSeasonalForests]: [],
  // if (this.feature > 0.5 && this.feature < 0.6) {
  //   return "Chaparral";
  // }
  // if (this.feature > 0.7) {
  //   return "DeciduousForests";
  // }
  // break;
  [BiomeCategory.TropicalRainForests]: []
  // if (this.feature > 0.7) {
  //   return "DeciduousForests";
  // }
  // break;
};

const isSnowy = new OrSpecification(
  new IsTemperature(TemperatureCategory.Polar),
  new IsTemperature(TemperatureCategory.Subpolar),
  new IsTemperature(TemperatureCategory.Boreal)
);

export const VisualizationSpec = new IfSpecification<
  TerrainSituation,
  VisualTerrainType
>(
  new IsWaterSpecification(),
  new IfSpecification(
    new AndSpecification(
      new IsTemperature(TemperatureCategory.Polar),
      new IsFeatureGreaterThanHeat(0.235, 0)
    ),
    new Result("Ice"),
    new WaterResult()
  ),
  new IfSpecification(
    new NotSpecification(
      new OrSpecification(
        new IsFeatureGreaterThanAltitude(1, -0.05),
        new IsAltitude(AltitudeCategory.None)
      )
    ),
    new IfSpecification(
      isSnowy,
      new MountainResult(true),
      new MountainResult(false)
    ),
    new BiomeResult()
  )
);

const isHill = new OrSpecification(
  new IsAltitude(AltitudeCategory.Hills),
  new IsFeatureGreaterThanConstant(0.05),
)

export const DetailVisualizationSpec = new IfSpecification<
  TerrainSituation,
  VisualTerrainType
>(
  new IsWaterSpecification(),
  new IfSpecification(
    new AndSpecification(
      new IsTemperature(TemperatureCategory.Polar),
      new IsFeatureGreaterThanHeat(0.235, 0)
    ),
    new Result("Ice"),
    new WaterResult()
  ),
  new SwitchSpecification(
    [
      [
        new NotSpecification(
          new OrSpecification(
            new IsFeatureGreaterThanConstant(0.2),
            new IsAltitude(AltitudeCategory.None)
          )
        ),
        new SwitchSpecification(
          [
            [new AndSpecification(isHill, isSnowy), new HillResult(true)],
            [isHill, new HillResult(false)],
            [isSnowy, new MountainResult(true)]
          ],
          new MountainResult(false)
        )
      ]
    ],
    new BiomeResult()
  )
);
