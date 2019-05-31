import { GameCoordinates, interpolate } from "./GameCoordinates";

export class Pawn {

    lastCenter: GameCoordinates = { x: 0, y: 0};
    targetCenter: GameCoordinates = { x: 0, y: 0};
    lastTime: number = 0;
    targetTime: number = 0;


    setCenter(target: GameCoordinates, delay: number) {
        const now = new Date().getTime();
        this.lastCenter = this.center();
        this.lastTime = now;
        this.targetCenter = target;
        this.targetTime = now + delay;
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
