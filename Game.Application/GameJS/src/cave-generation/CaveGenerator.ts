import {
  GameCoordinates,
  eightDirections,
  addCoordinates,
  fourDirections
} from "../game/GameCoordinates";
import { libnoise } from "libnoise";
import {
  DEFAULT_PERLIN_FREQUENCY,
  DEFAULT_PERLIN_OCTAVE_COUNT,
  DEFAULT_PERLIN_PERSISTENCE
} from "../utils/LibNoiseUtils";

const deathLimit = 3;
const birthLimit = 4;
const treasureLimit = 5;

export interface Cave {
  offset: GameCoordinates;
  isSolid: boolean[][];
  treasure: GameCoordinates[];
  entrance: GameCoordinates;
}

export class CaveGenerator {
  private readonly perlin: libnoise.generator.Perlin;
  private readonly result: Promise<{
    isSolid: boolean[][];
    treasure: GameCoordinates[];
  }>;
  private readonly width: number;
  private readonly height: number;
  private readonly normalizationRounds: number;
  private readonly offset: GameCoordinates;
  private map: boolean[][];

  private random = (x: number, y: number) =>
    this.perlin.getValue(x / 3, y / 3, 0) < 0;

  constructor(
    seed: number,
    width: number,
    height: number,
    normalizationRounds: number,
    offset: GameCoordinates
  ) {
    this.width = width;
    this.height = height;
    this.normalizationRounds = normalizationRounds;
    this.offset = offset;

    this.perlin = new libnoise.generator.Perlin(
      DEFAULT_PERLIN_FREQUENCY,
      3.4,
      DEFAULT_PERLIN_OCTAVE_COUNT,
      DEFAULT_PERLIN_PERSISTENCE,
      seed,
      libnoise.QualityMode.MEDIUM
    );
    const widthElems = Array.from(Array(width).keys());
    this.map = Array.from(Array(height).keys()).map((_, y) =>
      widthElems.map((_, x) => this.random(x, y))
    );

    this.result = new Promise(this.buildMap);
  }

  private countAliveNeighbours(position: GameCoordinates) {
    let count = 0;
    for (const dir of eightDirections) {
      const { x: nb_x, y: nb_y } = addCoordinates(dir, position);
      //If it's at the edges, consider it to be REALLY solid
      if (
        nb_x < 0 ||
        nb_y < 0 ||
        nb_x >= this.map.length ||
        nb_y >= this.map[0].length
      ) {
        count = count + 2;
      } else if (this.map[nb_y][nb_x]) {
        count = count + 1;
      }
    }
    return count;
  }

  private doSimulationStep() {
    this.map = this.map.map((_, y) =>
      _.map((currentCell, x) => {
        const nbs = this.countAliveNeighbours({ x, y });
        if (currentCell) {
          return nbs >= deathLimit;
        } else {
          return nbs > birthLimit;
        }
      })
    );
  }

  private findTreasure() {
    return this.map
      .map((_, y) =>
        _.map(
          (currentCell, x): false | GameCoordinates => {
            const nbs = this.countAliveNeighbours({ x, y });
            return !currentCell && nbs >= treasureLimit ? { x, y } : false;
          }
        )
      )
      .reduce((prev, next) => [...prev, ...next], [])
      .filter((v): v is GameCoordinates => Boolean(v));
  }

  private floodFill(
    start: GameCoordinates,
    currentAreas: Symbol[][],
    areas: Map<Symbol, number>
  ) {
    const symbol = Symbol(`${start.x}x${start.y}`);
    let count = 0;
    const queue = [start];
    for (let n = queue.pop(); n; n = queue.pop()) {
      for (const dir of fourDirections) {
        const { x, y } = addCoordinates(n, dir);
        if (!this.map[y][x] && !currentAreas[y][x]) {
          count++;
          currentAreas[y][x] = symbol;
          queue.push({ x, y });
        }
      }
    }
    areas.set(symbol, count);
    return { symbol, count };
  }

  private fillSmallerAreas() {
    const areas = new Map<Symbol, number>();
    const currentAreas: Symbol[][] = this.map.map(_ => []);

    const threshold = (this.width * this.height) / 4;
    let shortcutSymbol: Symbol | undefined;
    for (let y = 0; y < this.map.length && !shortcutSymbol; y++) {
      for (let x = 0; x < this.map[y].length && !shortcutSymbol; x++) {
        if (!this.map[y][x] && !currentAreas[y][x]) {
          const { symbol, count } = this.floodFill(
            { x, y },
            currentAreas,
            areas
          );
          if (count > threshold) {
            shortcutSymbol = symbol;
          }
        }
      }
    }
    const topSymbol =
      shortcutSymbol ||
      Array.from(areas.keys()).sort((a, b) => areas.get(b)! - areas.get(a)!)[0];

    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        if (currentAreas[y][x] !== topSymbol) {
          this.map[y][x] = true;
        }
      }
    }
  }

  private removeSingleY() {
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        if (
          this.map[y][x] &&
          this.map[y + 1] &&
          !this.map[y + 1][x] &&
          this.map[y - 1] &&
          !this.map[y - 1][x]
        ) {
          this.map[y][x] = false;
        }
      }
    }
  }

  private readonly buildMap = async (
    resolve: (t: { isSolid: boolean[][]; treasure: GameCoordinates[] }) => void
  ) => {
    await delayPromise();
    for (let count = 0; count < this.normalizationRounds; count++) {
      this.doSimulationStep();
      await delayPromise();
    }
    this.fillSmallerAreas();
    this.removeSingleY();
    await delayPromise();
    resolve({ isSolid: this.map, treasure: this.findTreasure() });
  };

  get cave(): Promise<Cave> {
    return this.result.then(cave => ({
      isSolid: cave.isSolid,
      entrance: cave.treasure[0] || {},
      treasure: cave.treasure.slice(1),
      offset: this.offset
    }));
  }
}

function delayPromise() {
  return new Promise(resolve => setTimeout(resolve));
}
