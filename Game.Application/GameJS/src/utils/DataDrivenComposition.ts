
export interface DataDrivenConstructor<TInput, TOutput, TType = string> {
    target: TType;
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
            const args = construct(target.arguments as any, constructors);
            return new ctor(...args) as DataDrivenOutput<TActualInput, TOutput>;
        } catch (ex) {
            throw new Error(ex.message + `\n  at ${target.target}`);
        }
    } else if (Array.isArray(target)) {
        return target.map((v, index) => {
            try {
                return construct(v, constructors)
            } catch (ex) {
                throw new Error(ex.message + `\n  at [${index}]`);
            }
        }) as any as DataDrivenOutput<TActualInput, TOutput>;
    }
    return target as DataDrivenOutput<TActualInput, TOutput>;
}
