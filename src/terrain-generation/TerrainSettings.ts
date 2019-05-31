export class TerrainSettings {

    readonly tempsStep = [0.126, 0.235, 0.406, 0.561, 0.634, 0.876, Number.MAX_VALUE];

    humidityCurve(originalHumidity: number, heat: number) {
        return (0.2 + heat * 0.8) * originalHumidity;
    }

}