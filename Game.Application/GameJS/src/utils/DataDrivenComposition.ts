
export interface DataDrivenConstructor<TInput, TOutput> {
    target: string;
    arguments: DataDrivenInput<TInput, TOutput>[]
}
export type DataDrivenInput<TInput, TOutput> = TInput | DataDrivenConstructor<TInput, TOutput>;

function isDataDrivenConstructor(maybeCtor: any): maybeCtor is DataDrivenConstructor<any, any> {
    return maybeCtor.target;
}

export type DataDrivenOutput<TInput, TOutput> = TInput extends DataDrivenConstructor<any, any> ? TOutput : Exclude<TInput, DataDrivenConstructor<any, any>>;

export function construct<TInput, TOutput>(
    target: DataDrivenInput<TInput, TOutput>,
    constructors: Record<string, { new(...args: DataDrivenOutput<TInput, TOutput>[]): TOutput }>
): DataDrivenOutput<DataDrivenInput<TInput, TOutput>, TOutput> {
    if (isDataDrivenConstructor(target)) {
        const ctor = constructors[target.target];
        try {
            const args = target.arguments.map(v => construct(v, constructors)) as DataDrivenOutput<TInput, TOutput>[];
            return new ctor(...args) as any;
        } catch (ex) {
            throw new Error(ex.message + `\n  at ${target.target}`);
        }
    }
    return target as DataDrivenOutput<TInput, TOutput>;
}
