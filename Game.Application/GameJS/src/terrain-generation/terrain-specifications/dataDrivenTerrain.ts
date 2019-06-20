import {
  construct,
  DataDrivenInput,
  DataDrivenConstructorRecords,
} from "../../utils/DataDrivenComposition";
import {
  ISpecification,
  IfSpecification,
  AndSpecification,
  OrSpecification,
  SwitchSpecification,
  NotSpecification,
  Result
} from "../../utils/specifications";
import { VisualTerrainType } from "../VisualTerrainType";
import { TerrainSituation } from "./TerrainSituation";
import { IsBiome } from "./IsBiome";
import { IsFeatureGreaterThanAltitude } from "./IsFeatureGreaterThanAltitude";
import { IsFeatureGreaterThanConstant } from "./IsFeatureGreaterThanConstant";
import { IsFeatureGreaterThanHeat } from "./IsFeatureGreaterThanHeat";
import { IsTemperature } from "./IsTemperature";
import { IsAltitude } from "./IsAltitude";

type TerrainSpec<TOutput> = ISpecification<TerrainSituation, TOutput>;


const booleanConstructors = {
  And: AndSpecification,
  Or: OrSpecification,
  Not: NotSpecification,
  IsBiome,
  IsFeatureGreaterThanAltitude,
  IsFeatureGreaterThanConstant,
  IsFeatureGreaterThanHeat,
  IsTemperature,
  IsAltitude,
  IfBoolean: IfSpecification,
  SwitchBoolean: SwitchSpecification,
};

const visualConstructors = {
  If: IfSpecification,
  Switch: SwitchSpecification,
  Result: Result,
};

const terrainConstructors: DataDrivenConstructorRecords<
  any,
  TerrainSpec<boolean | VisualTerrainType>
> = {
  ...booleanConstructors,
  ...visualConstructors
};

export function dataDrivenTerrainOnly(target: DataDrivenInput<any, TerrainSpec<boolean | VisualTerrainType>>): TerrainSpec<VisualTerrainType> {
  return dataDrivenTerrain(target);
}

export function dataDrivenTerrain<
  T extends DataDrivenInput<any, TerrainSpec<boolean | VisualTerrainType>>
>(target: T) {
  return construct(target, terrainConstructors);
}
