import { TerrainCache, VisualTerrainType } from "../../terrain-generation";
import { SpriteLookup } from "../canvas";

interface TileCache {
  useCount: number;
  canvas: HTMLCanvasElement;
}

function keyPart(part: number) {
  return part.toFixed(6).replace(/\.0+$/, "");
}

export class TerrainTileCache {
  private readonly terrainCache: TerrainCache;
  private readonly gridSize: number;
  private readonly pixelSize: number;
  private readonly sprites: SpriteLookup<VisualTerrainType>;
  public readonly tileStep: number;
  private readonly viewportX: number;
  private readonly viewportY: number;
  private readonly cache = new Map<string, TileCache>();

  constructor(
    terrainCache: TerrainCache,
    gridSize: number,
    pixelSize: number,
    sprites: SpriteLookup<VisualTerrainType>,
    tileStep: number,
    viewportX: number,
    viewportY: number
  ) {
    this.terrainCache = terrainCache;
    this.gridSize = gridSize;
    this.pixelSize = pixelSize;
    this.sprites = sprites;
    this.tileStep = tileStep;
    this.viewportX = viewportX;
    this.viewportY = viewportY;
  }

  get canCache() {
    return !Object.values(this.sprites).some(s => !s.isFinal);
  }

  render(
    context: CanvasRenderingContext2D,
    {
      screenX,
      screenY,
      terrainX,
      terrainY,
      offsetX,
      offsetY
    }: {
      screenX: number;
      screenY: number;
      terrainX: number;
      terrainY: number;
      offsetX: number;
      offsetY: number;
    }
  ) {
    const key = `${keyPart(terrainX)}x${keyPart(terrainY)}`;
    const { viewportX, viewportY, pixelSize, tileStep } = this;
    if (this.canCache) {
      let cached = this.cache.get(key);
      if (!cached) {
        const cached = {
          useCount: 0,
          canvas: this.createCachableCanvas(terrainX, terrainY)
        };
        this.cache.set(key, cached);
      } else {
        context.drawImage(
          cached.canvas,
          (viewportX + screenX + offsetX) * pixelSize,
          (viewportY + screenY + offsetY) * pixelSize,
          pixelSize * tileStep,
          pixelSize * tileStep
        );
        return;
      }
    }
    this.renderTerrain(
      context,
      terrainX,
      terrainY,
      viewportX + screenX + offsetX,
      viewportY + screenY + offsetY
    );
  }

  private createCachableCanvas(terrainX: number, terrainY: number) {
    const { pixelSize, tileStep } = this;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = pixelSize * tileStep;
    const context = canvas.getContext("2d")!;
    context.imageSmoothingEnabled = false;
    this.renderTerrain(context, terrainX, terrainY, 0, 0);
    // document.body.appendChild(canvas);
    return canvas;
  }

  private renderTerrain(
    context: CanvasRenderingContext2D,
    terrainX: number,
    terrainY: number,
    offsetX: number,
    offsetY: number
  ) {
    const { gridSize, tileStep } = this;
    for (let x = 0; x < tileStep; x++) {
      for (let y = 0; y < tileStep; y++) {
        this.renderTerrainSpot(context, {
          x: offsetX + x,
          y: offsetY + y,
          terrainX: x * gridSize + terrainX,
          terrainY: y * gridSize + terrainY
        });
      }
    }
  }

  private renderTerrainSpot(
    context: CanvasRenderingContext2D,
    {
      x,
      y,
      terrainX,
      terrainY
    }: { x: number; y: number; terrainX: number; terrainY: number }
  ) {
    const terrain = this.terrainCache.getAt(terrainX, terrainY);
    const { pixelSize, sprites } = this;
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
  }
}
