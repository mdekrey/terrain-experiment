import { VisualTerrainType, TerrainPoint } from "../../terrain-generation";
import { SpriteLookup } from "../canvas";

export function renderTerrainSpot({ terrain, x, y, context, pixelSize, sprites }: { terrain: TerrainPoint, x: number, y: number, context: CanvasRenderingContext2D, pixelSize: number, sprites: SpriteLookup<VisualTerrainType> }) {
    sprites[terrain.visualCategory]!.render(0, context, x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    if (terrain.hasCave) {
        sprites["Cave"].render(0, context, x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    }
}
