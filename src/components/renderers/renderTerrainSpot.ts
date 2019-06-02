import { TerrainCache, VisualTerrainType } from "../../terrain-generation";
import { SpriteLookup } from "../canvas";
import { TilePieceRenderer } from "./TileCache";

export function getTerrainSpotRenderer(
  terrainCache: TerrainCache,
  sprites: SpriteLookup<VisualTerrainType>
): TilePieceRenderer {
  return function renderTerrainSpot({
    context,
    screenCoordinates: { x, y },
    terrainCoordinates: { x: terrainX, y: terrainY },
    pixelSize
  }) {
    const terrain = terrainCache.getAt(terrainX, terrainY);
    sprites[terrain.visualCategory]!.render(
      0,
      context,
      x * pixelSize,
      y * pixelSize,
      pixelSize,
      pixelSize
    );
    if (terrain.hasCave) {
      sprites["Cave"].render(
        0,
        context,
        x * pixelSize,
        y * pixelSize,
        pixelSize,
        pixelSize
      );
    }
  };
}
