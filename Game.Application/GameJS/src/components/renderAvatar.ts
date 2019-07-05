import { Pawn, Direction } from "../game";
import { IViewportContext } from "./Viewport";
import { Sprite } from "./canvas/SpriteAtlas";

const originalNow = Date.now();
export function renderAvatar({
  context,
  pawn,
  frameDelay,
  zoomFactor,
  sprites,
  viewportContext
}: {
  context: CanvasRenderingContext2D;
  pawn: Pawn;
  frameDelay: number;
  zoomFactor: number;
  sprites: Record<Direction, Sprite>;
  viewportContext: IViewportContext;
}) {
    const { width, height, center, pixelSize } = viewportContext;
    const screenCenterX = viewportContext.x + (width / 2);
    const screenCenterY = viewportContext.y + (height / 2);
    const pawnPosition = pawn.position();
    const worldPosition = center();
    const x = (pawnPosition.x - worldPosition.x) * zoomFactor, y = (pawnPosition.y - worldPosition.y) * zoomFactor;
    const timer = Math.floor((Date.now() - originalNow) / frameDelay) % 2;
    const sprite = sprites[pawn.facing];
    sprite.render(timer, context, Math.round(x * pixelSize + screenCenterX), Math.round(y * pixelSize + screenCenterY), pixelSize, pixelSize);
}
