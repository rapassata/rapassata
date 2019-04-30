import { BaseTomato, TomatoShape, UnbakeTomato } from './tomatoes';


// T => T | ?T
export type ProcessRequired<T, R> = R extends true ? T : T | undefined;

// Tomato<I, R, S> => I OR ?I based on R
type UnwrapTomato<T> = T extends BaseTomato<infer I, infer R, infer S> ? ProcessRequired<I, R> : T;

// Tomato<I, R, S> => S
type UnwrapTomatoShape<T> = T extends BaseTomato<infer T, infer R, infer S> ? S : T;

// Tomato<I, R, S> => Value (recursive)
export type TomatoToValues<T, R, S extends TomatoShape> = S extends TomatoShape.Atom
    ? T
    : S extends TomatoShape.Array
    ? Array<UnwrapTomato<UnbakeTomato<T>>>
    : S extends TomatoShape.Record
    ? Record<any, UnwrapTomato<T>>
    : { [key in keyof T]: TomatoToValuesWhole<UnbakeTomato<T[key]>> };

// // Tomato<I, R, S> => Value (recursive)
export type TomatoToValuesWhole<T, U = UnwrapTomato<T>, S = UnwrapTomatoShape<T>> = S extends TomatoShape.Atom
    ? U
    : S extends TomatoShape.Array
    ? Array<UnwrapTomato<UnbakeTomato<U>>>
    : S extends TomatoShape.Record
    ? Record<any, UnwrapTomato<T>>
    : { [key in keyof U]: TomatoToValuesWhole<UnbakeTomato<U[key]>> };

export type Values<T> = T extends BaseTomato<infer X, infer R, infer S> ? ProcessRequired<TomatoToValues<X, R, S>, R> : never;
export const isObject = (x: any) => typeof x === 'object' && x && x.constructor === Object;
