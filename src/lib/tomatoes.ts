import { TomatoToValues } from "./helpers";
import { FlowItem } from "./validate";

export const enum TomatoShape {
    Atom = 'Atom',
    Array = 'Array',
    Object = 'Object',
    Record = 'Record',
    Or = 'Or',
}

export type BakeTomato<T, R, S> = S extends TomatoShape.Atom ? AtomTomato<T, R> :
    S extends TomatoShape.Array ? ArrayTomato<T, R> :
    S extends TomatoShape.Object ? ObjectTomato<T, R> :
    S extends TomatoShape.Record ? RecordTomato<T, R> :
    S extends TomatoShape.Or ? OrTomato<T, R> :
    never;

export type UnbakeTomato<T> = T extends AtomTomato<infer U, infer R>
    ? BaseTomato<U, R, TomatoShape.Atom>
    : T extends ArrayTomato<infer U, infer R>
    ? BaseTomato<U, R, TomatoShape.Array>
    : T extends ObjectTomato<infer U, infer R>
    ? BaseTomato<U, R, TomatoShape.Object>
    : T extends RecordTomato<infer U, infer R>
    ? BaseTomato<U, R, TomatoShape.Record>
    : T;

type ReturnToShape<Y> = Y extends Array<infer I> ? TomatoShape.Array :
    Y extends object ? TomatoShape.Object : TomatoShape.Atom;

export interface BaseTomato<T, R, S extends TomatoShape> {
    shape: S;
    required: boolean;
    default?: TomatoToValues<T, R, S>;
    flow: Array<FlowItem>;

    require: () => BakeTomato<T, true, S>;
    defaultTo: (defVal: TomatoToValues<T, R, S>) => BakeTomato<T, true, S>;
    // transform: <Y>(t: (x: TomatoToValues<T, R, S>) => Y) => BakeTomato<Y, R, ReturnToShape<Y>>;
    transform: (t: (x: TomatoToValues<T, R, S>) => T) => BakeTomato<T, R, S>;
    validate: (fn: (val: TomatoToValues<T, R, S>) => Promise<boolean> | boolean, message?: string) => BakeTomato<T, R, S>;
}

type s = BakeTomato<boolean | string, true, TomatoShape.Or>

export interface AtomTomato<T, R = false> extends BaseTomato<T, R, TomatoShape.Atom> {
    shape: TomatoShape.Atom;
}
export interface ArrayTomato<T, R = false> extends BaseTomato<T, R, TomatoShape.Array> {
    shape: TomatoShape.Array;
    item: T;
}
export interface ObjectTomato<T, R = false> extends BaseTomato<T, R, TomatoShape.Object> {
    structure: T;
    shape: TomatoShape.Object;
}
export interface RecordTomato<T, R = false> extends BaseTomato<T, R, TomatoShape.Record> {
    item: T;
    shape: TomatoShape.Record;
}
export interface OrTomato<T, R = false> extends BaseTomato<T, R, TomatoShape.Or> {
    shape: TomatoShape.Or;
    fn: 'or';
}

export type Tomato<T, R = false> = AtomTomato<T, R> | ArrayTomato<T, R> | ObjectTomato<T, R> | RecordTomato<T, R> | OrTomato<T, R>;

// Builders
export interface Breeds {
    string: AtomTomato<string>;
    number: AtomTomato<number>;
    boolean: AtomTomato<boolean>;
    any: AtomTomato<any>;
    array: <T extends Tomato<any, any>>(x: T) => ArrayTomato<T>;
    objectOf: <V extends Tomato<any, any>>(val: V) => RecordTomato<Record<any, V>>;
    object: <V>(val: V) => ObjectTomato<V>;
}

const x = '' as any as AtomTomato<string>;
x.transform(x =>)
x.validate(x =>)