import { libnoise } from "libnoise";


export class AnyDirectionModule extends libnoise.ModuleBase {
    private readonly generator: libnoise.ModuleBase;
    private readonly overlap: number;
    constructor({
      generator,
      overlap = 1
    }: {
        generator: libnoise.ModuleBase;
        overlap?: number;
    }) {
      super();
      this.generator = generator;
      this.overlap = overlap;
    }
    private weight(x: number, y: number) {
      return (
        libnoise.Utils.Clamp(x / this.overlap, 0, 1) *
        libnoise.Utils.Clamp(y / this.overlap, 0, 1)
      );
    }
    getValue(x: number, y: number, z: number) {
      const altx = this.overlap - x,
        alty = this.overlap - y;
      const sets: [number, number, number][] = [
        [x, y, 0],
        [altx, y, 100],
        [x, alty, 200],
        [altx, alty, 300]
      ];
      const values = sets
        .filter(([x, y]) => x >= 0 && y >= 0)
        .map(([x, y, z]) => this.generator.getValue(x, y, z) * this.weight(x, y));
      return values.reduce((p, n) => p + n);
    }
  }