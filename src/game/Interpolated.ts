
export interface Interpolated<T> {
    readonly value: T;
    readonly isComplete: boolean;
}

export function isInterpolated<T>(maybeInterpolated: Interpolated<T> | T): maybeInterpolated is Interpolated<T> {
    return "isComplete" in maybeInterpolated;
}

class InterpolatedImpl<T> implements Interpolated<T> {
    private readonly startValue: T;
    private readonly endValue: T;
    private readonly startTime: number;
    private readonly endTime: number;
    private readonly interpolate: (factor: number, start: T, end: T) => T;
    constructor(startValue: T, endValue: T, startTime: number, endTime: number, interpolate: (factor: number, start: T, end: T) => T) {
        this.startValue = startValue;
        this.endValue = endValue;
        this.startTime = startTime;
        this.endTime = endTime;
        this.interpolate = interpolate;
    }

    get value() {
        const now = Date.now();
        if (now > this.endTime) {
            return this.endValue;
        }
        const factor = (now - this.startTime) / (this.endTime - this.startTime);
        return this.interpolate(factor, this.startValue, this.endValue);
    }
    get isComplete() {
        const now = Date.now();
        return now > this.endTime;
    }
}

export function makeInterpolated<T>(startValue: T): Interpolated<T>;
export function makeInterpolated<T>(startValue: T, endValue: T, startTime: number, endTime: number, interpolate: (factor: number, start: T, end: T) => T): Interpolated<T>;
export function makeInterpolated<T>(startValue: T, endValue?: T, startTime?: number, endTime?: number, interpolate?: (factor: number, start: T, end: T) => T): Interpolated<T> {
    if (arguments.length === 1) {
        return { value: startValue, isComplete: true };
    }
    return new InterpolatedImpl(startValue, endValue!, startTime!, endTime!, interpolate!);
}
