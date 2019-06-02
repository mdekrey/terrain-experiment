import { injectorBuilder, Scope } from "../injector";
import { TerrainSettings } from "../terrain-generation/TerrainSettings";
import { TerrainCache } from "../terrain-generation";
import { Pawn } from "./Pawn";
import { Game } from "./Game";

declare module "../injector/InjectedServices" {
  interface InjectedServices {
    terrainSettings: TerrainSettings;
    terrainCache: TerrainCache;
    game: Game;
    player: Pawn;
  }
}

injectorBuilder.set("terrainSettings", Scope.Singleton, () => new TerrainSettings());
injectorBuilder.set(
    "player",
    Scope.Component,
    () => new Pawn()
);

injectorBuilder.set("game", Scope.Component, resolver => new Game(resolver("terrainSettings"), resolver("player")));
injectorBuilder.set(
  "terrainCache",
  Scope.Component,
  resolver => resolver("game").terrain
);
