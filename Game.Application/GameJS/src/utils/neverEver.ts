export function neverEver(maybe: never): never {
    throw new Error("This should never: " + maybe);
}