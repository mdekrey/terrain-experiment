import { GameCoordinates } from "../../game/GameCoordinates";

interface TileCacheEntry {
  useCount: number;
  canvas: HTMLCanvasElement;
}

function keyPart(part: number) {
  return part.toFixed(6).replace(/\.0+$/, "");
}

export type BlockLoader<T> = (terrainX: number, terrainY: number, gridSize: number, tileStep: number) => T[][];

export type TilePieceRenderer<T> = (args: {
  context: CanvasRenderingContext2D;
  screenCoordinates: GameCoordinates;
  terrain: T;
  pixelSize: number;
}) => void;

export class TileCache<T> {
  private readonly terrainLoader: BlockLoader<T>;
  private readonly gridSize: number;
  private readonly pixelSize: number;
  private readonly canCache: () => boolean;
  public readonly tileStep: number;
  private readonly viewportX: number;
  private readonly viewportY: number;
  private readonly cache = new Map<string, TileCacheEntry>();
  private readonly renderTilePiece: TilePieceRenderer<T>;

  constructor(
    terrainLoader: BlockLoader<T>,
    gridSize: number,
    pixelSize: number,
    canCache: () => boolean,
    viewportX: number,
    viewportY: number,
    renderTilePiece: TilePieceRenderer<T>,
    tileStep: number = 8
  ) {
    this.terrainLoader = terrainLoader;
    this.gridSize = gridSize;
    this.pixelSize = pixelSize;
    this.canCache = canCache;
    this.viewportX = viewportX;
    this.viewportY = viewportY;
    this.renderTilePiece = renderTilePiece;
    this.tileStep = tileStep;
  }

  incrementUseCountAndCull(maxDelay = 60 * 10) {
    const toRemove: string[] = [];
    for (let key of this.cache.keys()) {
      const entry = this.cache.get(key)!;
      entry.useCount++;
      if (entry.useCount >= maxDelay) {
        toRemove.push(key);
      }
    }
    for (let key of toRemove) {
      this.cache.delete(key);
    }
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
    if (this.canCache()) {
      let cached = this.cache.get(key);
      if (!cached) {
        cached = {
          useCount: 0,
          canvas: this.createCachableCanvas(terrainX, terrainY)
        };
        this.cache.set(key, cached);
      }
      cached.useCount = 0;
      context.drawImage(
        cached.canvas,
        Math.round((viewportX + screenX + offsetX) * pixelSize),
        Math.round((viewportY + screenY + offsetY) * pixelSize),
        Math.round(pixelSize * tileStep),
        Math.round(pixelSize * tileStep)
      );
      return;
    }
  }

  private createCachableCanvas(terrainX: number, terrainY: number) {
    const { pixelSize, tileStep } = this;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = pixelSize * tileStep;
    const context = canvas.getContext("2d")!;
    context.imageSmoothingEnabled = false;
    this.renderTile(context, terrainX, terrainY, 0, 0);
    // context.strokeRect(0.5, 0.5, pixelSize * tileStep,  pixelSize * tileStep)
    // document.body.appendChild(canvas);
    return canvas;
  }

  private renderTile(
    context: CanvasRenderingContext2D,
    terrainX: number,
    terrainY: number,
    offsetX: number,
    offsetY: number
  ) {
    const { gridSize, tileStep, pixelSize } = this;
    const block = this.terrainLoader(terrainX, terrainY, gridSize, tileStep);
    for (let x = 0; x < tileStep; x++) {
      for (let y = 0; y < tileStep; y++) {
        this.renderTilePiece({
          context,
          screenCoordinates: { x: Math.round(offsetX + x), y: Math.round(offsetY + y) },
          terrain: block[y][x],
          pixelSize
        });
      }
    }
  }
}
