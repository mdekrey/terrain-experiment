import { Perlin } from "libnoise-ts/module/generator";

const deathLimit = 3;
const birthLimit = 4;

export class CaveGenerator {
    private readonly perlin = new Perlin();
    private readonly result: Promise<boolean[][]>;

    constructor(seed: number, width: number, height: number, normalizationRounds: number) {
        this.perlin.seed = seed;
        // this.perlin.frequency = 0.5;
        this.perlin.lacunarity = 3.4;

        const random = (x: number, y: number) => this.perlin.getValue(x, y, 0) < -0.05;
        // const random = (x: number, y: number) => Math.random() < 0.45;

        this.result = new Promise<boolean[][]>((resolve, reject) => {
            let map = Array.from(Array(height).keys()).map((_, y) => Array.from(Array(width).keys()).map((_, x) => random(x, y)));
            const v = map.reduce((prev, next) => [...prev, ...next], []);
            let count = 0;

            function countAliveNeighbours(map: boolean[][], x: number, y: number){
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
                    const nbs = countAliveNeighbours(map, x, y);
                    if (currentCell) {
                        return nbs >= deathLimit;
                    } else {
                        return nbs > birthLimit;
                    }
                }));
            }

            function step() {
                if (count++ < normalizationRounds) {
                    doSimulationStep();
                    setTimeout(step);
                } else {
                    resolve(map);
                }
            }

            setTimeout(step)
        });
    }

    get map() {
        return this.result;
    }
}
