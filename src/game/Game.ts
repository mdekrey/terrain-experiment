import { TerrainSettings } from "../terrain-generation/TerrainSettings";
import { TerrainGenerator } from "../terrain-generation";
import { Pawn } from "./Pawn";
import { Cave, CaveGenerator } from "../cave-generation";
import { BehaviorSubject } from "rxjs";
import { addCoordinates } from "./GameCoordinates";
import { Direction } from "./Direction";
import { PawnType } from "./PawnType";

export interface OverworldGameMode {
    mode: "Overworld";
}

export interface DetailGameMode {
    mode: "Detail";
}

export interface CaveGameMode {
    mode: "Cave";
    cave: Cave;
}

export interface LoadingGameMode {
    mode: "Loading";
}

export type GameMode = OverworldGameMode | CaveGameMode | LoadingGameMode | DetailGameMode;

const zoomExp = 2;

export class Game {
    readonly terrainGenerator: TerrainGenerator;
    readonly playerPawn: Pawn;
    readonly gameMode$ = new BehaviorSubject<GameMode>({ mode: "Overworld" })
    readonly otherPlayers: Pawn[];

    readonly overworldZoom = Math.pow(10, zoomExp) * 4;
    readonly localZoom = Math.pow(10, zoomExp + 2) * 4;

    constructor(settings: TerrainSettings, playerPawn: Pawn) {
        this.terrainGenerator = new TerrainGenerator(settings);
        this.playerPawn = playerPawn;

        const types = Object.values(PawnType);
        const generatePlayer = () => {
            const result = new Pawn();
            result.moveTo({ x: Math.floor((Math.random() - 0.5) * 50) / this.overworldZoom, y: Math.floor((Math.random() - 0.5) * 50) / this.overworldZoom }, Math.floor(Math.random() * 4));
            result.type = types[Math.floor(Math.random() * types.length)];
            return result;
        }
        this.otherPlayers = [generatePlayer(), generatePlayer(), generatePlayer(), generatePlayer()];
    }

    async enterDetail() {
        if (this.playerPawn.isDoneMoving()) {
            const position = this.playerPawn.position();
            this.playerPawn.moveTo(addCoordinates(position, { x: 0 / this.overworldZoom, y: 0 / this.overworldZoom }), Direction.Down);
            this.gameMode$.next({ mode: "Detail" });
        }
    }

    async enterCave() {
        if (this.playerPawn.isDoneMoving()) {
            const position = this.playerPawn.position();
            this.gameMode$.next({ mode: "Loading" });
            const gen = new CaveGenerator(Math.random() * 100000, 50, 50, 2, position);
            const cave = await gen.cave;
            this.playerPawn.moveTo(addCoordinates(position, { x: cave.entrance.x / this.localZoom, y: cave.entrance.y / this.localZoom }), Direction.Down);
            this.gameMode$.next({ mode: "Cave", cave });
        }
    }

    moveToOverworld() {
        if (this.playerPawn.isDoneMoving()) {
            const position = this.playerPawn.position();
            const targetPosition = { x: Math.floor(position.x * this.overworldZoom) / this.overworldZoom, y: Math.floor(position.y * this.overworldZoom) / this.overworldZoom }
            this.playerPawn.moveTo(targetPosition, Direction.Down);
            this.gameMode$.next({ mode: "Overworld" });
        }
    }
}
