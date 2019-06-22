export function drawSolidColor(context: CanvasRenderingContext2D, value: number, alpha: number, x: number, y: number, pixelSize: number) {
  context.fillStyle = `rgba(${Math.round(255 * value)}, ${Math.round(255 * value)}, ${Math.round(255 * value)}, ${alpha})`;
  context.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
}
