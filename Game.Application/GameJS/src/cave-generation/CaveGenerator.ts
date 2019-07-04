import {
  GameCoordinates
} from "../game/GameCoordinates";
import { TerrainService } from "../api";

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
  private readonly terrainService: TerrainService;

  constructor(
    terrainService: TerrainService,
    position: GameCoordinates,
    offset: GameCoordinates
  ) {
    this.terrainService = terrainService;
    this.position = position;
    this.offset = offset;

    this.result = new Promise(this.buildMap);
  }

  private readonly buildMap = async (
    resolve: (t: { isSolid: boolean[][]; treasure: GameCoordinates[], entrance: GameCoordinates }) => void
  ) => {
    const response = await this.terrainService.getCave({ coordinate: { x: Math.round(this.position.x), y: Math.round(this.position.y) } })
      .toPromise();
    const result = response.data;
    resolve({ isSolid: result.isSolid, treasure: result.treasure, entrance: result.entrance });
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
