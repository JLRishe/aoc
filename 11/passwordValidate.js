const { __, compose, filter, test, memoizeWith, zip, tail, uniq, length, gte, aperture, join, any, both, complement } = require('ramda');
const { nextChar } = require('./passwordIncrement');

const isStepUp = memoizeWith(
    (x, y) => x + y,
    (x, y) => x !== 'z' && nextChar(x) === y
);

const isStraight = memoizeWith(
    join(''),
    ([x, y, z]) => isStepUp(x, y) && isStepUp(y, z)
);

const hasIncreasingStraight = compose(
    any(isStraight),
    aperture(3)
);

const hasBadCharacter = test(/[iol]/);

const hasTwoPairs = compose(
    gte(__, 2),
    length,
    uniq,
    filter(([x, y]) => x === y),
    st => zip(st, tail(st))
);

const isValidPassword = both(
    both(hasIncreasingStraight, complement(hasBadCharacter)),
    hasTwoPairs
)

module.exports = {
    hasTwoPairs
    , isValidPassword
    , hasIncreasingStraight
};