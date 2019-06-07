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
    terrainCoordinates,
    pixelSize
  }) {
    const terrain = terrainCache.getAt([terrainCoordinates])[0];
    const visual = detail ? terrain.detailVisualCategory : terrain.visualCategory;
    sprites[visual]!.render(
      0,
      context,
      x * pixelSize,
      y * pixelSize,
      pixelSize,
      pixelSize
    );
    if (!detail && terrain.hasCave) {
      sprites[VisualTerrainType.Cave].render(
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
