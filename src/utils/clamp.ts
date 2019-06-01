export function clamp(min: number, max: number) {
  return (value: number) => Math.min(max, Math.max(value, min));
}
