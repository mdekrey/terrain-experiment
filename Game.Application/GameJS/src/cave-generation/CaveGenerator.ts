import {
  GameCoordinates
} from "../game/GameCoordinates";
import { ajax } from "rxjs/ajax";

export interface Cave {
  offset: GameCoordinates;
  isSolid: boolean[][];
  treasure: GameCoordinates[];
  entrance: GameCoordinates;
}

export class CaveGenerator {
  private readonly result: Promise<{
    isSolid: boolean[][];
    entrance: GameCoordinates;
    treasure: GameCoordinates[];
  }>;
  private readonly position: GameCoordinates;
  private readonly offset: GameCoordinates;

  constructor(
    position: GameCoordinates,
    offset: GameCoordinates
  ) {
    this.position = position;
    this.offset = offset;

    this.result = new Promise(this.buildMap);
  }

  private readonly buildMap = async (
    resolve: (t: { isSolid: boolean[][]; treasure: GameCoordinates[], entrance: GameCoordinates }) => void
  ) => {
    const response = await ajax({ url: "/api/terrain/cave", body: { Coordinates: { X: Math.round(this.position.x), Y: Math.round(this.position.y) } }, method: "POST", headers: { 'Content-Type': 'application/json' } })
      .toPromise();
    const result = response.response as { map: boolean[][]; treasure: GameCoordinates[], entrance: GameCoordinates };
    resolve({ isSolid: result.map, treasure: result.treasure, entrance: result.entrance });
  };

  get cave(): Promise<Cave> {
    return this.result.then(cave => ({
      isSolid: cave.isSolid,
      entrance: cave.entrance,
      treasure: cave.treasure,
      offset: this.offset
    }));
  }
}
