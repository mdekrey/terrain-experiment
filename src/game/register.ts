import { injectorBuilder, Scope } from "../injector";
import { TerrainSettings } from "../terrain-generation/TerrainSettings";
import { TerrainGenerator } from "../terrain-generation";

declare module "../injector/InjectedServices" {
  interface InjectedServices {
    terrainSettings: TerrainSettings;
    terrainGenerator: TerrainGenerator;
  }
}

injectorBuilder.set("terrainSettings", Scope.Singleton, () => new TerrainSettings());
injectorBuilder.set(
  "terrainGenerator",
  Scope.Singleton,
  resolver => new TerrainGenerator(resolver("terrainSettings"))
);
