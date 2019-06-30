import { injectorBuilder, Scope } from "../injector";
import { TerrainCache } from "../terrain-generation";
import { Pawn } from "./Pawn";
import { Game } from "./Game";
import { TerrainService } from "../rxjs-api";

declare module "../injector/InjectedServices" {
  interface InjectedServices {
    terrainService: TerrainService;
    terrainCache: TerrainCache;
    game: Game;
    player: Pawn;
  }
}

injectorBuilder.set(
    "player",
    Scope.Component,
    () => new Pawn()
);

injectorBuilder.set(
  "terrainService",
  Scope.Singleton,
  () => new TerrainService()
);

injectorBuilder.set("game", Scope.Component, resolver => new Game(resolver("player"), resolver("terrainService")));
injectorBuilder.set(
  "terrainCache",
  Scope.Component,
  resolver => resolver("game").terrain
);
