import { TerrainGenerator } from "./TerrainGenerator";
import { terrainSettingsFromDto } from "./TerrainSettings";

const defaultTerrainSettings = terrainSettingsFromDto(require("../terrainSettingsDto.local.json"));

it("generates some terrain", () => {
    const terrain = new TerrainGenerator(defaultTerrainSettings);

    const step = 0.1;
    const microsteps = 30;

    const noise = Array.from(Array(microsteps).keys()).map(i => (i - microsteps / 2) / microsteps * step).map(v => terrain.getTerrain(0, v).visualCategory)
    expect(noise).toMatchSnapshot();
});

it("has consistent altitude", () => {
    const terrain = new TerrainGenerator(defaultTerrainSettings);

    const step = 0.1;
    const microsteps = 30;

    const noise = Array.from(Array(microsteps).keys()).map(i => (i - microsteps / 2) / microsteps * step).map(v => terrain.getTerrain(0, v).altitude)
    expect(noise).toMatchSnapshot();
});

it("has consistent features", () => {
    const terrain = new TerrainGenerator(defaultTerrainSettings);

    const step = 0.0001;
    const microsteps = 30;

    const noise = Array.from(Array(microsteps).keys()).map(i => (i - microsteps / 2)  / microsteps * step).map(v => terrain.getTerrain(0, v + 0.1).feature)
    expect(noise).toMatchSnapshot();
});

it("can match .net terrain", () => {
    const terrain = new TerrainGenerator(defaultTerrainSettings);

    const step = 0.1;
    const microsteps = 3;

    const steps = Array.from(Array(microsteps).keys()).map(i => (i - microsteps / 2)  / microsteps * step);
    const result = steps.map(y =>
        steps.map(x => {
            const t = terrain.getTerrain(x, y);
            return { altitude: t.altitude, heat: t.heat, humidity: t.humidity, feature: t.feature, caveIndicator: t.caveIndicator };
    }));
    expect(JSON.stringify(result)).toMatchSnapshot();
});
