import {
    ArrayTomato,
    AtomTomato,
    ObjectTomato,
    TomatoShape,
    Breeds,
    RecordTomato,
    Tomato,
    OrTomato,
} from './tomatoes';
import { FlowType } from './validate';
import { isObject } from './helpers';

type Or<A extends boolean, B extends boolean> = A extends true ? B extends true ? true : false : false;
export const or = <A extends Tomato<At, Ar>, B extends Tomato<Bt, Br>, At, Ar extends boolean, Bt, Br extends boolean>(a: A, b: B) => {
    const node: OrTomato<At | Bt, Or<Ar, Br>> = {
        ...a as any,
        ...b as any,
        flow: [],
        required: false,
        default: undefined,
        validate: (validate, message = '') => ({
            ...node,
            flow: [...node.flow, { message, validate, type: FlowType.Validate }],
        }),
        transform: (transform) => ({
            ...node,
            flow: [...node.flow, { transform, type: FlowType.Transform }],
        }),
        require: () => ({ ...node, required: true }),
        defaultTo: x => ({ ...node, default: x }),
    }
}

const baseNode = <B extends { shape: TomatoShape.Atom }, T>(base: B) => {
    const node: AtomTomato<T> = {
        ...base,
        flow: [],
        required: false,
        default: undefined,
        validate: (validate, message = '') => ({
            ...node,
            flow: [...node.flow, { message, validate, type: FlowType.Validate }],
        }),
        transform: (transform) => ({
            ...node,
            flow: [...node.flow, { transform, type: FlowType.Transform }],
        }),
        require: () => ({ ...node, required: true }),
        defaultTo: x => ({ ...node, default: x }),
    };
    return node;
};

const atomNode = <T>() => {
    const node: AtomTomato<T> = baseNode({
        shape: TomatoShape.Atom,
    });
    return node;
};

export const string: AtomTomato<string> = (() => {
    const node = atomNode<string>();
    return node.validate(x => typeof x === 'string', 'Not a string');
})();

export const any: AtomTomato<any> = (() => {
    return atomNode<any>();
})();

export const number: AtomTomato<number> = (() => {
    const node = atomNode<number>();
    return node.validate(x => typeof x === 'number', 'Not a number');
})();

export const boolean: AtomTomato<boolean> = (() => {
    const node = atomNode<boolean>();
    return node.validate(x => typeof x === 'boolean', 'Not a boolean');
})();

export const array = <T extends Tomato<any, any>>(item: T): ArrayTomato<T> => {
    const node: ArrayTomato<T> = {
        item,
        shape: TomatoShape.Array,
        flow: [],
        required: false,
        default: undefined,
        validate: (validate, message = '') => ({
            ...node,
            flow: [...node.flow, { message, validate, type: FlowType.Validate }],
        }),
        transform: (transform) => ({
            ...node,
            flow: [...node.flow, { transform, type: FlowType.Transform }],
        }),
        require: () => ({ ...node, required: true }),
        defaultTo: x => ({ ...node, default: x }),
    };
    return node.validate(x => Array.isArray(x), 'Not an array');
};


export const object = <T>(structure: T): ObjectTomato<T> => {
    const node: ObjectTomato<T> = {
        structure,
        shape: TomatoShape.Object,
        flow: [],
        required: false,
        default: undefined,
        validate: (validate, message = '') => ({
            ...node,
            flow: [...node.flow, { message, validate, type: FlowType.Validate }],
        }),
        transform: (transform) => ({
            ...node,
            flow: [...node.flow, { transform, type: FlowType.Transform }],
        }),
        require: () => ({ ...node, required: true }),
        defaultTo: x => ({ ...node, default: x }),
    };
    return node.validate(isObject, 'Not an object');
};

export const objectOf = <T extends Tomato<any, any>>(val: T): RecordTomato<T> => {
    const node: RecordTomato<T> = {
        item: val,
        shape: TomatoShape.Record,
        flow: [],
        required: false,
        default: undefined,
        validate: (validate, message = '') => ({
            ...node,
            flow: [...node.flow, { message, validate, type: FlowType.Validate }],
        }),
        transform: (transform) => ({
            ...node,
            flow: [...node.flow, { transform, type: FlowType.Transform }],
        }),
        require: () => ({ ...node, required: true }),
        defaultTo: x => ({ ...node, default: x }),
    };
    return node.validate(isObject, 'Not an object');
};

export const breeds: Breeds = {
    string,
    number,
    boolean,
    object,
    // TODO:
    objectOf: objectOf as any,
    array,
    any,
};
