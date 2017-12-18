const { compose, map, curry, values, always, sum, ifElse, contains, both, applySpec, cond, equals, identity, T, type, applyTo } = require('ramda');
const { probe } = require('../shared');

// {a: b} -> b -> a -> b
const lookup = curry((lu, def, val) => val in lu ? lu[val] : def);

const totaller = excludeRed => {
    // [*] -> Number
    const totalArray = arr => sum(map(total, arr));
    
    // Boolean -> [*] -> Boolean
    const excludeValues = both(always(excludeRed), contains('red'));
    
    // Boolean -> Object -> Number
    const totalObject = compose(
        ifElse(excludeValues, always(0), totalArray),
        values
    );
    
    // Boolean -> String -> * -> Number
    const action = lookup({ 
        Array : totalArray, 
        Object: totalObject, 
        Number: identity 
    }, always(0));
    
    // * -> * -> Number
    const actionForVal = compose(action, type);
    
    // * -> Number
    const total = val => action(type(val))(val);   
    
    return total;
};

// String -> *
const parse = str => JSON.parse(str);

// String -> Number
const p1 = compose(totaller(false), parse);
// String -> Number
const p2 = compose(totaller(true) , parse);

module.exports = {
    solution: {
        type: 'input',
        ps: [p1, p2]
    }
};