const { compose, filter, sum, equals, map, length, memoizeWith, identity, converge, join, apply, isEmpty, head, tail, concat } = require('ramda');
const { probe } = require('../shared');

// [Number] -> [[Number]]
const combinations = (items) => {
    if (isEmpty(items)) {
        return [[]];
    }

    const current = head(items);
    const sub = combinations(tail(items));
    const withCurrent = map(concat([current]), sub);
    
    return [...withCurrent, ...sub];
};

// [Number] -> [[Number]]
const allValidCombinations = memoizeWith(
    join(','),
    compose(
        filter(compose(equals(150), sum)),
        combinations
    )
);

// [Number] -> Number
const p1 = compose(
    length,
    allValidCombinations
);

// [[*]] -> Number
const minLength = compose(
    apply(Math.min),
    map(length)
);

// [Number] -> Number
const p2 = compose(
    length,
    converge(
        (c, ml) => filter(compose(equals(ml), length), c),
        [identity, minLength]
    ),
    allValidCombinations
);

module.exports = {
    solution: {
        ps: [p1, p2],
        type: 'lines',
        pre: Number
    }
};