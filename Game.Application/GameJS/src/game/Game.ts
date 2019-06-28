import { TerrainSettings } from "../terrain-generation/TerrainSettings";
import { TerrainGenerator, TerrainCache, VisualTerrainType } from "../terrain-generation";
import { Pawn } from "./Pawn";
import { Cave, CaveGenerator } from "../cave-generation";
import { BehaviorSubject } from "rxjs";
import { addCoordinates, GameCoordinates } from "./GameCoordinates";
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
    readonly terrain: TerrainCache;
    readonly playerPawn: Pawn;
    readonly gameMode$ = new BehaviorSubject<GameMode>({ mode: "Overworld" })
    readonly otherPlayers: Pawn[];

    readonly overworldZoom = Math.pow(10, zoomExp) * 4;
    readonly localZoom = Math.pow(10, zoomExp + 2) * 4;

    constructor(settings: TerrainSettings, playerPawn: Pawn) {
        const terrainGenerator = new TerrainGenerator(settings);
        this.terrain = new TerrainCache(terrainGenerator);
        this.playerPawn = playerPawn;
        if (process.env.NODE_ENV === "development") {
            (window as any).game = this;
        }

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
            if (this.terrain.getAt(position.x, position.y, false).indexOf("Cave") !== -1) {
                this.enterCave();
            } else {
                this.gameMode$.next({ mode: "Detail" });
            }
        }
    }

    async enterCave() {
        if (this.playerPawn.isDoneMoving()) {
            const position = this.playerPawn.position();
            this.gameMode$.next({ mode: "Loading" });

            const gen = new CaveGenerator({ x: position.x * this.overworldZoom, y: position.y * this.overworldZoom }, addCoordinates(position, { x: -0.5 / this.overworldZoom, y: -0.5 / this.overworldZoom }));
            const cave = await gen.cave;
            this.playerPawn.moveTo(addCoordinates(cave.offset, { x: cave.entrance.x / this.localZoom, y: cave.entrance.y / this.localZoom }), Direction.Down);
            this.gameMode$.next({ mode: "Cave", cave });
        }
    }

    moveToOverworld() {
        const gameMode = this.gameMode$.value;
        if (this.playerPawn.isDoneMoving()) {
            const position = this.playerPawn.position();
            if (gameMode.mode === "Cave") {
                const { offset, entrance } = gameMode.cave;
                const x = Math.round((position.x - offset.x) * this.localZoom);
                const y = Math.round((position.y - offset.y) * this.localZoom);
                if (x !== entrance.x || y !== entrance.y) {
                    console.log("not at entrance", x, y, entrance);
                    return;
                }
            }
            const targetPosition = { x: Math.round(position.x * this.overworldZoom) / this.overworldZoom, y: Math.round(position.y * this.overworldZoom) / this.overworldZoom }
            if (this.isOpenSpace(targetPosition, true)) {
                this.playerPawn.moveTo(targetPosition, Direction.Down);
                this.gameMode$.next({ mode: "Overworld" });
            } else {
                console.log("not in open space", targetPosition)
            }
        }
    }

    movePlayerTo(worldCoordinate: GameCoordinates, facing: Direction) {
        if (!this.playerPawn.isDoneMoving()) {
            return;
        }
        if (this.isOpenSpace(worldCoordinate)) {
            this.playerPawn.moveTo(worldCoordinate, facing, 100);
        } else {
            this.playerPawn.facing = facing;
        }
    }

    isOpenSpace(worldCoordinate: GameCoordinates, forceOverworld = false) {
        const gameMode = this.gameMode$.value;

        const overworldCheck = () => {
            const category = this.terrain.getAt(worldCoordinate.x, worldCoordinate.y, false);
            return !category.some(t => !isPassable(t));
        };
        if (forceOverworld) {
            return overworldCheck();
        }
        switch (gameMode.mode) {
            case "Cave":
                const {cave} = gameMode;
                const caveY = Math.round((worldCoordinate.y - cave.offset.y) * this.localZoom);
                const caveX = Math.round((worldCoordinate.x - cave.offset.x) * this.localZoom);
                return !cave.isSolid[caveY][caveX];
            case "Loading":
                return false;
            case "Overworld":
                {
                    return overworldCheck();
                }
            case "Detail":
                {
                    const category = this.terrain.getAt(worldCoordinate.x, worldCoordinate.y, true);
                    return !category.some(t => !isPassable(t));
                }
        }
        function isPassable(category: VisualTerrainType) {
            return category !== "SnowyMountains" && category !== "Mountains" && category !== "ShallowWater" && category !== "DeepWater";
        }
    }
}
