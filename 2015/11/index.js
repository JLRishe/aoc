const { compose, memoizeWith, identity, prop, zip, uniq, length, partial } = require('ramda');
const { isValidPassword } = require('./passwordValidate');
const { incrementPassword } = require('./passwordIncrement');
const { genTransform, genFilter, genDrop, genHead } = require('func-generators');

const nextValidPassword = memoizeWith(
    identity,
    s => compose(
        genHead,
        genFilter(isValidPassword),
        genDrop(1)
    )(genTransform(incrementPassword, s))
);

const p1 = nextValidPassword;
const p2 = compose(nextValidPassword, nextValidPassword);

module.exports = {
    solution: {
        type: 'input',
        ps: [p1, p2]
    }
}