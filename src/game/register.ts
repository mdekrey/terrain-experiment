import { injectorBuilder, Scope } from "../injector";
import { TerrainSettings } from "../terrain-generation/TerrainSettings";
import { TerrainGenerator } from "../terrain-generation";
import { Pawn } from "./Pawn";
import { Game } from "./Game";

declare module "../injector/InjectedServices" {
  interface InjectedServices {
    terrainSettings: TerrainSettings;
    terrainGenerator: TerrainGenerator;
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
  "terrainGenerator",
  Scope.Singleton,
  resolver => resolver("game").terrainGenerator
);
