import { TerrainGenerator } from "./TerrainGenerator";

it("generates some terrain", () => {
    const terrain = new TerrainGenerator();

    const step = 0.01;
    const microsteps = 5;

    const noise = Array.from(Array(microsteps + 1).keys()).map(i => i / microsteps * step).map(v => terrain.getTerrain(0, v))
    console.log(noise);

});
