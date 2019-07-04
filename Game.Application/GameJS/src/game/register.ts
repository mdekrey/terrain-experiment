import { injectorBuilder, Scope } from "../injector";
import { TerrainCache } from "../terrain-generation";
import { Pawn } from "./Pawn";
import { Game } from "./Game";
import "../api";

declare module "../injector/InjectedServices" {
  interface InjectedServices {
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

injectorBuilder.set("game", Scope.Component, resolver => new Game(resolver("player"), resolver("terrainService")));
injectorBuilder.set(
  "terrainCache",
  Scope.Component,
  resolver => resolver("game").terrain
);
