import { Perlin } from "libnoise-ts/module/generator";
import { GameCoordinates } from "../game/GameCoordinates";

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
            const v = map.reduce((prev, next) => [...prev, ...next], []);
            let count = 0;

            function countAliveNeighbours(x: number, y: number){
                let count = 0;
                for(let i = -1; i < 2; i++){
                    for(let j = -1; j < 2; j++){
                        const nb_x = i+x;
                        const nb_y = j+y;
                        if(i == 0 && j == 0){
                        }
                        //If it's at the edges, consider it to be REALLY solid
                        else if(nb_x < 0 || nb_y < 0 ||
                                nb_x >= map.length ||
                                nb_y >= map[0].length){
                            count = count + 2;
                        }
                        else if(map[nb_y][nb_x]){
                            count = count + 1;
                        }
                    }
                }
                return count;
            }

            function doSimulationStep() {
                map = map.map((_, y) => _.map((currentCell, x) => {
                    const nbs = countAliveNeighbours(x, y);
                    if (currentCell) {
                        return nbs >= deathLimit;
                    } else {
                        return nbs > birthLimit;
                    }
                }));
            }

            function findTreasure() {
                return map.map((_, y) => _.map((currentCell, x): (false | GameCoordinates) => {
                    const nbs = countAliveNeighbours(x, y);
                    return !currentCell && nbs >= treasureLimit ? { x, y } : false;
                })).reduce((prev, next) => [...prev, ...next], []).filter((v): v is GameCoordinates => Boolean(v));
            }

            function step() {
                if (count++ < normalizationRounds) {
                    doSimulationStep();
                    setTimeout(step);
                } else {

                    resolve({ isSolid: map, treasure: findTreasure() });
                }
            }

            setTimeout(step)
        });
    }

    get map() {
        return this.result.then(cave => cave.isSolid);
    }

    get treasure() {
        return this.result.then(cave => cave.treasure);
    }
}
