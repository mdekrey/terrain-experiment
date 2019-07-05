import { TerrainService, VisualTerrainType, HubClient } from "../api";
import { TerrainCache, overworldZoom, localZoom, zoomFactor } from "../terrain-generation";
import { Pawn } from "./Pawn";
import { Cave, CaveGenerator } from "../cave-generation";
import { BehaviorSubject } from "rxjs";
import { addCoordinates, GameCoordinates } from "./GameCoordinates";
import { Direction } from "./Direction";
import { PawnType } from "./PawnType";
import { unionize, ofType, UnionOf } from "unionize";

export const GameModes = unionize({
    Overworld: {},
    Detail: {},
    Cave: ofType<{ cave: Cave }>(),
    Loading: {}
}, { tag: "mode" });

export type GameMode = UnionOf<typeof GameModes>;

function roundToOverworld(position: GameCoordinates) {
    return  { x: Math.round(position.x * overworldZoom) / overworldZoom, y: Math.round(position.y * overworldZoom) / overworldZoom };
}

function areSame(lhs: GameCoordinates, rhs: GameCoordinates) {
    return Math.abs(lhs.x - rhs.x) < 1 / localZoom / 2
        && Math.abs(lhs.y - rhs.y) < 1 / localZoom / 2
}

export class Game {
    readonly terrain: TerrainCache;
    readonly playerPawn: Pawn;
    readonly gameMode$ = new BehaviorSubject<GameMode>(GameModes.Detail())
    readonly otherPlayers: Pawn[];
    readonly terrainService: TerrainService;
    readonly hub: HubClient;

    constructor(playerPawn: Pawn, service: TerrainService, hub: HubClient) {
        this.hub = hub;
        this.terrainService = service;
        this.terrain = new TerrainCache(service);
        this.playerPawn = playerPawn;
        if (process.env.NODE_ENV === "development") {
            (window as any).game = this;
        }

        const types = Object.values(PawnType);
        const generatePlayer = () => {
            const result = new Pawn();
            result.moveTo({ x: Math.floor((Math.random() - 0.5) * 50) / overworldZoom, y: Math.floor((Math.random() - 0.5) * 50) / overworldZoom }, Math.floor(Math.random() * 4));
            result.type = types[Math.floor(Math.random() * types.length)];
            return result;
        }
        this.otherPlayers = [generatePlayer(), generatePlayer(), generatePlayer(), generatePlayer()];
    }

    async enterDetail() {
        if (this.playerPawn.isDoneMoving()) {
            const position = this.playerPawn.position();
            const specialLocation = this.terrain.getSpecialLocationAt(position.x, position.y, false);
            if (specialLocation) {
                this.playerPawn.moveTo(specialLocation, this.playerPawn.facing);
            }
            this.gameMode$.next(GameModes.Detail());
        }
    }

    async enterCave() {
        if (this.playerPawn.isDoneMoving()) {
            const position = this.playerPawn.position();
            this.gameMode$.next(GameModes.Loading());

            const gen = new CaveGenerator(this.terrainService, { x: position.x * overworldZoom, y: position.y * overworldZoom }, addCoordinates(position, { x: -0.5 / overworldZoom, y: -0.5 / overworldZoom }));
            const cave = await gen.cave;
            this.playerPawn.moveTo(addCoordinates(cave.offset, { x: cave.entrance.x / localZoom, y: cave.entrance.y / localZoom }), Direction.Down);
            this.gameMode$.next(GameModes.Cave({ cave }));
        }
    }

    async exitCave() {
        const gameMode = this.gameMode$.value;
        if (this.playerPawn.isDoneMoving()) {
            const position = this.playerPawn.position();
            const targetPosition = roundToOverworld(position);
            if (gameMode.mode === "Cave") {
                const { offset, entrance } = gameMode.cave;
                const x = Math.round((position.x - offset.x) * localZoom);
                const y = Math.round((position.y - offset.y) * localZoom);
                if (x !== entrance.x || y !== entrance.y) {
                    console.log("not at entrance", x, y, entrance);
                    return;
                }
            }

            if (await this.isOpenSpace(targetPosition, "Detail")) {
                this.playerPawn.moveTo(targetPosition, Direction.Down);
                this.gameMode$.next(GameModes.Detail());
            } else {
                console.log("not in open space", targetPosition)
            }
        }
    }

    async moveToOverworldOrCave() {
        const gameMode = this.gameMode$.value;
        if (this.playerPawn.isDoneMoving()) {
            const position = this.playerPawn.position();
            const targetPosition = roundToOverworld(position);
            if (areSame(targetPosition, position) && (await this.terrain.getAtAsync(targetPosition.x, targetPosition.y, false)).indexOf("Cave" as VisualTerrainType) !== -1) {
                this.enterCave();
            } else {
                if (gameMode.mode === "Cave") {
                    const { offset, entrance } = gameMode.cave;
                    const x = Math.round((position.x - offset.x) * localZoom);
                    const y = Math.round((position.y - offset.y) * localZoom);
                    if (x !== entrance.x || y !== entrance.y) {
                        console.log("not at entrance", x, y, entrance);
                        return;
                    }
                }

                if (await this.isOpenSpace(targetPosition, "Overworld")) {
                    this.playerPawn.moveTo(targetPosition, Direction.Down);
                    this.gameMode$.next(GameModes.Overworld());
                } else {
                    console.log("not in open space", targetPosition)
                }
            }
        }
    }

    async movePlayerTo(worldCoordinate: GameCoordinates, facing: Direction) {
        if (!this.playerPawn.isDoneMoving()) {
            return;
        }
        if (await this.isOpenSpace(worldCoordinate)) {
            this.hub.setPosition(worldCoordinate, facing);
            this.playerPawn.moveTo(worldCoordinate, facing, 250);
        } else {
            this.playerPawn.facing = facing;
        }
    }

    async isOpenSpace(worldCoordinate: GameCoordinates, forceGameMode?: "Loading" | "Overworld" | "Detail") {
        const gameMode = this.gameMode$.value;

        const overworldCheck = async () => {
            const category = await this.terrain.getAtAsync(worldCoordinate.x, worldCoordinate.y, false);
            return !category.some(t => !isPassable(t));
        };
        switch (forceGameMode || gameMode.mode) {
            case "Cave":
                const {cave} = gameMode as (typeof GameModes)["_Record"]["Cave"];
                const caveY = Math.round((worldCoordinate.y - cave.offset.y) * localZoom);
                const caveX = Math.round((worldCoordinate.x - cave.offset.x) * localZoom);
                return !cave.isSolid[caveY][caveX];
            case "Loading":
                return false;
            case "Overworld":
                {
                    return overworldCheck();
                }
            case "Detail":
                {
                    const category = await this.terrain.getAtAsync(worldCoordinate.x, worldCoordinate.y, true);
                    return !category.some(t => !isPassable(t));
                }
        }
        function isPassable(category: VisualTerrainType) {
            return category !== "SnowyMountains" && category !== "Mountains" && category !== "ShallowWater" && category !== "DeepWater";
        }
    }

    getZoomFactor() {
        const gameMode = this.gameMode$.value.mode;
        // TODO - I don't know how I feel about this here...
        return gameMode === "Cave" ? localZoom
            : zoomFactor(gameMode === "Detail");
    }
}
