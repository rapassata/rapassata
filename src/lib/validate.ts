import { AnyShapeTomato, TomatoShape } from './tomatoes';
import { isObject } from './helpers';

export enum FlowType {
    Transform = 'Transform',
    Validate = 'Validate',
}

interface TransformElement<I, O> {
    type: FlowType.Transform;
    transform: (x: I) => O;
}

interface ValidationElement<T> {
    type: FlowType.Validate;
    validate: (x: T) => Promise<Boolean> | boolean;
    message: string;
}

interface ValidationError {
    message: string;
    value: any;
    result: any;
}

export type FlowItem<T = any, O = any> = TransformElement<T, O> | ValidationElement<T>;

const runFlow = (flow: FlowItem[], value: any) => {
    const errors: ValidationError[] = [];
    flow.reduce((value, flowItem) => {
        if (flowItem.type === FlowType.Validate) {
            const result = flowItem.validate(value);
            if (!result) {
                errors.push({ value, message: flowItem.message, result });
            }
        } else if (flowItem.type === FlowType.Transform) {
            value = flowItem.transform(value);
        }
    }, value);
    return {
        errors,
        value,
    };
};

export const validate = (schema: AnyShapeTomato, value: any): any => {
    const flowRes = runFlow(schema.flow, value);
    if (schema.required && value === undefined) {
        flowRes.errors.push({
            message: 'Missing required value',
            value,
            result: false,
        });
        return flowRes;
    }
    if (schema.shape === TomatoShape.Atom) {
        return flowRes;
    }
    if (schema.shape === TomatoShape.Array) {
        return {
            ...flowRes,
            children: (Array.isArray(value) ? value : []).map(v => validate(schema.item, v)),
        };
    }
    value = isObject(value) ? value : {};
    if (schema.shape === TomatoShape.Record) {
        return {
            ...flowRes,
            structure: Object.keys(value).reduce(
                (res, key) => {
                    res[key] = validate(schema.item, value[key]);
                    return res;
                },
                {} as any
            ),
        }
    }
    return {
        ...flowRes,
        structure: Object.keys(schema.structure).reduce(
            (res, key) => {
                res[key] = validate(schema.structure[key], value[key]);
                return res;
            },
            {} as any
        ),
    };
};
