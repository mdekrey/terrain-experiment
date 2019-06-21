import { perlinDataDrivenConstructor, ridgedMultiDataDrivenConstructor, nonCohesiveDataDrivenConstructor } from "../utils/LibNoiseUtils";
import { DataDrivenConstructor, DataDrivenInput } from "../utils/DataDrivenComposition";
import { libnoise } from "libnoise";
import { VisualTerrainType } from "./VisualTerrainType";
import { VisualizationSpec, DetailVisualizationSpec } from "./VisualizationSpec";
import { dataDrivenTerrainOnly, TerrainSpec } from "./terrain-specifications";

const featureOverlap = 6000;

type TerrainSpecCreation = DataDrivenConstructor<number, libnoise.ModuleBase>;

export interface TerrainSettingsDto {
    tempsStep: number[];
    humidityStep: number[];
    altitudeStep: number[];
    humidityCurve: { slope: number; offset: number; };
    temperaturePenalty: { slope: number; offset: number; };
    humidity: TerrainSpecCreation;
    heat: TerrainSpecCreation;
    altitude: TerrainSpecCreation;
    feature: TerrainSpecCreation;
    caveIndicator: TerrainSpecCreation;
    caveSeeds: TerrainSpecCreation;
    visualizationSpec: DataDrivenInput<any, TerrainSpec<boolean | VisualTerrainType>>;
    detailVisualizationSpec: DataDrivenInput<any, TerrainSpec<boolean | VisualTerrainType>>;
}

export interface TerrainSettings {
    tempsStep: number[];
    humidityStep: number[];
    altitudeStep: number[];
    humidityCurve: { slope: number; offset: number; };
    temperaturePenalty: { slope: number; offset: number; };
    humidity: TerrainSpecCreation;
    heat: TerrainSpecCreation;
    altitude: TerrainSpecCreation;
    feature: TerrainSpecCreation;
    caveIndicator: TerrainSpecCreation;
    caveSeeds: TerrainSpecCreation;
    visualizationSpec: TerrainSpec<VisualTerrainType>;
    detailVisualizationSpec: TerrainSpec<VisualTerrainType>;
}

const terrainSettings: TerrainSettingsDto = {
    altitudeStep: [0.2, 0.4, 0.8, 0.9],
    tempsStep: [0.126, 0.235, 0.406, 0.561, 0.634, 0.876],
    humidityStep: [0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875],
    humidityCurve: { slope: 0.8, offset: 0.2 },
    temperaturePenalty: { slope: 2, offset: -1.7 },
    humidity: perlinDataDrivenConstructor(0, 3.2),
    heat: perlinDataDrivenConstructor(1750, 3.2),
    altitude: ridgedMultiDataDrivenConstructor(3, 500, 2, 1 / 1.95, 0.75),
    feature: ridgedMultiDataDrivenConstructor(featureOverlap, 670, 3.45, 1 / 1, 0.5),
    caveIndicator: nonCohesiveDataDrivenConstructor(1000),
    caveSeeds: perlinDataDrivenConstructor(900, 3.2),

    visualizationSpec: VisualizationSpec,
    detailVisualizationSpec: DetailVisualizationSpec,
}
// console.log(terrainSettings);

export function terrainSettingsFromDto({ visualizationSpec, detailVisualizationSpec, ...rest }: TerrainSettingsDto) {
    return {
        ...rest,
        visualizationSpec: dataDrivenTerrainOnly(visualizationSpec),
        detailVisualizationSpec: dataDrivenTerrainOnly(detailVisualizationSpec),
    }
}

export const defaultTerrainSettings: TerrainSettings = terrainSettingsFromDto(terrainSettings);


export function humidityCurve(humidityCurve: TerrainSettings["humidityCurve"], originalHumidity: number, heat: number) {
    return (humidityCurve.offset + heat * humidityCurve.slope) * originalHumidity;
}

export function temperaturePenalty(temperaturePenalty: TerrainSettings["temperaturePenalty"], altitude: number) {
    return Math.max(0, altitude * temperaturePenalty.slope + temperaturePenalty.offset);
}
