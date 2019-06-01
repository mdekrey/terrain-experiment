import { Perlin } from "libnoise-ts/module/generator";
import { GameCoordinates, eightDirections, addCoordinates, fourDirections } from "../game/GameCoordinates";

const deathLimit = 3;
const birthLimit = 4;
const treasureLimit = 5;

interface Cave {
    isSolid: boolean[][];
    treasure: GameCoordinates[];
}

export class CaveGenerator {
    private readonly perlin = new Perlin();
    private readonly result: Promise<Cave>;

    constructor(seed: number, width: number, height: number, normalizationRounds: number) {
        this.perlin.seed = seed;
        this.perlin.lacunarity = 3.4;

        const random = (x: number, y: number) => this.perlin.getValue(x, y, 0) < -0.05;

        this.result = new Promise<Cave>((resolve, reject) => {
            let map = Array.from(Array(height).keys()).map((_, y) => Array.from(Array(width).keys()).map((_, x) => random(x, y)));
            let count = 0;
            let filled = false;

            function countAliveNeighbours(position: GameCoordinates){
                let count = 0;
                for (const dir of eightDirections) {
                    const {x: nb_x, y: nb_y} = addCoordinates(dir, position);
                    //If it's at the edges, consider it to be REALLY solid
                    if(nb_x < 0 || nb_y < 0 ||
                            nb_x >= map.length ||
                            nb_y >= map[0].length){
                        count = count + 2;
                    }
                    else if(map[nb_y][nb_x]){
                        count = count + 1;
                    }
                }
                return count;
            }

            function doSimulationStep() {
                map = map.map((_, y) => _.map((currentCell, x) => {
                    const nbs = countAliveNeighbours({x, y});
                    if (currentCell) {
                        return nbs >= deathLimit;
                    } else {
                        return nbs > birthLimit;
                    }
                }));
            }

            function findTreasure() {
                return map.map((_, y) => _.map((currentCell, x): (false | GameCoordinates) => {
                    const nbs = countAliveNeighbours({x, y});
                    return !currentCell && nbs >= treasureLimit ? { x, y } : false;
                })).reduce((prev, next) => [...prev, ...next], []).filter((v): v is GameCoordinates => Boolean(v));
            }

            function fillSmallerAreas() {
                const areas = new Map<Symbol, number>();
                const currentAreas: Symbol[][] = map.map(_ => []);

                function floodFill(startX: number, startY: number) {
                    const symbol = Symbol();
                    let count = 0;
                    const queue = [{x: startX, y: startY}];
                    let n: GameCoordinates | undefined;
                    while (n = queue.pop()) {
                        for (const dir of fourDirections) {
                            const {x, y} = addCoordinates(n, dir);
                            if (!map[y][x] && !currentAreas[y][x]) {
                                count++;
                                currentAreas[y][x] = symbol;
                                queue.push({ x, y });
                            }
                        }
                    }
                    areas.set(symbol, count);
                }

                for (let y = 0; y < map.length; y++) {
                    for (let x = 0; x < map[y].length; x++) {
                        if (!map[y][x] && !currentAreas[y][x]) {
                            floodFill(x, y);
                        }
                    }
                }
                const topSymbol = Array.from(areas.keys()).sort((a, b) => areas.get(b)! - areas.get(a)!)[0];

                for (let y = 0; y < map.length; y++) {
                    for (let x = 0; x < map[y].length; x++) {
                        if (currentAreas[y][x] !== topSymbol) {
                            map[y][x] = true;
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
                } else {
                    resolve({ isSolid: map, treasure: findTreasure() });
                    return;
                }
                setTimeout(step);
            }

            setTimeout(step)
        });
    }

    get map() {
        return this.result.then(cave => cave.isSolid);
    }

    get entrance() {
        return this.result.then(cave => cave.treasure[0]);
    }

    get treasure() {
        return this.result.then(cave => cave.treasure.slice(1));
    }
}
