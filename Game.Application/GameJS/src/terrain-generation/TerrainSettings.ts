import { perlinDataDrivenConstructor, ridgedMultiDataDrivenConstructor } from "../utils/LibNoiseUtils";
import { DataDrivenConstructor } from "../utils/DataDrivenComposition";
import { libnoise } from "libnoise";

const featureOverlap = 1000;

type TerrainSpecCreation = DataDrivenConstructor<number, libnoise.ModuleBase>;
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
    caveSeeds: TerrainSpecCreation;
}

export const defaultTerrainSettings: TerrainSettings = {

    altitudeStep: [0.2, 0.4, 0.8, 0.9],
    tempsStep: [0.126, 0.235, 0.406, 0.561, 0.634, 0.876],
    humidityStep: [0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875],
    humidityCurve: { slope: 0.8, offset: 0.2 },
    temperaturePenalty: { slope: 2, offset: -1.7 },
    humidity: perlinDataDrivenConstructor(0, 3.2),
    heat: perlinDataDrivenConstructor(1750, 3.2),
    altitude: ridgedMultiDataDrivenConstructor(1, 200, 3.2),
    feature: ridgedMultiDataDrivenConstructor(featureOverlap, 670, 3.2),
    caveSeeds: perlinDataDrivenConstructor(900, 3.2),

};
// console.log(defaultTerrainSettings);


export function humidityCurve(humidityCurve: TerrainSettings["humidityCurve"], originalHumidity: number, heat: number) {
    return (humidityCurve.offset + heat * humidityCurve.slope) * originalHumidity;
}

export function temperaturePenalty(temperaturePenalty: TerrainSettings["temperaturePenalty"], altitude: number) {
    return Math.max(0, altitude * temperaturePenalty.slope + temperaturePenalty.offset);
}
