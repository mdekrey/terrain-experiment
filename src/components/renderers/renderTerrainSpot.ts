import { BiomeCategory, TerrainPoint, WaterCategory } from "../../terrain-generation";
import { SpriteLookup } from "../canvas";

const color: Record<BiomeCategory, string> = {
    [BiomeCategory.Ice]: "white",
    [BiomeCategory.Tundra]: "rgb(15,59,59)",
    [BiomeCategory.ColdParklands]: "rgb(144,144,122)",
    [BiomeCategory.ConiferousForests]: "rgb(29, 96, 96)",
    [BiomeCategory.CoolDeserts]: "rgb(170, 192, 102)",
    [BiomeCategory.Steppes]: "rgb(82, 154, 82)",
    [BiomeCategory.MixedForests]: "rgb(10, 154, 118)",
    [BiomeCategory.HotDeserts]: "rgb(212, 255, 77)",
    [BiomeCategory.Chaparral]: "rgb(82, 205, 82)",
    [BiomeCategory.DeciduousForests]: "rgb(0, 205, 123)",
    [BiomeCategory.Savanna]: "rgb(144, 255, 77)",
    [BiomeCategory.TropicalSeasonalForests]: "rgb(77, 255, 77)",
    [BiomeCategory.TropicalRainForests]: "rgb(28, 178, 66)",
}

// function toRgbRange(input: number) {
//     return Math.min(255, Math.max(0, 255 * (input)));
// }

export function renderTerrainSpot({ terrain, x, y, context, pixelSize, sprites }: { terrain: TerrainPoint, x: number, y: number, context: CanvasRenderingContext2D, pixelSize: number, sprites: Partial<SpriteLookup<BiomeCategory>> }) {
    if (terrain.waterCategory === WaterCategory.None && sprites[terrain.biomeCategory]) {
        const p = sprites[terrain.biomeCategory]!.toDrawImageParams();
        context.drawImage(p[0], p[1], p[2], p[3], p[4], x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    } else {
        const backgroundColor = color[terrain.biomeCategory];
        // const backgroundColor = `rgb(${toRgbRange(terrain.heat * 2 - 1)}, ${toRgbRange(1 - terrain.heat)}, 0)`
        // const backgroundColor = `rgb(${toRgbRange(1 - terrain.humidity)}, 200, 0)`
        // const backgroundColor = `rgb(${toRgbRange(terrain.altitude)}, ${toRgbRange(terrain.altitude)}, ${toRgbRange(terrain.altitude)})`

        const withWater = terrain.waterCategory === WaterCategory.None ? backgroundColor
        : terrain.waterCategory === WaterCategory.ShallowWater ? "blue"
        : terrain.waterCategory === WaterCategory.DeepWater ? "#000088"
        : backgroundColor;

        context.fillStyle = withWater;
        context.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    }
}
