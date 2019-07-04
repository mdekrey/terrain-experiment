import { GameCoordinates, interpolate } from "./GameCoordinates";
import { Interpolated, makeInterpolated, isInterpolated } from "./Interpolated";
import { Direction } from "./Direction";
import { PawnType } from "./PawnType";

export class Pawn {

    private _position: GameCoordinates | Interpolated<GameCoordinates> = { x: 0, y: 0};

    facing: Direction = Direction.Down;
    type: PawnType = PawnType.Hero;


    moveTo(target: GameCoordinates, facing: Direction, delay: number = 0) {
        const now = Date.now();
        this._position = delay
            ? makeInterpolated(this.position(), target, now, now + delay, interpolate)
            : target;
        this.facing = facing;
    }

    isDoneMoving() {
        return isInterpolated(this._position) ? this._position.isComplete : true;
    }

    readonly position = (): GameCoordinates => {
        return isInterpolated(this._position) ? this._position.value() : this._position;
    }
}
