import { VisualTerrainType } from "../../rxjs-api";
import { SpriteLookup } from "../canvas";
import { TilePieceRenderer } from "./TileCache";

export function getTerrainSpotRenderer(
  sprites: SpriteLookup<VisualTerrainType>
): TilePieceRenderer<VisualTerrainType[]> {
  return function renderTerrainSpot({
    context,
    screenCoordinates: { x, y },
    terrain,
    pixelSize
  }) {
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
    } catch (ex) {
      throw Error(
        `Failed to render terrain spot category=${terrain}. ${ex}`
      );
    }
  };
}
