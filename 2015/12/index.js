const { compose, map, curry, values, always, sum, ifElse, contains, both, applySpec, cond, equals, identity, T, type, applyTo } = require('ramda');
const { probe } = require('../shared');

// [*] -> Number
const totalArray = excludeRed => compose(sum, map(total(excludeRed)));

// Boolean -> [*] -> Boolean
const excludeValues = excludeRed => both(always(excludeRed), contains('red'));

// Boolean -> Object -> Number
const totalObject = excludeRed => compose(
    ifElse(excludeValues(excludeRed), always(0), totalArray(excludeRed)),
    values
);

// {a: b} -> b -> a -> b
const lookup = curry((lu, def, val) => val in lu ? lu[val] : def);

// Boolean -> String -> * -> Number
const action = (excludeRed) => lookup({ 
    Array : totalArray(excludeRed), 
    Object: totalObject(excludeRed), 
    Number: identity 
}, always(0));

// Boolean -> * -> Number
const total = curry((excludeRed, val) => compose(
    applyTo(val),
    action(excludeRed),
    type
)(val));

// String -> *
const parse = str => JSON.parse(str);

// String -> Number
const p1 = compose(total(false), parse);
// String -> Number
const p2 = compose(total(true) , parse);

module.exports = {
    solution: {
        type: 'input',
        ps: [p1, p2]
    }
};