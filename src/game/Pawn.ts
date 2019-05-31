import { GameCoordinates, interpolate } from "./GameCoordinates";

export enum Direction {
    Up,
    Down,
    Right,
    Left
}

export class Pawn {

    lastCenter: GameCoordinates = { x: 0, y: 0};
    targetCenter: GameCoordinates = { x: 0, y: 0};
    lastTime: number = 0;
    targetTime: number = 0;

    facing: Direction = Direction.Down;


    moveTo(target: GameCoordinates, delay: number, facing: Direction) {
        const now = new Date().getTime();
        this.lastCenter = this.center();
        this.lastTime = now;
        this.targetCenter = target;
        this.targetTime = now + delay;
        this.facing = facing;
    }

    isDoneMoving() {
        const now = new Date().getTime();
        return now > this.targetTime;
    }

    center(): GameCoordinates {
        const now = new Date().getTime();
        if (now > this.targetTime) {
            return this.targetCenter;
        }

        const factor = (now - this.lastTime) / (this.targetTime - this.lastTime);
        return interpolate(factor, this.lastCenter, this.targetCenter);
    }
}
