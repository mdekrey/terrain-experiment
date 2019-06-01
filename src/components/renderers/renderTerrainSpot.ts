import { BiomeCategory, TerrainPoint } from "../../terrain-generation";
import { SpriteLookup } from "../canvas";

// function toRgbRange(input: number) {
//     return Math.min(255, Math.max(0, 255 * (input)));
// }

export function renderTerrainSpot({ terrain, x, y, context, pixelSize, sprites }: { terrain: TerrainPoint, x: number, y: number, context: CanvasRenderingContext2D, pixelSize: number, sprites: SpriteLookup<BiomeCategory> }) {
    // const p = sprites[terrain.biomeCategory]!.toDrawImageParams(0);
    // context.drawImage(p[0], p[1], p[2], p[3], p[4], x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    sprites[terrain.biomeCategory]!.render(0, context, x * pixelSize, y * pixelSize, pixelSize, pixelSize);

    // if (terrain.waterCategory === WaterCategory.None && sprites[terrain.biomeCategory]) {
    // } else {
    //     const backgroundColor = color[terrain.biomeCategory];
    //     // const backgroundColor = `rgb(${toRgbRange(terrain.heat * 2 - 1)}, ${toRgbRange(1 - terrain.heat)}, 0)`
    //     // const backgroundColor = `rgb(${toRgbRange(1 - terrain.humidity)}, 200, 0)`
    //     // const backgroundColor = `rgb(${toRgbRange(terrain.altitude)}, ${toRgbRange(terrain.altitude)}, ${toRgbRange(terrain.altitude)})`

    //     const withWater = terrain.waterCategory === WaterCategory.None ? backgroundColor
    //     : terrain.waterCategory === WaterCategory.ShallowWater ? "blue"
    //     : terrain.waterCategory === WaterCategory.DeepWater ? "#000088"
    //     : backgroundColor;

    //     context.fillStyle = withWater;
    //     context.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    // }
}
