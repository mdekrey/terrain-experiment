import { libnoise } from "libnoise";
import { DEFAULT_PERLIN_LACUNARITY, DEFAULT_PERLIN_PERSISTENCE, DEFAULT_PERLIN_OCTAVE_COUNT, DEFAULT_PERLIN_FREQUENCY } from "./LibNoiseUtils";
console.log(libnoise.Utils);
it("has the same perlin results as .net", () => {
    const perlin = new libnoise.generator.Perlin(DEFAULT_PERLIN_FREQUENCY, DEFAULT_PERLIN_LACUNARITY, DEFAULT_PERLIN_PERSISTENCE, DEFAULT_PERLIN_OCTAVE_COUNT,
        0, libnoise.QualityMode.MEDIUM);

    const step = 0.1;
    const microsteps = 30;

    const noise = Array.from(Array(microsteps).keys()).map(i => i / microsteps * step).map(v => perlin.getValue(v, 0, 0))
    expect(noise).toMatchSnapshot();
});
