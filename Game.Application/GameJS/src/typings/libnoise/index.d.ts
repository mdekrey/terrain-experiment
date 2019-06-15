declare module 'libnoise' {
    export namespace libnoise {
        export abstract class ModuleBase {
            get<T = number>(index: number): T;
            set<T = number>(index: number, value: T): T;
            length(): number;
            abstract getValue(x, y, z): number;
        }
        export enum QualityMode {
            LOW,
            MEDIUM,
            HIGH,
        }
        export namespace Utils {
            export function Clamp(value: number, min: number, max: number): number;
            export const Deg2Rad: number;
            export const GeneratorNoiseX: number;
            export const GeneratorNoiseY: number;
            export const GeneratorNoiseZ: number;
            export const GeneratorSeed: number;
            export const GeneratorShift: number;
            export function GradientCoherentNoise3D(x: number, y: number, z: number, seed: number, quality: QualityMode): number;
            export function GradientNoise3D(fx: number, fy: number, fz: number, ix: number, iy: number, iz: number, seed: number): number;
            export function InterpolateCubic(a: number, b: number, c: number, d: number, position: number): number;
            export function InterpolateLinear(a: number, b: number, position: number): number;
            export function MakeInt32Range(value: number): number;
            export function MakeCubicSCurve(value: number): number;
            export function MapQuinticSCurve(value: number): number;
            export const OctavesMaximum: number;
            export const Randoms: number[];
            export const SQRT3: number;
            export function ValueNoise3D(x: number, y: number, z: number, seed: number): number;
            export function ValueNoise3DInt(x: number, y: number, z: number, seed: number): number;
            export function fmod(a: number, b: number): number;
        }
        export namespace generator {
            export class Billow extends ModuleBase {
                constructor(frequency: number, lacunarity: number, persistence: number, octaves: number, seed: number, quality: QualityMode);
            }
            export class Checker extends ModuleBase {}
            export class Const extends ModuleBase {
                constructor(value: number);
            }
            export class Cylinder extends ModuleBase {
                constructor(frequency: number);
            }
            export class Perlin extends ModuleBase {
                constructor(frequency: number, lacunarity: number, persistence: number, octaves: number, seed: number, quality: QualityMode);
            }
            export class RidgedMultifractal extends ModuleBase {
                constructor(frequency: number, lacunarity: number, persistence: number, octaves: number, seed: number, quality: QualityMode);
            }
            export class Sphere extends ModuleBase {
                constructor(frequency: number);
            }
            export class Voronoi extends ModuleBase {
                constructor(frequency: number, displacement: number, seed: number, distance: number);
            }
        }
        export namespace operator {
            export class Abs extends ModuleBase {
                constructor(input: ModuleBase);
            }
            export class Add extends ModuleBase {
                constructor(lhs: number, rhs: number);
            }
            export class Blend extends ModuleBase {
                constructor(lhs: number, rhs: number, controller: number);
            }
            export class Cache extends ModuleBase {
                constructor(input: ModuleBase);
            }
            export class Clamp extends ModuleBase {
                constructor(min: number, max: number, input: ModuleBase);
            }
            export class Curve extends ModuleBase {
                constructor(input: ModuleBase);
            }
            export class Displace extends ModuleBase {
                constructor(input: ModuleBase, x: number, y: number, z);
            }
            export class Exponent extends ModuleBase {
                constructor(exponent: number, input: ModuleBase);
            }
            export class Invert extends ModuleBase {
                constructor(input: ModuleBase);
            }
            export class Max extends ModuleBase {
                constructor(lhs: number, rhs: number);
            }
            export class Min extends ModuleBase {
                constructor(lhs: number, rhs: number);
            }
            export class Multiply extends ModuleBase {
                constructor(lhs: number, rhs: number);
            }
            export class Power extends ModuleBase {
                constructor(lhs: number, rhs: number);
            }
            export class Rotate extends ModuleBase {
                constructor(rx: number, ry: number, rz: number, input: ModuleBase);
            }
            export class Scale extends ModuleBase {
                constructor(sx: number, sy: number, sz: number, input: ModuleBase);
            }
            export class ScaleBias extends ModuleBase {
                constructor(scale: number, bias: number, input: ModuleBase);
            }
            export class Select extends ModuleBase {
                constructor(min: number, max: number, fallOff: number, inputA: number, inputB: number, controller: number);
            }
            export class Subtract extends ModuleBase {
                constructor(lhs: number, rhs: number);
            }
            export class Terrace extends ModuleBase {
                constructor(input: ModuleBase, inverted: number);
            }
            export class Translate extends ModuleBase {
                constructor(x: number, y: number, z: number, input: ModuleBase);
            }
            export class Turbulence extends ModuleBase {
                constructor(power: number, input: ModuleBase, distortX: number, distortY: number, distortZ: number);
            }
        }
    }
}
