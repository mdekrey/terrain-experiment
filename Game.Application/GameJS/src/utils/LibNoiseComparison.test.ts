import { libnoise } from "libnoise";
import { DEFAULT_PERLIN_LACUNARITY, DEFAULT_PERLIN_PERSISTENCE, DEFAULT_PERLIN_OCTAVE_COUNT, DEFAULT_PERLIN_FREQUENCY, initializeRidgedMulti, initializePerlin } from "./LibNoiseUtils";

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

it("has the same ridged multifractal results as .net", () => {
    const ridged = new libnoise.generator.RidgedMultifractal(DEFAULT_PERLIN_FREQUENCY, 3.2, DEFAULT_PERLIN_OCTAVE_COUNT,
        0, libnoise.QualityMode.MEDIUM);

    const step = 1;
    const microsteps = 30;

    const noise = Array.from(Array(microsteps).keys()).map(i => (i - microsteps / 2) / microsteps * step).map(v => ridged.getValue(v, 0, 0))
    expect(noise).toMatchSnapshot();
});

it("can normalize ridged multifractal results", () => {
    const ridged = initializeRidgedMulti({});

    const step = 0.1;
    const microsteps = 60;

    const noise = Array.from(Array(microsteps).keys()).map(i => (i - microsteps / 2) * step).map(v => ridged.getValue(v, 0, 0))
    expect(noise).toMatchSnapshot();
});

it("changes ridged multifractal over large distances", () => {
    const ridged = new libnoise.generator.RidgedMultifractal(0.01, 3.2, DEFAULT_PERLIN_OCTAVE_COUNT,
        0, libnoise.QualityMode.MEDIUM);

    const step = 60;
    const microsteps = 60;

    const noise = Array.from(Array(microsteps).keys()).map(i => (i - microsteps / 2) * step).map(v => ridged.getValue(v, 0, 0))
    expect(noise).toMatchSnapshot();
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

it("has a ridged multi with a reasonable range", () => {
    const perlin = new libnoise.generator.RidgedMultifractal(DEFAULT_PERLIN_FREQUENCY, DEFAULT_PERLIN_LACUNARITY, DEFAULT_PERLIN_OCTAVE_COUNT,
        0, libnoise.QualityMode.MEDIUM);

    const step = 0.1;
    const microsteps = 200;

    const range = Array.from(Array(microsteps).keys())
        .map(i => i * step)
        .map(x => Array.from(Array(microsteps).keys())
        .map(i => i * step)
        .map(y => perlin.getValue(-x, -y, 0))
        .reduce((prev, next) => ({ min: Math.min(prev.min, next), max: Math.max(prev.max, next) }), { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY }))
        .reduce((prev, next) => ({ min: Math.min(prev.min, next.min), max: Math.max(prev.max, next.max) }), { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY });
    expect(range.min).toBeLessThan(-0.9);
    expect(range.min).toBeGreaterThan(-1);
    expect(range.max).toBeGreaterThan(1.45);
    expect(range.max).toBeLessThan(1.6);
});
