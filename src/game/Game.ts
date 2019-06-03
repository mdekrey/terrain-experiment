import { TerrainSettings } from "../terrain-generation/TerrainSettings";
import { TerrainGenerator, TerrainCache, VisualTerrainType, AltitudeCategory } from "../terrain-generation";
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
            if (this.terrain.getAt(position.x, position.y).hasCave) {
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

            const gen = new CaveGenerator(this.terrain.getCaveSeedAt(position), 100, 100, 2, addCoordinates(position, { x: -0.5 / this.overworldZoom, y: -0.5 / this.overworldZoom }));
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
                    return;
                }
            }
            const targetPosition = { x: Math.round(position.x * this.overworldZoom) / this.overworldZoom, y: Math.round(position.y * this.overworldZoom) / this.overworldZoom }
            this.playerPawn.moveTo(targetPosition, Direction.Down);
            this.gameMode$.next({ mode: "Overworld" });
        }
    }

    movePlayerTo(worldCoordinate: GameCoordinates, facing: Direction) {
        if (!this.playerPawn.isDoneMoving()) {
            return;
        }
        if (this.isOpenSpace(worldCoordinate)) {
            this.playerPawn.moveTo(worldCoordinate, facing, 250);
        } else {
            this.playerPawn.facing = facing;
        }
    }

    isOpenSpace(worldCoordinate: GameCoordinates) {
        const gameMode = this.gameMode$.value;
        switch (gameMode.mode) {
            case "Cave":
                const {cave} = gameMode;
                console.log(Math.round((worldCoordinate.y - cave.offset.y) * this.localZoom), Math.round((worldCoordinate.x - cave.offset.x) * this.localZoom))
                return !cave.isSolid[Math.round((worldCoordinate.y - cave.offset.y) * this.localZoom)][Math.round((worldCoordinate.x - cave.offset.x) * this.localZoom)];
            case "Loading":
                return false;
            case "Overworld":
                {
                    const category = this.terrain.getAt(worldCoordinate.x, worldCoordinate.y).visualCategory;
                    return isPassable(category);
                }
            case "Detail":
                {
                    const category = this.terrain.getAt(worldCoordinate.x, worldCoordinate.y).detailVisualCategory;
                    return isPassable(category);
                }
        }
        function isPassable(category: VisualTerrainType) {
            return category !== "SnowyMountain" && category !== "Mountain" && category !== AltitudeCategory.ShallowWater && category !== AltitudeCategory.DeepWater;
        }
    }
}
