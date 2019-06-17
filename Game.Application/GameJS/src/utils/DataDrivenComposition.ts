
export interface DataDrivenConstructor {
    target: string;
    arguments: DataDrivenValue[]
}

export type DataDrivenValue = DataDrivenConstructor | number;

export function construct<T = any>(target: number, constructors: Record<string, { new(...args: (T | number)[]): T }>): number;
export function construct<T = any>(target: DataDrivenConstructor, constructors: Record<string, { new(...args: (T | number)[]): T }>): T;
export function construct<T = any>(target: DataDrivenValue, constructors: Record<string, { new(...args: (T | number)[]): T }>): T | number;
export function construct<T = any>(target: DataDrivenValue, constructors: Record<string, { new(...args: (T | number)[]): T }>): T | number {
    if (typeof target === "number") {
        return target;
    } else {
        const ctor = constructors[target.target];
        try {
            return new ctor(...target.arguments.map(v => construct(v, constructors)));
        } catch (ex) {
            throw new Error(ex.message + `\n  at ${target.target}`);
        }
    }
}
