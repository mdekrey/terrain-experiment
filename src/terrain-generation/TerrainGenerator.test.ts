import { TerrainGenerator } from "./TerrainGenerator";
import { TerrainSettings } from "./TerrainSettings";

it("generates some terrain", () => {
    const terrain = new TerrainGenerator(new TerrainSettings());

    const step = 0.01;
    const microsteps = 5;

    const noise = Array.from(Array(microsteps + 1).keys()).map(i => i / microsteps * step).map(v => terrain.getTerrain(0, v))
    // console.log(noise);

    // TODO
});
