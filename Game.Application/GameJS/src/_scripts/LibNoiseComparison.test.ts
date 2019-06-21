import { libnoise } from "libnoise";
import { DEFAULT_PERLIN_LACUNARITY, DEFAULT_PERLIN_PERSISTENCE, DEFAULT_PERLIN_OCTAVE_COUNT, DEFAULT_PERLIN_FREQUENCY } from "../utils/LibNoiseUtils";
import { initializeRidgedMulti, initializePerlin } from "./perlinDataDrivenConstructor";

it("has the same perlin results as .net", () => {
    const perlin = new libnoise.generator.Perlin(DEFAULT_PERLIN_FREQUENCY, DEFAULT_PERLIN_LACUNARITY, DEFAULT_PERLIN_PERSISTENCE, DEFAULT_PERLIN_OCTAVE_COUNT,
        0, libnoise.QualityMode.MEDIUM);

    const step = 0.1;
    const microsteps = 30;

    const noise = Array.from(Array(microsteps).keys()).map(i => (i - microsteps / 2) / microsteps * step).map(v => perlin.getValue(v, 0, 0))
    expect(noise).toMatchSnapshot();
});

it("can normalize perlin results", () => {
    const ridged = initializePerlin({});

    const step = 0.1;
    const microsteps = 60;

    const noise = Array.from(Array(microsteps).keys()).map(i => (i - microsteps / 2) * step).map(v => ridged.getValue(v, 0, 0))
    expect(noise).toMatchSnapshot();
});

it("can normalize ridged multifractal results", () => {
    const ridged = initializeRidgedMulti({ lacunarity: 2, slope: 1 / 1.95, offset: 0.75 });

    const step = 0.1;
    const microsteps = 200;

    const histogram = Array.from(Array(microsteps).keys())
      .map(i => i * step)
      .map(x =>
        Array.from(Array(microsteps).keys())
          .map(i => i * step)
          .map(y => ridged.getValue(x, y, 0))
      )
      .reduce(
        (prev, next) => {
          next.forEach(v => {
            const idx = Math.floor(v * 20);
            prev[idx] = (prev[idx] | 0) + 1;
          });
          return prev;
        },
        []
      );

    expect(histogram).toMatchSnapshot();
});

it("has a reasonable range", () => {
    const perlin = new libnoise.generator.Perlin(DEFAULT_PERLIN_FREQUENCY, DEFAULT_PERLIN_LACUNARITY, DEFAULT_PERLIN_PERSISTENCE, DEFAULT_PERLIN_OCTAVE_COUNT,
        0, libnoise.QualityMode.MEDIUM);

    const step = 0.1;
    const microsteps = 200;

    const range = Array.from(Array(microsteps).keys())
        .map(i => i * step)
        .map(x => Array.from(Array(microsteps).keys())
        .map(i => i * step)
        .map(y => perlin.getValue(x, y, 0))
        .reduce((prev, next) => ({ min: Math.min(prev.min, next), max: Math.max(prev.max, next) }), { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY }))
        .reduce((prev, next) => ({ min: Math.min(prev.min, next.min), max: Math.max(prev.max, next.max) }), { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY });
    expect(range.min).toBeLessThan(-1.45);
    expect(range.min).toBeGreaterThan(-1.9);
    expect(range.max).toBeGreaterThan(1.45);
    expect(range.max).toBeLessThan(1.9);
});
