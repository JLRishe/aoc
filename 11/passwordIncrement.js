const { __, compose, memoizeWith, ifElse, identity, init, last, equals, concat, join, applySpec, test, always } = require('ramda');
var _ = require('lodash');

const isZ = equals('z');

const nextChar = memoizeWith(
    identity,
    c => String.fromCharCode(c.charCodeAt(0) + 1)
);

const incrementChar = memoizeWith(
    identity,
    compose(
        ifElse(test(/ilo/), nextChar, identity),
        nextChar
    )
)

const endsWithZ = compose(isZ, last);
const carry = pw => compose(concat(__, 'a'), incrementPassword, init)(pw);
const incrementLast = compose(
    join(''),
    applySpec([init, compose(incrementChar, last)])
);

const incrementPassword = ifElse(endsWithZ, carry, incrementLast);
    
module.exports = {
    nextChar
    , incrementPassword
};
