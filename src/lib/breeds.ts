import {
    AnyShapeTomato,
    ArrayTomato,
    AtomShapedTomato,
    ObjectTomato,
    TomatoShape,
    Breeds,
    RecordTomato,
} from './tomatos';
import { FlowType } from './validate';
import { isObject } from './helpers';

const baseNode = <B extends { shape: TomatoShape.Atom }, T>(base: B) => {
    const node: AtomShapedTomato<T> = {
        ...base,
        flow: [],
        required: false,
        default: undefined,
        validate: (validate, message = '') => ({
            ...node,
            flow: [...node.flow, { message, validate, type: FlowType.Validate }],
        }),
        require: () => ({ ...node, required: true }),
        defaultTo: x => ({ ...node, default: x }),
    };
    return node;
};

const atomNode = <T>() => {
    const node: AtomShapedTomato<T> = baseNode({
        shape: TomatoShape.Atom,
    });
    return node;
};

export const string: AtomShapedTomato<string> = (() => {
    const node = atomNode<string>();
    return node.validate(x => typeof x === 'string', 'Not a string');
})();

export const any: AtomShapedTomato<any> = (() => {
    return atomNode<any>();
})();

export const number: AtomShapedTomato<number> = (() => {
    const node = atomNode<number>();
    return node.validate(x => typeof x === 'number', 'Not a number');
})();

export const boolean: AtomShapedTomato<boolean> = (() => {
    const node = atomNode<boolean>();
    return node.validate(x => typeof x === 'boolean', 'Not a boolean');
})();

export const array = <T extends AnyShapeTomato>(item: T): ArrayTomato<T> => {
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
        require: () => ({ ...node, required: true }),
        defaultTo: x => ({ ...node, default: x }),
    };
    return node.validate(isObject, 'Not an object');
};

export const objectOf = <T extends AnyShapeTomato>(val: T): RecordTomato<T> => {
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
