import { TerrainGenerator } from "./TerrainGenerator";
import { defaultTerrainSettings } from "./TerrainSettings";

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

    const step = 0.001;
    const microsteps = 30;

    const noise = Array.from(Array(microsteps).keys()).map(i => (i - microsteps / 2)  / microsteps * step).map(v => terrain.getTerrain(0, v).feature)
    expect(noise).toMatchSnapshot();
});
