import {
  DataDrivenConstructor,
  DataDrivenInput
} from "../utils/DataDrivenComposition";
import { libnoise } from "libnoise";
import { VisualTerrainType } from "./VisualTerrainType";
import { dataDrivenTerrainOnly, TerrainSpec } from "./terrain-specifications";

type TerrainSpecCreation = DataDrivenConstructor<number, libnoise.ModuleBase>;
type TerrainSpecDto = DataDrivenInput<any, TerrainSpec<VisualTerrainType>>;
export interface TerrainSettingsDto {
  tempsStep: number[];
  humidityStep: number[];
  altitudeStep: number[];
  humidityCurve: { slope: number; offset: number };
  temperaturePenalty: { slope: number; offset: number };
  humidity: TerrainSpecCreation;
  heat: TerrainSpecCreation;
  altitude: TerrainSpecCreation;
  feature: TerrainSpecCreation;
  caveIndicator: TerrainSpecCreation;
  caveSeeds: TerrainSpecCreation;
  visualizationSpec: TerrainSpecDto;
  detailVisualizationSpec: TerrainSpecDto;
}

export interface TerrainSettings {
  tempsStep: number[];
  humidityStep: number[];
  altitudeStep: number[];
  humidityCurve: { slope: number; offset: number };
  temperaturePenalty: { slope: number; offset: number };
  humidity: TerrainSpecCreation;
  heat: TerrainSpecCreation;
  altitude: TerrainSpecCreation;
  feature: TerrainSpecCreation;
  caveIndicator: TerrainSpecCreation;
  caveSeeds: TerrainSpecCreation;
  visualizationSpec: TerrainSpec<VisualTerrainType>;
  detailVisualizationSpec: TerrainSpec<VisualTerrainType>;
}

export function terrainSettingsFromDto({
  visualizationSpec,
  detailVisualizationSpec,
  ...rest
}: TerrainSettingsDto) {
  return {
    ...rest,
    visualizationSpec: dataDrivenTerrainOnly(visualizationSpec),
    detailVisualizationSpec: dataDrivenTerrainOnly(detailVisualizationSpec)
  };
}

export function humidityCurve(
  humidityCurve: TerrainSettings["humidityCurve"],
  originalHumidity: number,
  heat: number
) {
  return (humidityCurve.offset + heat * humidityCurve.slope) * originalHumidity;
}

export function temperaturePenalty(
  temperaturePenalty: TerrainSettings["temperaturePenalty"],
  altitude: number
) {
  return Math.max(
    0,
    altitude * temperaturePenalty.slope + temperaturePenalty.offset
  );
}
