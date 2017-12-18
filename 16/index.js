const { compose, map, curry, split, find, fromPairs } = require('ramda');
const { applyPattern } = require('../shared');

// Sue is { num: String, items: { String: Number } }

// String -> { String: Number }
const parseItems = compose(
    map(Number),
    fromPairs,
    map(split(': ')),
    split(', ')
);

// String -> Sue
const parseSue = compose(
    ([, num, pets]) => ({ num, items: parseItems(pets) }),
    applyPattern(/^Sue (\d+): (.+)$/),
);

// (Number -> Number -> String -> Boolean) -> { String: Number} -> Sue -> Boolean
const isMatch = curry((itemMatcher, items, sue) =>
    Object.keys(sue.items).every(k => itemMatcher(sue.items[k], items[k], k))
);

// (Number -> Number -> String -> Boolean)
const newMatcher = (sueValue, foundValue, item) => {
    switch (item) {
        case 'cats':
        case 'trees': 
            return sueValue > foundValue;
        case 'pomeranians':
        case 'goldfish':
            return sueValue < foundValue;
        default:
            return sueValue === foundValue;
    }
};


// (Number -> Number -> String -> Boolean)
const simpleMatcher = (sueValue, itemValue) => sueValue === itemValue;

const itemsDetected = {
    children: 3,
    cats: 7,
    samoyeds: 2,
    pomeranians: 3,
    akitas: 0,
    vizslas: 0,
    goldfish: 5,
    trees: 3,
    cars: 2,
    perfumes: 1
};

// (Number -> Number -> String -> Boolean) -> { String: Number } -> [Sue] -> Sue
const findSue = matcher => find(isMatch(matcher, itemsDetected));

// [Sue] -> Sue
const p1 = findSue(simpleMatcher);

// [Sue] -> Sue
const p2 = findSue(newMatcher);

module.exports = {
    solution: {
        ps: [p1, p2],
        type: 'lines',
        pre: parseSue
    }
};