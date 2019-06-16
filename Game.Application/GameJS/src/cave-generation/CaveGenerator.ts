import {
  GameCoordinates,
  eightDirections,
  addCoordinates,
  fourDirections
} from "../game/GameCoordinates";
import { libnoise } from "libnoise";
import { DEFAULT_PERLIN_FREQUENCY, DEFAULT_PERLIN_OCTAVE_COUNT, DEFAULT_PERLIN_PERSISTENCE } from "../utils/LibNoiseUtils";

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
  private readonly offset: GameCoordinates;

  constructor(
    seed: number,
    width: number,
    height: number,
    normalizationRounds: number,
    offset: GameCoordinates
  ) {
    this.perlin = new libnoise.generator.Perlin(DEFAULT_PERLIN_FREQUENCY, 3.4, DEFAULT_PERLIN_OCTAVE_COUNT, DEFAULT_PERLIN_PERSISTENCE, seed, libnoise.QualityMode.MEDIUM);
    this.offset = offset;

    const random = (x: number, y: number) =>
      libnoise.Utils.ValueNoise3D(x, y, 0, seed) < -0.2;

    this.result = new Promise((resolve, reject) => {
      let map = Array.from(Array(height).keys()).map((_, y) =>
        Array.from(Array(width).keys()).map((_, x) => random(x, y))
      );
      let count = 0;
      let filled = false;

      function countAliveNeighbours(position: GameCoordinates) {
        let count = 0;
        for (const dir of eightDirections) {
          const { x: nb_x, y: nb_y } = addCoordinates(dir, position);
          //If it's at the edges, consider it to be REALLY solid
          if (
            nb_x < 0 ||
            nb_y < 0 ||
            nb_x >= map.length ||
            nb_y >= map[0].length
          ) {
            count = count + 2;
          } else if (map[nb_y][nb_x]) {
            count = count + 1;
          }
        }
        return count;
      }

      function doSimulationStep() {
        map = map.map((_, y) =>
          _.map((currentCell, x) => {
            const nbs = countAliveNeighbours({ x, y });
            if (currentCell) {
              return nbs >= deathLimit;
            } else {
              return nbs > birthLimit;
            }
          })
        );
      }

      function findTreasure() {
        return map
          .map((_, y) =>
            _.map(
              (currentCell, x): false | GameCoordinates => {
                const nbs = countAliveNeighbours({ x, y });
                return !currentCell && nbs >= treasureLimit ? { x, y } : false;
              }
            )
          )
          .reduce((prev, next) => [...prev, ...next], [])
          .filter((v): v is GameCoordinates => Boolean(v));
      }

      function fillSmallerAreas() {
        const areas = new Map<Symbol, number>();
        const currentAreas: Symbol[][] = map.map(_ => []);

        function floodFill(start: GameCoordinates) {
          const symbol = Symbol(`${start.x}x${start.y}`);
          let count = 0;
          const queue = [start];
          for (let n = queue.pop(); n; n = queue.pop()) {
            for (const dir of fourDirections) {
              const { x, y } = addCoordinates(n, dir);
              if (!map[y][x] && !currentAreas[y][x]) {
                count++;
                currentAreas[y][x] = symbol;
                queue.push({ x, y });
              }
            }
          }
          areas.set(symbol, count);
          return { symbol, count };
        }

        const threshold = (width * height) / 4;
        let shortcutSymbol: Symbol | undefined;
        for (let y = 0; y < map.length && !shortcutSymbol; y++) {
          for (let x = 0; x < map[y].length && !shortcutSymbol; x++) {
            if (!map[y][x] && !currentAreas[y][x]) {
              const { symbol, count } = floodFill({ x, y });
              if (count > threshold) {
                shortcutSymbol = symbol;
              }
            }
          }
        }
        const topSymbol =
          shortcutSymbol ||
          Array.from(areas.keys()).sort(
            (a, b) => areas.get(b)! - areas.get(a)!
          )[0];

        for (let y = 0; y < map.length; y++) {
          for (let x = 0; x < map[y].length; x++) {
            if (currentAreas[y][x] !== topSymbol) {
              map[y][x] = true;
            }
          }
        }
      }

      function removeSingleY() {
        for (let y = 0; y < map.length; y++) {
          for (let x = 0; x < map[y].length; x++) {
            if (
              map[y][x] &&
              map[y + 1] &&
              !map[y + 1][x] &&
              map[y - 1] &&
              !map[y - 1][x]
            ) {
              map[y][x] = false;
            }
          }
        }
      }

      function step() {
        if (count++ < normalizationRounds) {
          doSimulationStep();
        } else if (!filled) {
          fillSmallerAreas();
          filled = true;
          removeSingleY();
        } else {
          resolve({ isSolid: map, treasure: findTreasure() });
          return;
        }
        setTimeout(step);
      }

      setTimeout(step);
    });
  }

  get cave(): Promise<Cave> {
    return this.result.then(cave => ({
      isSolid: cave.isSolid,
      entrance: cave.treasure[0],
      treasure: cave.treasure.slice(1),
      offset: this.offset
    }));
  }
}
