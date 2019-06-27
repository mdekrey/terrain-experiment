import { TerrainCache, VisualTerrainType } from "../../terrain-generation";
import { SpriteLookup } from "../canvas";
import { TilePieceRenderer } from "./TileCache";

export function getTerrainSpotRenderer(
  terrainCache: TerrainCache,
  sprites: SpriteLookup<VisualTerrainType>,
  detail: boolean
): TilePieceRenderer<VisualTerrainType[]> {
  return function renderTerrainSpot({
    context,
    screenCoordinates: { x, y },
    terrain,
    pixelSize
  }) {
    // const terrain = terrainCache.getAt(terrainX, terrainY);
    try {
      for (const entry of terrain) {
        const sprite = sprites[entry];
        if (sprite) {
          sprite.render(
            0,
            context,
            x * pixelSize,
            y * pixelSize,
            pixelSize,
            pixelSize
          );
        }
      }
      // drawSolidColor(context, terrain.feature, 0.5, x, y, pixelSize);
      // if (terrain.hasCave) {
      //   sprites["Cave"].render(
      //     0,
      //     context,
      //     x * pixelSize,
      //     y * pixelSize,
      //     pixelSize,
      //     pixelSize
      //   );
      // }
    } catch (ex) {
      throw Error(
        `Failed to render terrain spot category=${terrain}. ${ex}`
      );
    }
  };
}
