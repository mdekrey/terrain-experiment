
export interface DataDrivenConstructor<TInput, TOutput> {
    target: string;
    arguments: DataDrivenInput<TInput, TOutput>[]
}
export type DataDrivenInput<TInput, TOutput> = TInput | DataDrivenConstructor<TInput, TOutput>;

function isDataDrivenConstructor(maybeCtor: any): maybeCtor is DataDrivenConstructor<any, any> {
    return maybeCtor.target;
}

export type DataDrivenOutput<TInput, TOutput> = TInput extends DataDrivenConstructor<any, any> ? TOutput : Exclude<TInput, DataDrivenConstructor<any, any>>;

export type DataDrivenConstructorRecords<TInput, TOutput> = Record<string, { new(...args: DataDrivenOutput<TInput, TOutput>[]): TOutput }>
export function construct<TInput, TOutput, TActualInput extends DataDrivenInput<TInput, TOutput>>(
    target: TActualInput,
    constructors: DataDrivenConstructorRecords<TInput, TOutput>
): DataDrivenOutput<TActualInput, TOutput> {
    if (isDataDrivenConstructor(target)) {
        const ctor = constructors[target.target];
        try {
            const args = target.arguments.map(v => construct(v, constructors))
            return new ctor(...args) as DataDrivenOutput<TActualInput, TOutput>;
        } catch (ex) {
            throw new Error(ex.message + `\n  at ${target.target}`);
        }
    }
    return target as DataDrivenOutput<TActualInput, TOutput>;
}
