import { TerrainPoint } from "../terrain-generation";

declare const DotNet: {
  invokeMethod<T>(asm: string, method: string, ...args: any[]): T;
  [key: string]: any;
}

export class InteropService {
  private invoke<TReturn>(method: string, ...args: any[]) {
    return DotNet.invokeMethod<TReturn>("Game.WebAsm", method, ...args);
  }

  public getTerrain(coordinates: { x: number; y: number }[]) {
    if (coordinates.length < 5) {
      console.warn(`getTerrain called with ${coordinates.length} coordinates`)
    }
    return this.invoke<TerrainPoint[]>("GetTerrain", coordinates);
  }
}
