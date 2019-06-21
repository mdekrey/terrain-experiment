import { perlinDataDrivenConstructor, ridgedMultiDataDrivenConstructor, nonCohesiveDataDrivenConstructor } from "./perlinDataDrivenConstructor";
import { VisualizationSpec, DetailVisualizationSpec } from "../terrain-generation/VisualizationSpec";

const featureOverlap = 6000;

const result = {
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
};
console.log(JSON.stringify(result));
