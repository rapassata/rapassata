import { object, number, string, array, objectOf } from "./breeds";
import { validate } from "./validate";

const schema = object({
    user: object({
        age: number.defaultTo(18),
        address: object({
            street: string.validate(x => x !== ''),
            number: number,
        }),
        colors: array(string.defaultTo('red')).defaultTo([]),
        ratedHobbies: objectOf(number).require(),
    }),
});

validate(schema, {});