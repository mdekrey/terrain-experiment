import { TerrainCache, VisualTerrainType } from "../../terrain-generation";
import { SpriteLookup } from "../canvas";
import { TilePieceRenderer } from "./TileCache";

export function getTerrainSpotRenderer(
  terrainCache: TerrainCache,
  sprites: SpriteLookup<VisualTerrainType>,
  detail: boolean
): TilePieceRenderer {
  return function renderTerrainSpot({
    context,
    screenCoordinates: { x, y },
    terrainCoordinates: { x: terrainX, y: terrainY },
    pixelSize
  }) {
    const terrain = terrainCache.getAt(terrainX, terrainY);
    try {
      sprites[
        detail ? terrain.detailVisualCategory : terrain.visualCategory
      ]!.render(0, context, x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      // drawSolidColor(context, terrain.feature, 0.5, x, y, pixelSize);
      const isPossibleCaveSite = Math.round(terrain.x * 400) * 100 === Math.round(terrain.x * 40000) && Math.round(terrain.y * 400) * 100 === Math.round(terrain.y * 40000);
      if (isPossibleCaveSite && terrain.hasCave) {
        sprites["Cave"].render(
          0,
          context,
          x * pixelSize,
          y * pixelSize,
          pixelSize,
          pixelSize
        );
      }
    } catch (ex) {
      throw Error(
        `Failed to render terrain spot x=${terrainX}, y=${terrainY}, category=${
          detail ? terrain.detailVisualCategory : terrain.visualCategory
        }. ${ex}`
      );
    }
  };
}


