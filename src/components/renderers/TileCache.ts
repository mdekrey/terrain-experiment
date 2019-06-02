import { GameCoordinates } from "../../game/GameCoordinates";

interface TileCacheEntry {
  useCount: number;
  canvas: HTMLCanvasElement;
}

function keyPart(part: number) {
  return part.toFixed(6).replace(/\.0+$/, "");
}

export type TilePieceRenderer = (args: {
  context: CanvasRenderingContext2D;
  screenCoordinates: GameCoordinates;
  terrainCoordinates: GameCoordinates;
  pixelSize: number;
}) => void;

export class TileCache {
  private readonly gridSize: number;
  private readonly pixelSize: number;
  private readonly canCache: () => boolean;
  public readonly tileStep: number;
  private readonly viewportX: number;
  private readonly viewportY: number;
  private readonly cache = new Map<string, TileCacheEntry>();
  private readonly renderTilePiece: TilePieceRenderer;

  constructor(
    gridSize: number,
    pixelSize: number,
    canCache: () => boolean,
    tileStep: number,
    viewportX: number,
    viewportY: number,
    renderTilePiece: TilePieceRenderer
  ) {
    this.gridSize = gridSize;
    this.pixelSize = pixelSize;
    this.canCache = canCache;
    this.tileStep = tileStep;
    this.viewportX = viewportX;
    this.viewportY = viewportY;
    this.renderTilePiece = renderTilePiece;
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
    this.renderTile(
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
    this.renderTile(context, terrainX, terrainY, 0, 0);
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
    for (let x = 0; x < tileStep; x++) {
      for (let y = 0; y < tileStep; y++) {
        this.renderTilePiece({
          context,
          screenCoordinates: { x: offsetX + x, y: offsetY + y },
          terrainCoordinates: {
            x: x * gridSize + terrainX,
            y: y * gridSize + terrainY
          },
          pixelSize
        });
      }
    }
  }
}
